import axios from 'axios';

// Access the environment variable from Vite, with a fallback for safety.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create an Axios instance with a pre-configured base URL.
// This is the single point of configuration for all API requests.
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;