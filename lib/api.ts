import axios from "axios";

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL,
  // Quitamos withCredentials si usamos modo Token Bearer (localStorage) para evitar rollos de CORS con cookies
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar token en cada petición protegida
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || getCookieValue("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar el 401 de forma global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        document.cookie = "token=; path=/; max-age=0; sameSite=lax";
        document.cookie = "role=; path=/; max-age=0; sameSite=lax";
      }
    }
    return Promise.reject(error);
  }
);
