import apiClient from '../../../services/apiClient';

export async function getMappings() {
  const response = await apiClient.get('/mappings/');
  return response.data;
}

export async function getMappingsByPatient(patientId) {
  const response = await apiClient.get(`/mappings/${patientId}/`);
  return response.data;
}

export async function createMapping(payload) {
  const response = await apiClient.post('/mappings/', payload);
  return response.data;
}

export async function deleteMapping(mappingId) {
  await apiClient.delete(`/mappings/${mappingId}/`);
}

export async function getMappingOptions() {
  const [patientsRes, doctorsRes] = await Promise.all([
    apiClient.get('/patients/'),
    apiClient.get('/doctors/'),
  ]);
  return {
    patients: patientsRes.data,
    doctors: doctorsRes.data,
  };
}
