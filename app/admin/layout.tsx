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
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarExpanded ? "w-64" : "w-20"
        } bg-akaza-marron transition-all duration-300 ease-in-out flex flex-col z-50`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="w-8 h-8 bg-akaza-amarillo rounded-lg flex-shrink-0 flex items-center justify-center">
            <span className="text-akaza-marron font-black">A</span>
          </div>
          {isSidebarExpanded && (
            <span className="ml-3 text-white font-bold tracking-tight text-xl">
              AKAZA <span className="text-akaza-amarillo text-xs ml-1">ADMIN</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-akaza-amarillo text-akaza-marron shadow-lg" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={22} className={`${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                {isSidebarExpanded && (
                  <span className="ml-4 font-medium">{item.name}</span>
                )}
                {isActive && isSidebarExpanded && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-akaza-marron" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Bottom Section */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={22} />
            {isSidebarExpanded && <span className="ml-4 font-medium">Cerrar Sesión</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-24 bg-akaza-amarillo text-akaza-marron w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-akaza-marron/10 z-50 hover:scale-110 transition-transform"
        >
          {isSidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-40">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-akaza-amarillo/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-akaza-marron transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-akaza-marron leading-none">Admin Akaza</p>
                <p className="text-xs text-gray-400 mt-1">Super Administrador</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-akaza-crema border border-akaza-marron/10 flex items-center justify-center text-akaza-marron">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
