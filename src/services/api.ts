import axios from 'axios';
import API_BASE from '../config/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // La API usa whitelist + forbidNonWhitelisted: estos campos de solo lectura
  // generan un 400 si se envían en el body de create/update.
  const method = config.method?.toLowerCase();
  if (
    (method === 'post' || method === 'patch' || method === 'put') &&
    config.data &&
    typeof config.data === 'object' &&
    !Array.isArray(config.data) &&
    !(config.data instanceof FormData)
  ) {
    const { id, createdAt, updatedAt, created_at, updated_at, deleted_at, ...cleanBody } = config.data as Record<string, unknown>;
    void id; void createdAt; void updatedAt; void created_at; void updated_at; void deleted_at;
    config.data = cleanBody;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
