import Modal from '../../../components/Modal';

export default function DoctorDetailsModal({ doctor, onClose }) {
  return (
    <Modal isOpen={Boolean(doctor)} title="Doctor Details" onClose={onClose}>
      {doctor && (
        <div className="detail-list">
          <div className="detail-row">
            <span>Doctor ID</span>
            <strong>#{doctor.id}</strong>
          </div>
          <div className="detail-row">
            <span>Name</span>
            <strong>Dr. {doctor.name}</strong>
          </div>
          <div className="detail-row">
            <span>Specialization</span>
            <span>{doctor.specialization}</span>
          </div>
          <div className="detail-row">
            <span>Email</span>
            <span>{doctor.email}</span>
          </div>
          <div className="detail-row">
            <span>Phone</span>
            <span>{doctor.phone}</span>
          </div>
          <div className="detail-row">
            <span>Experience</span>
            <span>{doctor.years_of_experience} years</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
