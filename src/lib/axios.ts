import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api/v1';
  }
  const hostname = window.location.hostname;
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3000/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// Request Interceptor
// Automatically attach access token to every request
// ========================
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && config.baseURL?.includes('localhost')) {
        config.baseURL = config.baseURL.replace('localhost', hostname);
      }
    }
    // Access token is stored in Zustand / memory — retrieve it here
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('velora-auth');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // ignore parse errors
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Response Interceptor
// Handle 401 → redirect to login
// ========================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('velora-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
