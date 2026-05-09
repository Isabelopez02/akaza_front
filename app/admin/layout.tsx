"use client";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  UtensilsCrossed, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User,
  ShoppingCartIcon,
  User2Icon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/service/auth.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const validarAcceso = async () => {
      try {
        const usuario = await AuthService.checkSession();
        // Si no está autenticado o no es administrador, rechazar acceso
        if (!usuario?.autenticado || usuario?.rol !== "administrador") {
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

  const menuGroups = [
    {
      title: "Principal",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      ]
    },
    {
      title: "Inventario y Ventas",
      items: [
        { name: "Insumos", icon: Package, href: "/admin/products" },
        { name: "Compras", icon: ShoppingCartIcon, href: "/admin/compras" }, // Ajusté la ruta para que no choque
        { name: "Platos", icon: UtensilsCrossed, href: "/admin/dishes" },
        { name: "Combos", icon: Layers, href: "/admin/combos" },
      ]
    },
    {
      title: "Sistema",
      items: [
        { name: "Usuarios", icon: User2Icon, href: "/admin/user" },
      ]
    }
  ];

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-akaza-crema">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akaza-marron"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[45] md:hidden"
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarExpanded ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        } bg-akaza-marron transition-all duration-300 ease-in-out flex flex-col z-50 fixed md:relative h-full`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 bg-akaza-amarillo rounded-lg flex-shrink-0 flex items-center justify-center">
            <span className="text-akaza-marron font-black">A</span>
          </div>
          {isSidebarExpanded && (
            <span className="ml-3 text-white font-bold tracking-tight text-xl animate-in fade-in duration-500">
              AKAZA <span className="text-akaza-amarillo text-[10px] ml-1 opacity-70">ADMIN</span>
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {/* Etiqueta de Grupo - Solo si el sidebar está expandido */}
              {isSidebarExpanded && (
                <h3 className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-[2px] mb-4">
                  {group.title}
                </h3>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 768) setIsSidebarExpanded(false);
                      }}
                      className={`
                        relative flex items-center p-3 rounded-2xl transition-all duration-300 group
                        ${isActive 
                          ? "bg-akaza-amarillo text-akaza-marron shadow-[0_10px_20px_-10px_rgba(255,193,7,0.5)]" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      {/* Indicador lateral activo (Pill) */}
                      {isActive && (
                        <div className="absolute -left-1 w-1 h-6 bg-akaza-marron rounded-full" />
                      )}

                      {/* Icono con efecto de escala */}
                      <item.icon 
                        size={20} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`
                          shrink-0 transition-transform duration-300
                          ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-akaza-amarillo"}
                        `} 
                      />

                      {/* Texto con Fade-in */}
                      {isSidebarExpanded && (
                        <span className={`
                          ml-4 text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300
                          ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}
                        `}>
                          {item.name}
                        </span>
                      )}

                      {/* Tooltip personalizado cuando está colapsado (Opcional pero recomendado) */}
                      {!isSidebarExpanded && (
                        <div className="absolute left-14 bg-akaza-marron text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User / Bottom Section */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={22} />
            {isSidebarExpanded && <span className="ml-4 font-medium">Cerrar Sesión</span>}
          </button>
        </div>

        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-24 bg-akaza-amarillo text-akaza-marron w-6 h-6 rounded-full hidden md:flex items-center justify-center shadow-md border border-akaza-marron/10 z-[60] hover:scale-110 transition-transform"
        >
          {isSidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Minimalista */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-40 flex-shrink-0 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarExpanded(true)}
              className="p-1.5 bg-gray-50 text-akaza-marron rounded-lg md:hidden hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-akaza-marron/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-1.5 text-gray-400 hover:text-akaza-marron hover:bg-gray-50 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-100 hidden xs:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-akaza-marron leading-none">Admin Akaza</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-akaza-crema/50 border border-akaza-marron/10 flex items-center justify-center text-akaza-marron shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <User size={14} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
