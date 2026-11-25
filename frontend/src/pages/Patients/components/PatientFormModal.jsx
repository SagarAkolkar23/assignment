import { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';

const EMPTY_FORM = {
  name: '',
  age: '',
  gender: 'Male',
  phone: '',
  email: '',
  address: '',
  medical_history: '',
};

export default function PatientFormModal({ isOpen, initialData, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age ?? '',
        gender: initialData.gender || 'Male',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        medical_history: initialData.medical_history || '',
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
      age: Number(formData.age),
      email: formData.email.trim() || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Edit Patient' : 'Add New Patient'}
      onClose={onClose}
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="patient-name">Full Name</label>
            <input
              id="patient-name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div className="form-field">
            <label htmlFor="patient-age">Age</label>
            <input
              id="patient-age"
              name="age"
              type="number"
              min={0}
              max={150}
              required
              value={formData.age}
              onChange={handleChange}
              placeholder="35"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="patient-gender">Gender</label>
            <select id="patient-gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="patient-phone">Phone</label>
            <input
              id="patient-phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-234-5678"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="patient-email">Email (optional)</label>
          <input
            id="patient-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="patient@example.com"
          />
        </div>

        <div className="form-field">
          <label htmlFor="patient-address">Address</label>
          <textarea
            id="patient-address"
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
          />
        </div>

        <div className="form-field">
          <label htmlFor="patient-history">Medical History</label>
          <textarea
            id="patient-history"
            name="medical_history"
            rows={3}
            value={formData.medical_history}
            onChange={handleChange}
            placeholder="Allergies, chronic conditions, notes..."
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
