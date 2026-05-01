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
  User
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
    const checkAdmin = async () => {
      try {
        const data = await AuthService.checkSession();
        // Asumimos que el backend devuelve el rol. 
        // Si no es admin, redirigir a inicio.
        if (!data?.autenticado || data?.rol !== "administrador") {
          // Descomentar esto cuando el backend esté listo con roles
          // router.push("/"); 
        }
      } catch (error) {
        // router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    void checkAdmin();
  }, [router]);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Productos", icon: Package, href: "/admin/products" },
    { name: "Platos", icon: UtensilsCrossed, href: "/admin/dishes" },
    { name: "Combos", icon: Layers, href: "/admin/combos" },
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

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarExpanded(false);
                }}
                className={`flex items-center p-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-akaza-amarillo text-akaza-marron shadow-lg" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={22} className={`${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                {isSidebarExpanded && (
                  <span className="ml-4 font-medium animate-in slide-in-from-left-2 duration-300">{item.name}</span>
                )}
                {isActive && isSidebarExpanded && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-akaza-marron" />
                )}
              </Link>
            );
          })}
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
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-40 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarExpanded(true)}
              className="p-2 bg-gray-50 text-akaza-marron rounded-xl md:hidden hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar en el panel..." 
                className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-akaza-amarillo/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-akaza-marron transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-100 hidden xs:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-akaza-marron leading-none">Admin Akaza</p>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-akaza-crema border border-akaza-marron/5 flex items-center justify-center text-akaza-marron shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
