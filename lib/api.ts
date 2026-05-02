import axios from "axios";

/** Obtiene el valor de una cookie */
function leerCookie(nombre: string): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${nombre}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

// URL base del API (configurable por variable de entorno)
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Interceptor que agrega el token JWT a cada petición */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || leerCookie("token");
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
    // Si el token expiró o es inválido, limpiar credenciales
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      document.cookie = "token=; path=/; max-age=0; sameSite=lax";
      document.cookie = "role=; path=/; max-age=0; sameSite=lax";
    }
    return Promise.reject(error);
  }
);
