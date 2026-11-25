import { useEffect, useState } from 'react';
import AlertBanner from '../../components/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../services/apiClient';
import QuickActions from './components/QuickActions';
import SummaryCards from './components/SummaryCards';
import { fetchDashboardSummary } from './services/dashboardService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ patients: [], doctors: [], mappings: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const data = await fetchDashboardSummary();
        if (isMounted) setSummary(data);
      } catch (err) {
        if (isMounted) setError(extractErrorMessage(err, 'Failed to load dashboard summary.'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
          <p>Overview of your patients, registered doctors, and care team mappings.</p>
        </div>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />

      {isLoading ? (
        <div className="card">Loading overview...</div>
      ) : (
        <>
          <SummaryCards
            patientCount={summary.patients.length}
            doctorCount={summary.doctors.length}
            mappingCount={summary.mappings.length}
          />
          <QuickActions />
        </>
      )}
    </div>
  );
}
