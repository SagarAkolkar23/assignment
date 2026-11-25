import Modal from '../../../components/Modal';

export default function PatientDetailsModal({ patient, onClose }) {
  return (
    <Modal isOpen={Boolean(patient)} title="Patient Details" onClose={onClose}>
      {patient && (
        <div className="detail-list">
          <div className="detail-row">
            <span>Patient ID</span>
            <strong>#{patient.id}</strong>
          </div>
          <div className="detail-row">
            <span>Name</span>
            <strong>{patient.name}</strong>
          </div>
          <div className="detail-row">
            <span>Age / Gender</span>
            <span>
              {patient.age} yrs / {patient.gender}
            </span>
          </div>
          <div className="detail-row">
            <span>Phone</span>
            <span>{patient.phone}</span>
          </div>
          <div className="detail-row">
            <span>Email</span>
            <span>{patient.email || '—'}</span>
          </div>
          <div className="detail-row">
            <span>Address</span>
            <span>{patient.address || '—'}</span>
          </div>
          <div className="detail-row">
            <span>Medical History</span>
            <span>{patient.medical_history || 'None recorded'}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
