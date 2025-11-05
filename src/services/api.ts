import axios from 'axios';

// Base API URL - replace with your actual API endpoint
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mahidolls.com';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const naborApi = {
  getAll: () => api.get('/nabors'),
  getById: (id: string) => api.get(`/nabors/${id}`),
  create: (data: any) => api.post('/nabors', data),
  update: (id: string, data: any) => api.put(`/nabors/${id}`, data),
  delete: (id: string) => api.delete(`/nabors/${id}`),
};

export const contactApi = {
  getAll: () => api.get('/contacts'),
  getById: (id: string) => api.get(`/contacts/${id}`),
  delete: (id: string) => api.delete(`/contacts/${id}`),
  markAsRead: (id: string) => api.patch(`/contacts/${id}/read`),
};

export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export const statsApi = {
  getMonthly: () => api.get('/stats/monthly'),
  getDashboard: () => api.get('/stats/dashboard'),
};

export const materialApi = {
  create: (naborId: string, data: any) => api.post(`/nabors/${naborId}/materials`, data),
  update: (naborId: string, materialId: string, data: any) => 
    api.put(`/nabors/${naborId}/materials/${materialId}`, data),
  delete: (naborId: string, materialId: string) => 
    api.delete(`/nabors/${naborId}/materials/${materialId}`),
};

export const accessoryApi = {
  create: (naborId: string, data: any) => api.post(`/nabors/${naborId}/accessories`, data),
  update: (naborId: string, accessoryId: string, data: any) => 
    api.put(`/nabors/${naborId}/accessories/${accessoryId}`, data),
  delete: (naborId: string, accessoryId: string) => 
    api.delete(`/nabors/${naborId}/accessories/${accessoryId}`),
};

export const furnitureApi = {
  create: (naborId: string, data: any) => api.post(`/nabors/${naborId}/furnitures`, data),
  update: (naborId: string, furnitureId: string, data: any) => 
    api.put(`/nabors/${naborId}/furnitures/${furnitureId}`, data),
  delete: (naborId: string, furnitureId: string) => 
    api.delete(`/nabors/${naborId}/furnitures/${furnitureId}`),
};

export const andozaApi = {
  create: (naborId: string, data: any) => api.post(`/nabors/${naborId}/andozalar`, data),
  update: (naborId: string, andozaId: string, data: any) => 
    api.put(`/nabors/${naborId}/andozalar/${andozaId}`, data),
  delete: (naborId: string, andozaId: string) => 
    api.delete(`/nabors/${naborId}/andozalar/${andozaId}`),
};
