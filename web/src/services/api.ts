import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// Create a single Axios instance for the application. This instance sets the
// baseURL to the server API (it assumes the web app is served from the same
// domain as the backend via a reverse proxy or relative path). A request
// interceptor reads the JWT token from the auth store and, if present,
// attaches it to the Authorization header.

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    // Access the auth store directly. Using getState avoids re-rendering.
    const { token } = useAuth.getState();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;