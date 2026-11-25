import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import AlertBanner from '../../components/AlertBanner';
import { extractErrorMessage } from '../../services/apiClient';
import PatientDetailsModal from './components/PatientDetailsModal';
import PatientFormModal from './components/PatientFormModal';
import PatientTable from './components/PatientTable';
import {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from './services/patientsService';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load patients.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.phone.toLowerCase().includes(query) ||
        (p.email || '').toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  const handleOpenCreate = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleViewDetails = async (patientId) => {
    setError('');
    try {
      const details = await getPatientById(patientId);
      setSelectedPatient(details);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to fetch patient details.'));
    }
  };

  const handleSave = async (payload) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        const updated = await updatePatient(editingPatient.id, payload);
        setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setSuccess(`Updated patient "${updated.name}".`);
      } else {
        const created = await createPatient(payload);
        setPatients((prev) => [created, ...prev]);
        setSuccess(`Added patient "${created.name}".`);
      }
      setIsFormOpen(false);
      setEditingPatient(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save patient record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (patient) => {
    if (!window.confirm(`Delete patient "${patient.name}"?`)) return;
    setError('');
    setSuccess('');
    try {
      await deletePatient(patient.id);
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
      setSuccess(`Deleted patient "${patient.name}".`);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete patient.'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Manage patient records created under your account.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {filteredPatients.length} patient{filteredPatients.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoading ? (
          <div className="empty-state">Loading patients...</div>
        ) : (
          <PatientTable
            patients={filteredPatients}
            onView={handleViewDetails}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <PatientFormModal
        isOpen={isFormOpen}
        initialData={editingPatient}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={handleSave}
        isSubmitting={isSubmitting}
      />

      <PatientDetailsModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
