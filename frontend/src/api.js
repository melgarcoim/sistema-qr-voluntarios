// src/services/api.js
import axios from "axios";
import { logout } from "@/utils/auth";

// 🌐 Base URL configurable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// 🧠 Instancia central de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Interceptor de request: inyecta token si existe
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 Interceptor de response: maneja errores 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      logout(); // Limpia sesión y redirige
    }
    return Promise.reject(error);
  },
);

// 🛠 Función auxiliar para diagnóstico
export async function pingBackend() {
  try {
    const res = await fetch(`${API_URL}/ping`);
    const data = await res.text();
    console.log("✅ Backend respondió:", data);
  } catch (err) {
    console.error("❌ Error al conectar con backend:", err);
  }
}

export default api;
