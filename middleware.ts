import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Configuración de rutas protegidas y roles permitidos
const PROTECTED_ROUTES = [
  { path: "/admin", roles: ["administrador"] },
  { path: "/cocina", roles: ["cocinero", "administrador"] },
];

function obtenerRutaSegunRol(rol: string | undefined): string {
  if (rol === "administrador") return "/admin";
  if (rol === "cocinero") return "/cocina";
  return "/";
}

function buscarConfiguracionRuta(pathname: string) {
  return PROTECTED_ROUTES.find(
    (ruta) => pathname === ruta.path || pathname.startsWith(`${ruta.path}/`)
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const configuracion = buscarConfiguracionRuta(pathname);

  // Si la ruta no está protegida, permitir el acceso
  if (!configuracion) {
    return NextResponse.next();
  }

  // 🔒 ACTUALIZADO: Se busca "akaza_token" para coincidir con auth.service.ts y el backend
  const token = request.cookies.get("akaza_token")?.value;
  const rol = request.cookies.get("role")?.value;

  // Sin token, redirigir a la página principal
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si no hay rol o el rol no está permitido, redirigir según el rol
  if (!rol || !configuracion.roles.includes(rol)) {
    const rutaDestino = obtenerRutaSegunRol(rol);
    // Evitar redirección infinita a la misma ruta
    if (rutaDestino !== pathname) {
      return NextResponse.redirect(new URL(rutaDestino, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cocina/:path*"],
};