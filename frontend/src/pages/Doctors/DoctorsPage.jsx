import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import AlertBanner from '../../components/AlertBanner';
import { extractErrorMessage } from '../../services/apiClient';
import DoctorDetailsModal from './components/DoctorDetailsModal';
import DoctorFormModal from './components/DoctorFormModal';
import DoctorTable from './components/DoctorTable';
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from './services/doctorsService';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const loadDoctors = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load doctors.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return doctors;
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.specialization.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query)
    );
  }, [doctors, searchQuery]);

  const handleOpenCreate = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleViewDetails = async (doctorId) => {
    setError('');
    try {
      const details = await getDoctorById(doctorId);
      setSelectedDoctor(details);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to fetch doctor details.'));
    }
  };

  const handleSave = async (payload) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      if (editingDoctor) {
        const updated = await updateDoctor(editingDoctor.id, payload);
        setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        setSuccess(`Updated Dr. ${updated.name}.`);
      } else {
        const created = await createDoctor(payload);
        setDoctors((prev) => [created, ...prev]);
        setSuccess(`Added Dr. ${created.name}.`);
      }
      setIsFormOpen(false);
      setEditingDoctor(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to save doctor record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Delete Dr. ${doctor.name}?`)) return;
    setError('');
    setSuccess('');
    try {
      await deleteDoctor(doctor.id);
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
      setSuccess(`Deleted Dr. ${doctor.name}.`);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to delete doctor.'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p>View and manage registered doctors across specializations.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          Add Doctor
        </button>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, specialization, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {filteredDoctors.length} doctor{filteredDoctors.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoading ? (
          <div className="empty-state">Loading doctors...</div>
        ) : (
          <DoctorTable
            doctors={filteredDoctors}
            onView={handleViewDetails}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <DoctorFormModal
        isOpen={isFormOpen}
        initialData={editingDoctor}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDoctor(null);
        }}
        onSubmit={handleSave}
        isSubmitting={isSubmitting}
      />

      <DoctorDetailsModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />
    </div>
  );
}
