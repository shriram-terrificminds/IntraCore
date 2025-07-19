import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend/api',
});

// Attach JWT token if available
api.interceptors.request.use(async (config) => {
  // TODO: get token from SecureStore or context
  const token = null; // Replace with actual token logic
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
