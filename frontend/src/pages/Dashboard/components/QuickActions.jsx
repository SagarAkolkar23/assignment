import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'Manage Patients',
      description: 'Add new patient records, view medical histories, and keep contact details updated.',
      to: '/patients',
      cta: 'Open Patients',
    },
    {
      title: 'Doctor Directory',
      description: 'Browse registered specialists, add new doctors, or update experience and contact info.',
      to: '/doctors',
      cta: 'Open Doctors',
    },
    {
      title: 'Patient-Doctor Mappings',
      description: 'Assign doctors to your patients, inspect assigned care teams, or remove assignments.',
      to: '/mappings',
      cta: 'Open Mappings',
    },
  ];

  return (
    <div className="stats-grid">
      {actions.map((action) => (
        <div key={action.to} className="card form-stack">
          <div>
            <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>{action.title}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              {action.description}
            </p>
          </div>
          <div>
            <Link to={action.to} className="btn btn-secondary btn-sm">
              {action.cta}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
