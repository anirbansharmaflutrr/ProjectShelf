import axios from 'axios';

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors (token expired or invalid)
    // Only redirect to login if it's a true auth error, not a network error
    if (
      error.response && 
      error.response.status === 401 && 
      error.response.data && 
      (
        error.response.data.message === 'Not authorized, token failed' ||
        error.response.data.message === 'Not authorized, no token' ||
        error.response.data.message === 'Not authorized, user not found'
      )
    ) {
      console.log('Auth error detected, removing token and redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 