import axios from 'axios';

const apiClient = axios.create({

  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/api/v1' 
    : `http://${window.location.hostname}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userId) {
    config.headers['X-User-Id'] = userId;
  } else {
    console.warn("⚠️ X-User-Id is missing in LocalStorage!");
  }
  
  return config;
});
export default apiClient;