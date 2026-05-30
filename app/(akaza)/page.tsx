"use client";
import { useEffect, useState } from "react";
import { AboutSection } from "@/component/home/AboutSection";
import { CategoriesSection } from "@/component/home/CategoriesSection";
import { HowToOrderSection } from "@/component/home/HowToOrderSection";
import { TestimonialsSection } from "@/component/home/TestimonialsSection";
import { AISpecialtySection } from "@/component/home/AISpecialtySection";
import { AuthModal } from "@/component/modal/AuthModal";
import { ChatWidget } from "@/layout/ChatWidget";
import { Footer } from "@/layout/Footer";
import { HeroSection } from "@/component/home/HeroSection";
import { Navbar } from "@/layout/Navbar";
import { OrdersModal } from "@/component/modal/OrdersModal";
import { ProfileModal } from "@/component/modal/ProfileModal";
import { QrModal } from "@/layout/QrModal";
import { SpecialtiesSection } from "@/component/home/SpecialtiesSection";
import {
  featuredDishes,
  initialProfileData,
} from "@/types/constants";
import { AuthForm, ProfileData, Order } from "@/types";
import { AuthService } from "@/service/auth.service";
import { AdminService } from "@/service/admin.service";
import { useRouter } from "next/navigation";

function buildAuthErrorMessage(detail: unknown): string {
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const mensajes = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          const msg = (item as { msg?: unknown }).msg;
          return typeof msg === "string" ? msg : null;
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (mensajes.length) return mensajes.join(" | ");
  }

  if (detail && typeof detail === "object" && "msg" in detail) {
    const msg = (detail as { msg?: unknown }).msg;
    if (typeof msg === "string") return msg;
  }

  return "No se pudo autenticar. Verifica tus datos.";
}

export default function Home() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [authForm, setAuthForm] = useState<AuthForm>({
    fullName: "",
    email: "",
    password: "",
  });
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [authError, setAuthError] = useState("");
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await AuthService.checkSession();
        if (data?.autenticado) {
          setIsLoggedIn(true);
          setIdUsuario(data?.id ? Number(data.id) : null);
          setProfileData((prev) => ({
            ...prev,
            name: data?.nombre || data?.correo || "Usuario",
            email: data?.correo || prev.email,
            allergies: (data as any)?.alergias || "",
            preferences: (data as any)?.preferencias || "",
          }));

          if (data?.rol === "administrador") {
            router.push("/admin");
          } else if (data?.rol === "cocinero" || data?.rol === "chef") {
            router.push("/cocina");
          }
        } else {
          setIsLoggedIn(false);
          setIsLoginOpen(true); // Abrir modal automáticamente si no está autenticado al iniciar el proyecto
        }
      } catch {
        setIsLoggedIn(false);
        setIsLoginOpen(true); // Abrir modal automáticamente si falla la sesión al iniciar el proyecto
      }
    };
    void checkSession();
  }, [router]);

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");

    try {
      if (isRegisterMode) {
        await AuthService.register(
          authForm.fullName.trim(),
          authForm.email.trim(),
          authForm.password
        );
      }
      
      const resLogin = await AuthService.login(
        authForm.email.trim(),
        authForm.password
      );

        if (resLogin?.access_token) {
          setIsLoggedIn(true);
          const checkData = await AuthService.checkSession();
          setIdUsuario(checkData?.id ? Number(checkData.id) : null);
          
          if (checkData?.rol === "administrador") {
            router.push("/admin");
            return;
          } else if (checkData?.rol === "cocinero" || checkData?.rol === "chef") {
            router.push("/cocina");
            return;
          }

          setProfileData((prev) => ({
            ...prev,
            name: authForm.fullName.trim() || checkData?.correo || prev.name || "Usuario",
            email: checkData?.correo || authForm.email.trim() || prev.email,
            allergies: (checkData as any)?.alergias || "",
            preferences: (checkData as any)?.preferencias || "",
          }));
        }    
        setIsLoginOpen(false);
        setIsRegisterMode(false);
        setAuthForm({ fullName: "", email: "", password: "" });
    } catch (error: any) {
      const detail = error?.response?.data?.detail ?? error?.response?.data ?? error?.message;
      setAuthError(buildAuthErrorMessage(detail));
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setIdUsuario(null);
    setUserOrders([]);
    setIsUserMenuOpen(false);
    setIsProfileOpen(false);
    setIsOrdersOpen(false);
  };

  const handleAuthFieldChange = (field: keyof AuthForm, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileFieldChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    try {
      await AuthService.updateProfile(profileData.allergies, profileData.preferences);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
    }
  };

  const openProfileModal = () => {
    setIsProfileOpen(true);
    setIsUserMenuOpen(false);
  };

  const openOrdersModal = async () => {
    setIsOrdersOpen(true);
    setIsUserMenuOpen(false);

    try {
      // Obtener el ID de usuario más reciente directamente de la sesión activa
      const sessionData = await AuthService.checkSession();
      const currentUserId = sessionData?.id ? Number(sessionData.id) : idUsuario;
      console.log("[openOrdersModal] currentUserId:", currentUserId);

      const ps = await AdminService.getPlatos();
      const cs = await AdminService.getCombos();
      const allPedidos = await AdminService.getPedidos();
      
      const filtered = allPedidos.filter((p: any) => 
        currentUserId !== null && String(p.id_usuario) === String(currentUserId)
      );
      
      const mappedOrders: Order[] = filtered.map((p: any) => {
        const dishesList = (p.detalles || []).map((det: any) => {
          let name = "Plato";
          if (det.id_plato) {
            const matched = ps.find((x: any) => x.id === det.id_plato);
            if (matched) name = matched.nombre;
          } else if (det.id_combo) {
            const matched = cs.find((x: any) => x.id === det.id_combo);
            if (matched) name = matched.nombre;
          }
          return `${det.cantidad}x ${name}`;
        });
        
        let statusText: "ESPERA" | "COCINANDO" | "LISTO" | "PAGADO" = "ESPERA";
        if (p.estado_pago === "PAGADO") {
          statusText = "PAGADO";
        } else if (p.estado_cocina === "PREPARANDO" || p.estado_cocina === "En proceso") {
          statusText = "COCINANDO";
        } else if (p.estado_cocina === "LISTO" || p.estado_cocina === "Listo") {
          statusText = "LISTO";
        }
        
        return {
          id: p.ticket || `ORD-${p.id}`,
          date: new Date(p.fecha_venta).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          total: `S/ ${Number(p.total).toFixed(2)}`,
          status: statusText,
          dishes: dishesList,
        };
      });
      
      setUserOrders(mappedOrders);
    } catch (err) {
      console.error("Error loading user orders:", err);
    }
  };

  const downloadMenu = () => {
    const link = document.createElement("a");
    link.href = "/carta.pdf";
    link.download = "Carta_Akaza_2026.pdf"; // ESTO ES EL NOMBRE CON LA QUE SE GUARDA EL PDF EN LA PC DEL CLIENTE O QUIEN LO VAYA A DESCARGAR . RECUERDA
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const orderViaChat = (plato: string) => {
    router.push(`/chat?prompt=${encodeURIComponent(`Quiero ordenar el plato: ${plato}`)}`);
  };

  // Función para que al momento de scrolear el usuario sea mas amigable la interaccion
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-akaza-crema flex flex-col font-sans relative selection:bg-akaza-amarillo selection:text-akaza-marron">
      <Navbar
        isLoggedIn={isLoggedIn}
        isUserMenuOpen={isUserMenuOpen}
        profileName={profileData.name}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenQr={() => setIsQrOpen(true)}
        onToggleUserMenu={() => setIsUserMenuOpen((prev) => !prev)}
        onOpenProfile={openProfileModal}
        onOpenOrders={openOrdersModal}
        onLogout={handleLogout}
        onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onScrollToSection={scrollToSection}
      />

      <HeroSection onDownloadMenu={downloadMenu} />
      <CategoriesSection />
      <SpecialtiesSection dishes={featuredDishes} onOrderViaChat={orderViaChat} />
      <HowToOrderSection />
      <AISpecialtySection />
      <AboutSection />
      <TestimonialsSection />

      <AuthModal
        isOpen={isLoginOpen}
        isRegisterMode={isRegisterMode}
        authForm={authForm}
        onClose={() => {
          setIsLoginOpen(false);
          setIsRegisterMode(false);
        }}
        onToggleMode={() => setIsRegisterMode((prev) => !prev)}
        onSubmit={handleAuthSubmit}
        onChange={handleAuthFieldChange}
        errorMessage={authError}
      />

      <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <ProfileModal
        isOpen={isProfileOpen}
        profileData={profileData}
        onClose={() => setIsProfileOpen(false)}
        onChange={handleProfileFieldChange}
        onSave={handleProfileSave}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        orders={userOrders}
        onClose={() => setIsOrdersOpen(false)}
        onReorder={orderViaChat}
      />

      <ChatWidget />

      <Footer />
    </div>
  );
}
