import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  // Quitamos withCredentials si usamos modo Token Bearer (localStorage) para evitar rollos de CORS con cookies
  // withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar token en cada petición protegida
api.interceptors.request.use((config) => {
  // Asegurarse de estar en el cliente para acceder a localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar el 401 de forma global 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: borrar el token si expiró
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);
