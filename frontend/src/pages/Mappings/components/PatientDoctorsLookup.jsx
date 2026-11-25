import { useState } from 'react';
import { Search } from 'lucide-react';

export default function PatientDoctorsLookup({ patients, onLookup, onClear, activePatientId }) {
  const [selectedId, setSelectedId] = useState(activePatientId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedId) {
      onLookup(Number(selectedId));
    }
  };

  const handleReset = () => {
    setSelectedId('');
    onClear();
  };

  return (
    <div className="card">
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.15rem' }}>Filter by Patient</h2>
      <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Query <code>GET /api/mappings/&lt;patient_id&gt;/</code> to view doctors assigned to a specific patient.
      </p>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="lookup-patient">Patient</label>
          <select
            id="lookup-patient"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">All patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-secondary" disabled={!selectedId}>
            <Search size={15} />
            View Assigned Doctors
          </button>
          {activePatientId && (
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Show All
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
