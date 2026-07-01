import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed for httpOnly refresh token cookie
});

// ========================
// Request Interceptor
// Automatically attach access token to every request
// ========================
apiClient.interceptors.request.use(
  (config) => {
    // Access token is stored in Zustand / memory — retrieve it here
    if (typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        const adminToken = localStorage.getItem('admin_access_token');
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
        }
      } else {
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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Response Interceptor
// Handle 401 → try refresh token → retry original request
// ========================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
        const refreshUrl = isAdminRoute ? '/admin/auth/refresh-token' : '/auth/refresh-token';
        
        const response = await apiClient.post(refreshUrl);
        const newToken = response.data?.data?.accessToken;

        // Update state
        if (typeof window !== 'undefined' && newToken) {
          if (isAdminRoute) {
            localStorage.setItem('admin_access_token', newToken);
          } else {
            const authStorage = localStorage.getItem('velora-auth');
            if (authStorage) {
              const parsed = JSON.parse(authStorage);
              parsed.state.accessToken = newToken;
              localStorage.setItem('velora-auth', JSON.stringify(parsed));
            }
          }
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state and redirect to login
        if (typeof window !== 'undefined') {
          const isAdminRoute = window.location.pathname.startsWith('/admin');
          if (isAdminRoute) {
            localStorage.removeItem('admin_access_token');
            window.location.href = '/admin/login';
          } else {
            localStorage.removeItem('velora-auth');
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
