import axios from "axios";

/** Obtiene el valor de una cookie */
function leerCookie(nombre: string): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${nombre}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

// URL base del API
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANTE: Permite enviar cookies al backend
  headers: {
    "Content-Type": "application/json",
  },
});

/** Interceptor que agrega el token JWT a cada petición */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Buscamos akaza_token (el nombre que espera el backend)
    const token = localStorage.getItem("akaza_token") || leerCookie("akaza_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/** Interceptor que maneja errores de autenticación */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Limpiamos akaza_token si falla
      localStorage.removeItem("akaza_token");
      localStorage.removeItem("role");
      document.cookie = "akaza_token=; path=/; max-age=0; sameSite=lax";
      document.cookie = "role=; path=/; max-age=0; sameSite=lax";
    }
    return Promise.reject(error);
  }
);