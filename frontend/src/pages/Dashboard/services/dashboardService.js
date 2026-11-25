import apiClient from '../../../services/apiClient';

export async function fetchDashboardSummary() {
  const [patientsRes, doctorsRes, mappingsRes] = await Promise.all([
    apiClient.get('/patients/'),
    apiClient.get('/doctors/'),
    apiClient.get('/mappings/'),
  ]);

  return {
    patients: patientsRes.data,
    doctors: doctorsRes.data,
    mappings: mappingsRes.data,
  };
}
