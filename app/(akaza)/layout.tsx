"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/service/auth.service";

export default function AkazaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const data = await AuthService.checkSession();
        if (data?.autenticado && data?.rol === "administrador") {
          console.log("Admin detectado, redirigiendo...");
          router.push("/admin");
        }
      } catch (error) {
        console.error("Error validando rol:", error);
      }
    };
    void checkRole();
  }, [router]);

  return <>{children}</>;
}
