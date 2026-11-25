import apiClient from '../../../services/apiClient';

export async function getDoctors() {
  const response = await apiClient.get('/doctors/');
  return response.data;
}

export async function getDoctorById(id) {
  const response = await apiClient.get(`/doctors/${id}/`);
  return response.data;
}

export async function createDoctor(payload) {
  const response = await apiClient.post('/doctors/', payload);
  return response.data;
}

export async function updateDoctor(id, payload) {
  const response = await apiClient.put(`/doctors/${id}/`, payload);
  return response.data;
}

export async function deleteDoctor(id) {
  await apiClient.delete(`/doctors/${id}/`);
}
