"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/services/auth.service";

export default function AkazaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Solo redirigir si estamos en la página principal
    if (pathname === "/") {
      const validarRol = async () => {
        try {
          const usuario = await AuthService.checkSession();
          // Si es administrador autenticado, redirigir al panel de control
          if (usuario?.autenticado && usuario?.rol === "administrador") {
            router.push("/admin");
          }
        } catch (error) {
          // Continuar sin acción en caso de error
        }
      };
      void validarRol();
    }
  }, [router, pathname]);

  return <>{children}</>;
}
