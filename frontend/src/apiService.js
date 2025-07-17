// API Service for WorkWell AI Frontend
import axios from 'axios';

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },
  
  logout: async () => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('access_token');
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getEmployeeDashboard: async (employeeId) => {
    const response = await api.get(`/api/dashboard/employee/${employeeId}`);
    return response.data;
  },
  
  getManagerDashboard: async (managerId) => {
    const response = await api.get(`/api/dashboard/manager/${managerId}`);
    return response.data;
  },
  
  getHRDashboard: async () => {
    const response = await api.get('/api/dashboard/hr');
    return response.data;
  },
  
  getAdminDashboard: async () => {
    const response = await api.get('/api/dashboard/admin');
    return response.data;
  },
};

// Survey APIs
export const surveyAPI = {
  getCurrentSurvey: async () => {
    const response = await api.get('/api/surveys/current');
    return response.data;
  },
  
  submitSurvey: async (responses) => {
    const response = await api.post('/api/surveys/submit', { responses });
    return response.data;
  },
};

// Chat APIs
export const chatAPI = {
  sendMessage: async (message) => {
    const response = await api.post('/api/chat/message', { message });
    return response.data;
  },
};

// Prediction APIs
export const predictionAPI = {
  predictRisk: async (employeeData) => {
    const response = await api.post('/api/predict/risk', employeeData);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export default api;