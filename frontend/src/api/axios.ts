import axios from 'axios';

const api = axios.create({
  baseURL: 'https://devtask-manager-ukp1.onrender.com/api',
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
