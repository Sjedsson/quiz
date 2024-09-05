import axios from 'axios';
import { getToken } from './auth';


const API_BASE_URL = import.meta.env.MODE === 'development' ? '/api' : 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
