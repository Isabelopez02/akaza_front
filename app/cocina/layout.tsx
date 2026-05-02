"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/service/auth.service";

export default function CocinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validarAcceso = async () => {
      try {
        const usuario = await AuthService.checkSession();
        // Permitir acceso a cocineros y administradores
        const tieneAcceso =
          usuario?.autenticado &&
          (usuario?.rol === "cocinero" || usuario?.rol === "administrador");

        if (!tieneAcceso) {
          router.push("/");
          return;
        }
      } catch {
        router.push("/");
        return;
      } finally {
        setIsLoading(false);
      }
    };
    void validarAcceso();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-akaza-crema">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akaza-marron"></div>
      </div>
    );
  }

  return <>{children}</>;
}
