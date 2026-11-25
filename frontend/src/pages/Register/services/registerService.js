import apiClient from '../../../services/apiClient';

export async function registerUser(payload) {
  const response = await apiClient.post('/auth/register/', payload);
  return response.data;
}
