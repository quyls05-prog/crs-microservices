// path: crs-frontend/src/api/axiosClient.ts
// purpose: axios instance duy nhat cua frontend, tro ve api-gateway va tu dong dinh kem
// Authorization header neu co token trong localStorage.
// Response Interceptor xu ly 401 (token het han/khong hop le) -> tu dong dang xuat.

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - tu dong dinh kem token neu co
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('crs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - xu ly 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('crs_token');
      localStorage.removeItem('crs_user');
      // Dung window.location thay vi useNavigate() vi day la file thuan TypeScript
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
