import axios from "axios";
import { getToken } from "./tokenStorage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error("Network error. Please check your connection."));
  }
);

export default api;
