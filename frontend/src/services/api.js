import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    // If in production on HTTPS (e.g. Vercel) but envUrl is pointing to localhost, fallback to Render production API
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && envUrl.includes('localhost')) {
      return 'https://job-connect-api-8w32.onrender.com/api';
    }
    return envUrl.trim();
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://job-connect-api-8w32.onrender.com/api';
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

let clerkTokenGetter = null;

export const setClerkTokenGetter = (getter) => {
  clerkTokenGetter = getter;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Clerk session token & identity headers
api.interceptors.request.use(
  async (config) => {
    try {
      if (clerkTokenGetter) {
        const token = await clerkTokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      // Fallback
    }

    const localToken = localStorage.getItem('clerk_token');
    if (!config.headers.Authorization && localToken) {
      config.headers.Authorization = `Bearer ${localToken}`;
    }

    const clerkUserId = localStorage.getItem('clerk_user_id');
    if (clerkUserId) {
      config.headers['x-clerk-user-id'] = clerkUserId;
    }

    const clerkRole = localStorage.getItem('clerk_selected_role');
    if (clerkRole) {
      config.headers['x-clerk-user-role'] = clerkRole;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
