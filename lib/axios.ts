import { ENV } from "@/config/env";
import { ROUTES } from "@/config/routes";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth state in Zustand (which also clears localStorage)
      useAuthStore.getState().clearAuth();

      // if (typeof window !== "undefined") {
      //   window.location.href = ROUTES.LOGIN;
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
