import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
