import { useCallback, useEffect, useState } from 'react';
import AlertBanner from '../../components/AlertBanner';
import { extractErrorMessage } from '../../services/apiClient';
import AssignDoctorForm from './components/AssignDoctorForm';
import MappingTable from './components/MappingTable';
import PatientDoctorsLookup from './components/PatientDoctorsLookup';
import {
  createMapping,
  deleteMapping,
  getMappingOptions,
  getMappings,
  getMappingsByPatient,
} from './services/mappingsService';

export default function MappingsPage() {
  const [mappings, setMappings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activePatientId, setActivePatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [mappingsData, options] = await Promise.all([getMappings(), getMappingOptions()]);
      setMappings(mappingsData);
      setPatients(options.patients);
      setDoctors(options.doctors);
      setActivePatientId(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load patient-doctor mappings.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAssign = async (payload) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const created = await createMapping(payload);
      if (!activePatientId || activePatientId === created.patient) {
        setMappings((prev) => [created, ...prev]);
      }
      setSuccess(`Assigned Dr. ${created.doctor_details?.name || created.doctor} to ${created.patient_name}.`);
      return true;
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to assign doctor to patient.'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupByPatient = async (patientId) => {
    setIsLoading(true);
    setError('');
    try {
      const filtered = await getMappingsByPatient(patientId);
      setMappings(filtered);
      setActivePatientId(patientId);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load mappings for patient.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLookup = async () => {
    setIsLoading(true);
    setError('');
    try {
      const all = await getMappings();
      setMappings(all);
      setActivePatientId(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to reload mappings.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (mapping) => {
    if (!window.confirm(`Remove Dr. ${mapping.doctor_details?.name || mapping.doctor} from ${mapping.patient_name}?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await deleteMapping(mapping.id);
      setMappings((prev) => prev.filter((m) => m.id !== mapping.id));
      setSuccess('Mapping removed.');
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to remove mapping.'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Patient-Doctor Mappings</h1>
          <p>Assign doctors to patients and review active care assignments.</p>
        </div>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      <div className="two-col-grid">
        <AssignDoctorForm
          patients={patients}
          doctors={doctors}
          onAssign={handleAssign}
          isSubmitting={isSubmitting}
        />
        <PatientDoctorsLookup
          patients={patients}
          onLookup={handleLookupByPatient}
          onClear={handleClearLookup}
          activePatientId={activePatientId}
        />
      </div>

      <div className="card">
        <div className="toolbar">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
            {activePatientId ? `Doctors Assigned to Patient #${activePatientId}` : 'All Mappings'}
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {mappings.length} assignment{mappings.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoading ? (
          <div className="empty-state">Loading mappings...</div>
        ) : (
          <MappingTable mappings={mappings} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
