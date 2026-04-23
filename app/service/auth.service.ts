import { api } from "../../lib/api";

export const AuthService = {
  checkSession: async () => {
    // 1. NO se ejecuta si no hay token (Evita el 401 inncesario)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      console.log("[AuthService] No hay token guardado. Saltando validación de sesión.");
      // Devolvemos estructura que tu app espere, simulando que no está autenticado
      return { autenticado: false };
    }

    console.log("[AuthService] GET /api/auth/me - Enviando solicitud de validación de sesión");
    try {
      const { data } = await api.get("/api/auth/me");
      console.log("[AuthService] Respuesta recibida:", data);
      return { autenticado: true, ...data };
    } catch (error: any) {
      console.error("[AuthService] Error chequeando sesión:", error?.response?.status || error);
      // El 401 lo maneja el interceptor en api.ts borrando el token de localStorage
      return { autenticado: false };
    }
  },

  login: async (correo: string, password: string) => {
    const payload = {
      correo,
      contrasenia: password,
    };

    console.log("[AuthService] POST /api/auth/login - Enviando:", payload);

    try {
      const { data } = await api.post("/api/auth/login", payload);
      console.log("[AuthService] Respuesta login:", data);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      return data;
    } catch (error) {
      console.error("[AuthService] Error en login:", error);
      throw error;
    }
  },

  register: async (nombre: string, correo: string, password: string) => {
    const payload = {
      nombre,
      correo,
      contrasenia: password,
    };

    console.log("[AuthService] POST /api/auth/register - Enviando:", payload);

    try {
      const { data } = await api.post("/api/auth/register", payload);
      console.log("[AuthService] Respuesta register:", data);
      return data;
    } catch (error) {
      console.error("[AuthService] Error en registro:", error);
      throw error;
    }
  },

  logout: () => {
    console.log("[AuthService] Cerrando sesión y borrando token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
};
