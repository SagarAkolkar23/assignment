import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';

const EMPTY_FORM = {
  name: '',
  specialization: '',
  email: '',
  phone: '',
  years_of_experience: 0,
};

export default function DoctorFormModal({ isOpen, initialData, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        specialization: initialData.specialization || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        years_of_experience: initialData.years_of_experience ?? 0,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      years_of_experience: Number(formData.years_of_experience),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Edit Doctor' : 'Add New Doctor'}
      onClose={onClose}
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="doctor-name">Full Name</label>
            <input
              id="doctor-name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Sarah Connor"
            />
          </div>

          <div className="form-field">
            <label htmlFor="doctor-specialization">Specialization</label>
            <input
              id="doctor-specialization"
              name="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Cardiology"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="doctor-email">Email</label>
            <input
              id="doctor-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@hospital.org"
            />
          </div>

          <div className="form-field">
            <label htmlFor="doctor-phone">Phone</label>
            <input
              id="doctor-phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-888-9999"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="doctor-experience">Years of Experience</label>
          <input
            id="doctor-experience"
            name="years_of_experience"
            type="number"
            min={0}
            max={80}
            required
            value={formData.years_of_experience}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
