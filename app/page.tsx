"use client";
import { useEffect, useState } from "react";
import { AboutSection } from "./components/home/AboutSection";
import { AuthModal } from "./components/home/AuthModal";
import { ChatWidget } from "./components/home/ChatWidget";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { Navbar } from "./components/layout/Navbar";
import { OrdersModal } from "./components/shared/OrdersModal";
import { ProfileModal } from "./components/shared/ProfileModal";
import { QrModal } from "./components/home/QrModal";
import { SpecialtiesSection } from "./components/shared/SpecialtiesSection";
import {
  featuredDishes,
  initialProfileData,
  mockOrders,
} from "./components/shared/constants";
import { AuthForm, ProfileData } from "./components/shared/types";
import { AuthService } from "./service/auth.service";

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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await AuthService.checkSession();
        setIsLoggedIn(Boolean(data?.autenticado));
        setProfileData((prev) => ({
          ...prev,
          name: prev.name || data?.correo || "Usuario",
          email: data?.correo || prev.email,
        }));
      } catch {
        setIsLoggedIn(false);
      }
    };
    void checkSession();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setAuthError("");

  try {
    // 🟢 1. REGISTER (opcional)
    if (isRegisterMode) {
      const resRegister = await AuthService.register(
        authForm.fullName.trim(),
        authForm.email.trim(),
        authForm.password
      );
      console.log("🟢 REGISTER OK:", resRegister);
    }

    // 🟢 2. LOGIN
    const resLogin = await AuthService.login(
      authForm.email.trim(),
      authForm.password
    );

    console.log("🔥 LOGIN RESPONSE:", resLogin);

    // 🔥 3. VALIDAR TOKEN (CLAVE)
    if (!resLogin?.access_token) {
      throw new Error("No se recibió token del backend");
    }

    // 🔥 4. LOGUEAR INMEDIATO (SIN /me)
    setIsLoggedIn(true);

    // 🟢 5. (Opcional) obtener datos del usuario
    let data = null;
    try {
      data = await AuthService.checkSession();
      console.log("🟢 /me:", data);
    } catch {
      console.log("⚠️ /me falló pero login fue exitoso");
    }

    // 🟢 6. ACTUALIZAR PERFIL
    setProfileData((prev) => ({
      ...prev,
      name:
        authForm.fullName.trim() ||
        data?.correo ||
        prev.name ||
        "Usuario",
      email:
        data?.correo ||
        authForm.email.trim() ||
        prev.email,
    }));

    // 🟢 7. LIMPIAR UI
    setIsLoginOpen(false);
    setIsRegisterMode(false);
    setAuthForm({ fullName: "", email: "", password: "" });

  } catch (error: any) {
    console.error("❌ ERROR LOGIN:", error?.response?.data || error);

    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Error en autenticación";

    setAuthError(message);
  }
};

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
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

  const openProfileModal = () => {
    setIsProfileOpen(true);
    setIsUserMenuOpen(false);
  };

  const openOrdersModal = () => {
    setIsOrdersOpen(true);
    setIsUserMenuOpen(false);
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
    // Punto de integración futura: redirigir al chat con el plato preseleccionado
    console.log(`El usuario está interesado en: ${plato}`);
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
      <SpecialtiesSection dishes={featuredDishes} onOrderViaChat={orderViaChat} />
      <AboutSection />

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
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        orders={mockOrders}
        onClose={() => setIsOrdersOpen(false)}
        onReorder={orderViaChat}
      />

      <ChatWidget />

      <Footer />
    </div>
  );
}
