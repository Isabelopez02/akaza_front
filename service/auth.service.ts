import { api } from "@/lib/api";
import { UserData } from "@/ts/types";

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const isSecureCookie = () => {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
};

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  const secure = isSecureCookie() ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; sameSite=lax${secure}`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  const secure = isSecureCookie() ? "; secure" : "";
  document.cookie = `${name}=; path=/; max-age=0; sameSite=lax${secure}`;
};

export const AuthService = {
  checkSession: async (): Promise<Partial<UserData>> => {
    const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const tokenFromCookie = getCookieValue("token");
    const token = tokenFromStorage || tokenFromCookie;

    if (!token) {
      console.log("[AuthService] No hay token guardado. Saltando validación de sesión.");
      return { autenticado: false };
    }

    console.log("[AuthService] GET /api/auth/me - Enviando solicitud de validación de sesión");
    try {
      const { data } = await api.get("/api/auth/me");
      console.log("[AuthService] Respuesta recibida:", data);
      return { autenticado: true, ...data };
    } catch (error: any) {
      console.error("[AuthService] Error chequeando sesión:", error?.response?.status || error);
      return { autenticado: false };
    }
  },

  login: async (correo: string, password: string): Promise<UserData> => {
    const payload = {
      correo,
      contrasenia: password,
    };

    console.log("[AuthService] POST /api/auth/login - Enviando:", payload);

    try {
      const { data } = await api.post("/api/auth/login", payload);
      console.log("[AuthService] Respuesta login:", data);

      if (typeof window !== "undefined") {
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          setCookie("token", data.access_token);
        }
        if (data.rol) {
          localStorage.setItem("role", data.rol);
          setCookie("role", data.rol);
        }
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
      localStorage.removeItem("role");
      deleteCookie("token");
      deleteCookie("role");
    }
  },
};
