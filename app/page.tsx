"use client";
import { useState } from "react";
import { AboutSection } from "./components/home/AboutSection";
import { AuthModal } from "./components/home/AuthModal";
import { ChatWidget } from "./components/home/ChatWidget";
import { Footer } from "./components/home/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { Navbar } from "./components/home/Navbar";
import { OrdersModal } from "./components/home/OrdersModal";
import { ProfileModal } from "./components/home/ProfileModal";
import { QrModal } from "./components/home/QrModal";
import { SpecialtiesSection } from "./components/home/SpecialtiesSection";
import {
  featuredDishes,
  initialProfileData,
  mockOrders,
} from "./components/home/constants";
import { AuthForm, ProfileData } from "./components/home/types";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegisterMode && authForm.fullName.trim()) {
      setProfileData((prev) => ({
        ...prev,
        name: authForm.fullName.trim(),
        email: authForm.email.trim() || prev.email,
      }));
    }
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    setIsRegisterMode(false);
    setAuthForm({ fullName: "", email: "", password: "" });
  };

  const handleLogout = () => {
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
    setIsChatOpen(true);
    // Esto simula que el usuario ya escribió el nombre del plato
    // Podrías pasarlo a un estado de 'mensajes' si quieres que aparezca escrito
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

      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onToggle={() => setIsChatOpen((prev) => !prev)}
      />

      <Footer />
    </div>
  );
}
