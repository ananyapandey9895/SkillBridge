import axios from 'axios';

const base = import.meta.env.VITE_API_URL as string | undefined;
if (!base) console.warn('[api] VITE_API_URL is not set — requests may fail');

const api = axios.create({
  baseURL: `${base ?? ''}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: { response?: { status: number } }) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
