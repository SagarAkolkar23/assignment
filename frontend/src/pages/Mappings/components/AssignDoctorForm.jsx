import { useState } from 'react';
import { Link2 } from 'lucide-react';

export default function AssignDoctorForm({ patients, doctors, onAssign, isSubmitting }) {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onAssign({
      patient: Number(patientId),
      doctor: Number(doctorId),
      notes: notes.trim(),
    });
    if (ok) {
      setNotes('');
    }
  };

  return (
    <div className="card">
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Assign Doctor to Patient</h2>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="mapping-patient">Patient</label>
          <select
            id="mapping-patient"
            required
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Select a patient...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} — {p.name} ({p.age} yrs)
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="mapping-doctor">Doctor</label>
          <select
            id="mapping-doctor"
            required
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Select a doctor...</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} — {d.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="mapping-notes">Notes (optional)</label>
          <textarea
            id="mapping-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Primary physician, follow-up consult, etc."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !patientId || !doctorId}
        >
          <Link2 size={16} />
          {isSubmitting ? 'Assigning...' : 'Assign Doctor'}
        </button>
      </form>
    </div>
  );
}
