import { Link2, Stethoscope, Users } from 'lucide-react';

export default function SummaryCards({ patientCount, doctorCount, mappingCount }) {
  const stats = [
    { label: 'My Patients', value: patientCount, icon: Users },
    { label: 'Available Doctors', value: doctorCount, icon: Stethoscope },
    { label: 'Active Assignments', value: mappingCount, icon: Link2 },
  ];

  return (
    <div className="stats-grid">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="card stat-card">
          <div className="stat-icon">
            <Icon size={22} />
          </div>
          <div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
