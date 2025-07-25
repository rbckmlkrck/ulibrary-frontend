/**
 * src/services/api.ts
 *
 * This file is part of the University Library project.
 * It configures and exports a pre-configured Axios instance for making API
 * requests to the backend.
 *
 * Author: Raul Berrios
 */
import axios from 'axios';

// Create an Axios instance.
// By using a relative baseURL, all requests will be sent to the same host
// that served the frontend. Nginx will then proxy the API requests.
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;