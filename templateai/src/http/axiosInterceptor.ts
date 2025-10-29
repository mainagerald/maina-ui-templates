import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Make sure API_URL is a complete URL with https:// prefix
if (API_URL && !API_URL.startsWith('http')) {
  throw new Error('API_URL must start with http:// or https://');
}

if(!API_URL){
  throw new Error('Api url is missing. Please define it in your .env file.');
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout to 30 seconds for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh the token
const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }
    
    console.log('Attempting to refresh token');
    const response = await axios.post(`${API_URL}/users/token/refresh/`, {
      refresh: refreshToken,
    });
    
    // The backend returns 'token' not 'access'
    const { token: access, refresh: newRefreshToken } = response.data;
    
    if (access) {
      console.log('Token refresh successful');
      localStorage.setItem('token', access);
      
      // If we get a new refresh token (when ROTATE_REFRESH_TOKENS is true)
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      return access;
    } else {
      console.error('Token refresh response did not contain access token');
      return null;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens if refresh fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return null;
  }
};

// Track if we're currently refreshing the token to prevent multiple refreshes
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

// Process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.config.headers['Authorization'] = `Bearer ${token}`;
      promise.resolve(axiosInstance(promise.config));
    }
  });
  
  // Reset the queue
  failedQueue = [];
};

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// Import toast notifications
import { showErrorToast } from '../components/layouts/toast/miniToast';

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    
    // Check if the error is due to an expired token (status 401)
    if (error.response?.status === 401 && !originalRequest.headers['X-Retry']) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      
      isRefreshing = true;
      originalRequest.headers['X-Retry'] = 'true';
      
      try {
        console.log('Attempting to refresh token due to 401 error');
        const newToken = await refreshToken();
        isRefreshing = false;
        
        if (newToken) {
          console.log('Token refresh successful, retrying original request');
          // Update the request header with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Process any queued requests with the new token
          processQueue(null, newToken);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          console.error('Token refresh failed, logging out user');
          // Token refresh failed, process queue with error
          processQueue(new Error('Token refresh failed'));
          // Show session expired toast and logout the user
          showErrorToast('Your session has expired. Please login again.');
          // Logout the user - we need to do this after a slight delay to ensure the toast is shown
          setTimeout(() => {
            // Clear tokens from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            // Redirect to login page
            window.location.href = '/login';
          }, 2000);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(new Error('Token refresh failed'));
        // Show session expired toast and logout the user
        showErrorToast('Your session has expired. Please login again.');
        // Logout the user - we need to do this after a slight delay to ensure the toast is shown
        setTimeout(() => {
          // Clear tokens from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // Redirect to login page
          window.location.href = '/login';
        }, 2000);
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 401 errors that occur even after a retry attempt
    if (error.response?.status === 401 && originalRequest.headers['X-Retry']) {
      // Show session expired toast and logout the user
      showErrorToast('Your session has expired. Please login again.');
      // Logout the user - we need to do this after a slight delay to ensure the toast is shown
      setTimeout(() => {
        // Clear tokens from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Redirect to login page
        window.location.href = '/login';
      }, 2000);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
