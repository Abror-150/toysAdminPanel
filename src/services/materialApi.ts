// src/services/materialsApi.ts
import { API } from "@/hooks/getEnv";
import axios from "axios";

export const materialsApi = {
  getAll: async () => {
    const res = await axios.get(`${API}/materials`);
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axios.get(`${API}/materials/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await axios.post(`${API}/materials`, data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await axios.patch(`${API}/materials/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`${API}/materials/${id}`);
    return res.data;
  },
};
