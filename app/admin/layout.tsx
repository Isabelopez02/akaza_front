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
  User2Icon,
  BarChart3,
  Sun,
  Moon
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
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const validarAcceso = async () => {
      try {
        const usuario = await AuthService.checkSession();
        if (!usuario?.autenticado || usuario?.rol !== "administrador") {
          router.push("/");
          return;
        }
      } catch {
        router.push("/");
        return;
      } flex: {
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
        { name: "Reportes", icon: BarChart3, href: "/admin/reporte" },
      ]
    },
    {
      title: "Inventario y Ventas",
      items: [
        { name: "Insumos", icon: Package, href: "/admin/products" },
        { name: "Compras", icon: ShoppingCartIcon, href: "/admin/compras" },
        { name: "Platos", icon: UtensilsCrossed, href: "/admin/dishes" },
        { name: "Combos", icon: Layers, href: "/admin/combos" },
        { name: "Ventas", icon: Layers, href: "/admin/venta" },
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
      <div className="h-screen w-full flex items-center justify-center bg-akaza-crema font-serif text-akaza-marron">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-akaza-marron"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden relative font-sans ${isDark ? "dark-theme" : "bg-[#FDFCFB]"}`}>
      {/* ── REGLAS DE ESTILO CSS PARA MODO OSCURO Y FUENTE MERRIWEATHER EN ADMIN ── */}
      <style dangerouslySetInnerHTML={{ __html: `
  h1, h2, h3, h4, h5, h6, .admin-title {
    font-family: var(--font-merriweather), serif !important;
  }
  .dark-theme {
    background-color: #0b0f19 !important;
    color: #cbd5e1 !important;
  }
  .dark-theme header {
    background-color: #131b2e !important;
    border-color: #1e294b !important;
  }
  .dark-theme header p, .dark-theme header h1, .dark-theme header span, .dark-theme header div {
    color: #f8fafc !important;
  }
  .dark-theme .bg-white, .dark-theme .bg-white\\/90, .dark-theme .admin-page-container .bg-white {
    background-color: #131b2e !important;
    color: #f1f5f9 !important;
    border-color: #1e294b !important;
  }
  .dark-theme .bg-gradient-to-br {
    background-image: none !important;
    background-color: #131b2e !important;
    color: #f1f5f9 !important;
  }
  .dark-theme h1.text-akaza-marron, 
  .dark-theme h2.text-akaza-marron,
  .dark-theme h3.text-akaza-marron,
  .dark-theme .text-akaza-marron {
    color: #f8fafc !important;
  }
  .dark-theme select, .dark-theme input {
    background-color: #0b0f19 !important;
    color: #f1f5f9 !important;
    border-color: #1e294b !important;
  }
  .dark-theme th {
    background-color: #131b2e !important;
    color: #94a3b8 !important;
    border-color: #1e294b !important;
  }
  .dark-theme .bg-akaza-crema {
    background-color: #1e294b !important;
    color: #f8fafc !important;
  }
  .dark-theme aside {
    background-color: #1A0C07 !important;
    border-right: 1px solid #2C1810 !important;
  }
`}} />

      {/* Mobile Overlay */}
      {isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[45] md:hidden"
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}

      {/* Sidebar de Admin Estilo /chat */}
      <aside 
        className={`${
          isSidebarExpanded ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        } bg-[#24130C] text-white transition-all duration-300 ease-in-out flex flex-col z-50 fixed md:relative h-full border-r border-white/10 shadow-2xl shrink-0`}
      >
        {/* Cabecera del Logo estilo Chat */}
        <div className="h-16 bg-[#1B0E09] flex items-center px-5 border-b border-white/10 flex-shrink-0 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-akaza-amarillo text-akaza-marron rounded-lg flex-shrink-0 flex items-center justify-center shadow-xs font-black font-serif">
              A
            </div>
            {isSidebarExpanded && (
              <span className="font-serif text-lg font-black tracking-widest text-white uppercase animate-in fade-in duration-300">
                AKAZA <span className="text-akaza-amarillo font-sans text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10">ADMIN</span>
              </span>
            )}
          </div>
        </div>

        {/* Navegación del Menú */}
        <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {isSidebarExpanded && (
                <h3 className="px-3 text-[10px] font-mono font-bold text-white/40 uppercase tracking-[2px] mb-2">
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
                        relative flex items-center p-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? "bg-white/10 text-akaza-amarillo border-l-4 border-akaza-amarillo shadow-sm" 
                          : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                        }
                      `}
                    >
                      <item.icon 
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`
                          shrink-0 transition-transform duration-200
                          ${isActive ? "scale-110 text-akaza-amarillo" : "group-hover:scale-110 group-hover:text-akaza-amarillo"}
                        `} 
                      />

                      {isSidebarExpanded && (
                        <span className={`
                          ml-3.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200
                          ${isActive ? "font-bold text-white" : "opacity-80 group-hover:opacity-100"}
                        `}>
                          {item.name}
                        </span>
                      )}

                      {!isSidebarExpanded && (
                        <div className="absolute left-14 bg-[#1B0E09] text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md font-mono border border-white/10">
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

        {/* Sección de Usuario & Logout */}
        <div className="p-3 bg-[#1B0E09] border-t border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            {isSidebarExpanded && (
              <div className="flex items-center gap-2.5 overflow-hidden text-left pl-1">
                <div className="w-8 h-8 rounded-full bg-akaza-amarillo text-akaza-marron font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <User size={15} />
                </div>
                <div className="truncate">
                  <p className="font-serif text-xs font-bold text-white truncate">Admin Akaza</p>
                  <p className="text-[9px] font-mono text-white/50 uppercase tracking-wider">Super Admin</p>
                </div>
              </div>
            )}

            <button 
              onClick={handleLogout}
              className={`p-2 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/20 transition-all ${
                !isSidebarExpanded ? "w-full flex justify-center" : ""
              }`}
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Toggle Button Desktop */}
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-20 bg-akaza-amarillo text-akaza-marron w-6 h-6 rounded-full hidden md:flex items-center justify-center shadow-md border border-akaza-marron/10 z-[60] hover:scale-110 transition-transform"
        >
          {isSidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Minimalista */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-40 flex-shrink-0 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
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
                placeholder="Buscar en panel..." 
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-1.5 pl-9 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-akaza-marron/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle Modo Claro / Oscuro */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700" 
                  : "bg-gray-50 border-gray-100 text-akaza-marron hover:bg-gray-100"
              }`}
              title={isDark ? "Modo Claro" : "Modo Oscuro"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="relative p-1.5 text-gray-400 hover:text-akaza-marron hover:bg-gray-50 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-100 hidden xs:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-serif text-xs font-bold text-akaza-marron leading-none">Admin Akaza</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 font-mono">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-akaza-crema/50 border border-akaza-marron/10 flex items-center justify-center text-akaza-marron shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <User size={14} />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la Página de Admin con Tipografía Merriweather */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 custom-scrollbar font-sans">
          {children}
        </main>
      </div>
    </div>
  );
}
