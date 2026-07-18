// frontend/src/client.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

apiClient.interceptors.request.use((config) => {
  // Check if the endpoint is public
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => config.url?.includes(endpoint));
  
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Only add X-User-Id if we have it AND it's not a public endpoint
  const userId = localStorage.getItem('userId');
  
  if (!isPublic && userId) {
    config.headers['X-User-Id'] = userId;
  }
  
  // Don't log warnings for public endpoints
  if (!isPublic && !userId) {
    console.warn("⚠️ X-User-Id is missing in LocalStorage!");
  }
  
  return config;
});


// client.ts - add logging
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  
  console.log('🔑 Token:', token ? 'Present' : 'Missing');
  console.log('👤 UserId:', userId);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  
  console.log('📤 Request config:', {
    url: config.url,
    headers: config.headers,
    method: config.method
  });
  
  return config;
});
// // Add response interceptor for better error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Log the error for debugging
//     console.error('API Error:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       url: error.config?.url,
//       method: error.config?.method,
//     });
    
//     // Return a more user-friendly error message
//     if (error.response?.data?.message) {
//       error.message = error.response.data.message;
//     } else if (error.response?.status === 500) {
//       error.message = 'Server error. Please try again later.';
//     }
    
//     return Promise.reject(error);
//   }
// );

export default apiClient;