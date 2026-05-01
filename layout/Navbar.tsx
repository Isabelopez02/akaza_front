import Image from "next/image";
import {
  Camera,
  ChevronDown,
  ClipboardList,
  CircleUserRound,
  LogOut,
  User,
} from "lucide-react";

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
  return (
    <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-akaza-marron/5 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onScrollTop}>
        <div className="relative w-10 h-10">
          <Image
            src="/logo-akaza.png"
            alt="Logo Akaza"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-akaza-marron font-black tracking-tighter text-2xl uppercase">
          Akaza
        </span>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-bold text-akaza-marron/60 uppercase tracking-widest">
        <button onClick={onScrollTop} className="hover:text-akaza-marron transition-colors">
          Inicio
        </button>
        <button
          onClick={() => onScrollToSection("joyas")}
          className="hover:text-akaza-marron transition-colors"
        >
          Carta
        </button>
        <button
          onClick={() => onScrollToSection("nosotros")}
          className="hover:text-akaza-marron transition-colors"
        >
          Nosotros
        </button>
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={onOpenQr}
          className="bg-white text-akaza-marron border border-akaza-marron/10 px-4 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <Camera size={16} /> QR
        </button>

        {!isLoggedIn ? (
          <button
            onClick={onOpenLogin}
            className="bg-akaza-marron text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <User size={16} /> Login
          </button>
        ) : (
          <>
            <button
              onClick={onToggleUserMenu}
              className="bg-akaza-marron text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <CircleUserRound size={18} />
              <span className="hidden sm:inline">{profileName}</span>
              <ChevronDown size={15} />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 top-14 w-56 bg-white rounded-3xl border border-akaza-marron/10 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                <button
                  onClick={onOpenProfile}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-akaza-marron hover:bg-akaza-crema transition-colors flex items-center gap-2"
                >
                  <User size={16} /> Mi Perfil
                </button>
                <button
                  onClick={onOpenOrders}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-akaza-marron hover:bg-akaza-crema transition-colors flex items-center gap-2"
                >
                  <ClipboardList size={16} /> Mis Pedidos
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
