"use client";

import {
  Camera,
  ChevronDown,
  ClipboardList,
  CircleUserRound,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

type NavbarProps = {
  isLoggedIn: boolean;
  isUserMenuOpen: boolean;
  profileName: string;
  onOpenLogin: () => void;
  onOpenQr: () => void;
  onToggleUserMenu: () => void;
  onOpenProfile: () => void;
  onOpenOrders: () => void;
  onLogout: () => void;
  onScrollTop: () => void;
  onScrollToSection: (id: string) => void;
};

export function Navbar({
  isLoggedIn,
  isUserMenuOpen,
  profileName,
  onOpenLogin,
  onOpenQr,
  onToggleUserMenu,
  onOpenProfile,
  onOpenOrders,
  onLogout,
  onScrollTop,
  onScrollToSection,
}: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full bg-akaza-marron text-white px-4 sm:px-8 py-3.5 shadow-md flex justify-between items-center border-b border-white/10">
      {/* Marca / Logo AKAZA (Izquierda) */}
      <div className="flex items-center cursor-pointer" onClick={onScrollTop}>
        <span className="font-serif text-xl sm:text-2xl font-black tracking-widest uppercase text-white drop-shadow">
          AKAZA
        </span>
      </div>

      {/* Ítems del Menú Estructura Exacta Requerida */}
      <div className="flex items-center gap-3 sm:gap-6 text-xs font-serif tracking-wider">
        <button
          onClick={() => router.push("/chat")}
          className="hidden md:inline-block hover:text-akaza-amarillo transition-colors"
        >
          Realizar pedido
        </button>

        <button
          onClick={() => onScrollToSection("faq")}
          className="hidden lg:flex items-center gap-1 hover:text-akaza-amarillo transition-colors"
        >
          <HelpCircle size={14} /> Preguntas Frecuentes
        </button>

        <button
          onClick={onOpenQr}
          className="border border-white/60 hover:border-white px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 flex items-center gap-1.5"
        >
          <Camera size={14} className="text-akaza-amarillo" /> Escanear mesa
        </button>

        {!isLoggedIn ? (
          <button
            onClick={onOpenLogin}
            className="border border-white bg-white/10 hover:bg-white hover:text-black px-3.5 py-1.5 rounded text-[11px] font-bold tracking-wider transition-all"
          >
            Iniciar Sesión
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={onToggleUserMenu}
              className="bg-white/20 border border-white/40 text-white px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-white/30 transition-all flex items-center gap-1.5"
            >
              <CircleUserRound size={15} />
              <span className="hidden sm:inline">{profileName}</span>
              <ChevronDown size={14} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-10 w-52 bg-white text-akaza-marron rounded-xl border border-akaza-marron/10 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                <button
                  onClick={onOpenProfile}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold hover:bg-akaza-crema transition-colors flex items-center gap-2"
                >
                  <User size={15} /> Mi Perfil
                </button>
                <button
                  onClick={onOpenOrders}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold hover:bg-akaza-crema transition-colors flex items-center gap-2"
                >
                  <ClipboardList size={15} /> Mis Pedidos
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={15} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
