import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://react-rural-telemedicine-app.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});
api.interceptors.request.use((config) => {
  let token = localStorage.getItem('token');
  
  if (!token) {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        token = parsed.token;
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export default api;