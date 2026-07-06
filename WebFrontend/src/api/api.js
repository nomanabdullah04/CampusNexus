import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api/v1';

export const publicAPI = axios.create({ baseURL: API_BASE_URL });

export const privateAPI = axios.create({ baseURL: API_BASE_URL });

privateAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

privateAPI.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Redirect to sign-in so the user isn't left on a broken page
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);
