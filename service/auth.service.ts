import { api } from "@/lib/api";
import { UserData } from "@/ts/types";

/** Obtiene el valor de una cookie por su nombre */
function leerCookie(nombre: string): string | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${nombre}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

/** Verifica si la aplicación se ejecuta en HTTPS */
function esConexionSegura(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}

/** Guarda una cookie con atributos de seguridad */
function guardarCookie(nombre: string, valor: string, dias = 7) {
  if (typeof document === "undefined") return;
  const segundos = dias * 24 * 60 * 60;
  const atributoSeguro = esConexionSegura() ? "; secure" : "";
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; path=/; max-age=${segundos}; sameSite=lax${atributoSeguro}`;
}

/** Elimina una cookie de forma segura */
function eliminarCookie(nombre: string) {
  if (typeof document === "undefined") return;
  const atributoSeguro = esConexionSegura() ? "; secure" : "";
  document.cookie = `${nombre}=; path=/; max-age=0; sameSite=lax${atributoSeguro}`;
}

export const AuthService = {
  /** Valida si el usuario tiene una sesión activa */
  checkSession: async (): Promise<Partial<UserData>> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("akaza_token") : null;
    const tokenCookie = leerCookie("akaza_token");

    if (!token && !tokenCookie) {
      return { autenticado: false };
    }

    try {
      const { data } = await api.get("/api/auth/me");
      return { autenticado: true, ...data };
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("akaza_token");
        localStorage.removeItem("role");
      }
      eliminarCookie("akaza_token");
      eliminarCookie("role");
      return { autenticado: false };
    }
  },

  /** Realiza el login del usuario */
  login: async (correo: string, password: string): Promise<UserData> => {
    const credentials = { correo, contrasenia: password };
    const { data } = await api.post("/api/auth/login", credentials);

    if (typeof window !== "undefined") {
      if (data.access_token) {
        // Guardamos como akaza_token
        localStorage.setItem("akaza_token", data.access_token);
        guardarCookie("akaza_token", data.access_token);
      }
      if (data.rol) {
        localStorage.setItem("role", data.rol);
        guardarCookie("role", data.rol);
      }
    }
    return data;
  },

  /** Registra un nuevo usuario */
  register: async (nombre: string, correo: string, password: string) => {
    const userData = { nombre, correo, contrasenia: password };
    const { data } = await api.post("/api/auth/register", userData);
    return data;
  },

  /** Cierra la sesión */
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("akaza_token");
      localStorage.removeItem("role");
      eliminarCookie("akaza_token");
      eliminarCookie("role");
    }
  },
};