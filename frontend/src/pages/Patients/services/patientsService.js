import apiClient from '../../../services/apiClient';

export async function getPatients() {
  const response = await apiClient.get('/patients/');
  return response.data;
}

export async function getPatientById(id) {
  const response = await apiClient.get(`/patients/${id}/`);
  return response.data;
}

export async function createPatient(payload) {
  const response = await apiClient.post('/patients/', payload);
  return response.data;
}

export async function updatePatient(id, payload) {
  const response = await apiClient.put(`/patients/${id}/`, payload);
  return response.data;
}

export async function deletePatient(id) {
  await apiClient.delete(`/patients/${id}/`);
}
