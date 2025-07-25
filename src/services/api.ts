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