import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bugAPI = {
  // Get all bugs
  getAllBugs: async () => {
    try {
      const response = await api.get('/bugs');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch bugs');
    }
  },

  // Get single bug
  getBugById: async (id) => {
    try {
      const response = await api.get(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch bug');
    }
  },

  // Create bug
  createBug: async (bugData) => {
    try {
      const response = await api.post('/bugs', bugData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create bug');
    }
  },

  // Update bug
  updateBug: async (id, updates) => {
    try {
      const response = await api.put(`/bugs/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update bug');
    }
  },

  // Delete bug
  deleteBug: async (id) => {
    try {
      const response = await api.delete(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete bug');
    }
  }
};

export default api;