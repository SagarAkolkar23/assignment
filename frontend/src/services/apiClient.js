import axios from 'axios';

const ACCESS_TOKEN_KEY = 'healthcare_access_token';
const REFRESH_TOKEN_KEY = 'healthcare_refresh_token';
const USER_KEY = 'healthcare_user';

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setSession: ({ access, refresh, user }) => {
    if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login/') ||
      originalRequest?.url?.includes('/auth/register/') ||
      originalRequest?.url?.includes('/auth/token/refresh/');

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      const refresh = tokenStorage.getRefreshToken();
      if (refresh) {
        originalRequest._retry = true;
        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(`${baseURL}/auth/token/refresh/`, { refresh })
              .then((res) => {
                tokenStorage.setSession({ access: res.data.access });
                return res.data.access;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }
          const newAccess = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch {
          tokenStorage.clearSession();
          window.dispatchEvent(new Event('healthcare:unauthorized'));
        }
      } else {
        tokenStorage.clearSession();
        window.dispatchEvent(new Event('healthcare:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (!data) {
    return error?.message || fallback;
  }
  if (data.details && typeof data.details === 'object') {
    const messages = Object.entries(data.details).flatMap(([field, value]) => {
      const items = Array.isArray(value) ? value : [value];
      const prefix = field === 'non_field_errors' ? '' : `${field}: `;
      return items.map((item) => `${prefix}${item}`);
    });
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }
  if (typeof data.error === 'string') return data.error;
  if (typeof data.detail === 'string') return data.detail;
  return fallback;
}

export default apiClient;
