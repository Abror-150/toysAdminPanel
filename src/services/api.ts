import { API } from "@/hooks/getEnv";
import axios from "axios";

// Base API URL - replace with your actual API endpoint

export const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const naborApi = {
  getAll: () => api.get("/nabor"),
  getById: (id: string) => api.get(`/nabor/${id}`),
  create: (data: any) => api.post("/nabor", data),
  update: (id: string, data: any) => api.patch(`/nabor/${id}`, data),
  delete: (id: string) => api.delete(`/nabor/${id}`),
  uploadImage: (formData: FormData) =>
    axios.post(`${API}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const contactApi = {
  getAll: () => api.get("/contact"),
  getById: (id: string) => api.get(`/contact/${id}`),
  delete: (id: string) => api.delete(`/contact/${id}`),
  markAsRead: (id: string) => api.patch(`/contact/${id}/read`),
};

export const orderApi = {
  getAll: () => api.get("/order"),
  getById: (id: string) => api.get(`/order/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/order/${id}/status`, { status }),
};

export const statsApi = {
  getMonthly: () => api.get("/stats/monthly"),
  getDashboard: () => api.get("/stats/dashboard"),
};

export const materialApi = {
  create: (naborId: string, data: any) =>
    api.post(`/nabor/${naborId}/materials`, data),
  update: (naborId: string, materialId: string, data: any) =>
    api.put(`/nabor/${naborId}/materials/${materialId}`, data),
  delete: (naborId: string, materialId: string) =>
    api.delete(`/nabor/${naborId}/materials/${materialId}`),
};

export const accessoryApi = {
  create: (naborId: string, data: any) =>
    api.post(`/nabor/${naborId}/accessories`, data),
  update: (naborId: string, accessoryId: string, data: any) =>
    api.put(`/nabor/${naborId}/accessories/${accessoryId}`, data),
  delete: (naborId: string, accessoryId: string) =>
    api.delete(`/nabor/${naborId}/accessories/${accessoryId}`),
};

export const furnitureApi = {
  create: (naborId: string, data: any) =>
    api.post(`/nabor/${naborId}/furnitures`, data),
  update: (naborId: string, furnitureId: string, data: any) =>
    api.put(`/nabor/${naborId}/furnitures/${furnitureId}`, data),
  delete: (naborId: string, furnitureId: string) =>
    api.delete(`/nabor/${naborId}/furnitures/${furnitureId}`),
};

export const andozaApi = {
  create: (naborId: string, data: any) =>
    api.post(`/nabor/${naborId}/andozalar`, data),
  update: (naborId: string, andozaId: string, data: any) =>
    api.put(`/nabor/${naborId}/andozalar/${andozaId}`, data),
  delete: (naborId: string, andozaId: string) =>
    api.delete(`/nabor/${naborId}/andozalar/${andozaId}`),
};
