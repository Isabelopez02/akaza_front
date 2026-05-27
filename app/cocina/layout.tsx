"use client";
import { useState } from "react";
import { ChefHat, LayoutDashboard, ClipboardList, LogOut, ChevronLeft, ChevronRight, MessageCircle, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/service/auth.service";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/cocina" },
  { name: "Pedidos",   icon: ClipboardList,   href: "/cocina/pedidos" },
];

function ChatBotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola cocinero 👨‍🍳 ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: "Estoy procesando tu consulta..." },
    ]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-[100] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-akaza-marron text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-akaza-amarillo flex items-center justify-center">
                <MessageCircle size={15} className="text-akaza-marron" />
              </div>
              <div>
                <p className="text-xs font-black">Asistente Cocina</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">en línea</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="h-56 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] px-3 py-2 rounded-xl text-xs font-medium leading-relaxed ${
                  msg.from === "user"
                    ? "bg-akaza-marron text-white"
                    : "bg-white text-gray-700 border border-gray-100 shadow-sm"
                }`}>{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Escribe aquí..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-akaza-marron/10 transition-all"
            />
            <button
              onClick={sendMessage}
              className="px-3 py-2 bg-akaza-marron text-white rounded-xl text-xs font-black hover:bg-black transition-colors"
            >Enviar</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-akaza-marron text-white rounded-2xl shadow-xl shadow-akaza-marron/25 flex items-center justify-center hover:bg-black transition-all hover:scale-105 active:scale-95"
        title="Asistente Cocina"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </>
  );
}

export default function CocinaLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = menuItems.find(m => m.href === pathname);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "dark-theme" : "bg-[#FDFCFB]"}`}>
      {/* ── ESTILOS CSS INYECTADOS PARA EL MODO OSCURO ── */}
      <style dangerouslySetInnerHTML={{ __html: `
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
        .dark-theme .bg-white, .dark-theme .bg-white\\/90 {
          background-color: #131b2e !important;
          color: #f1f5f9 !important;
          border-color: #1e294b !important;
        }
        /* Eliminar gradientes de alta saturación en tarjetas */
        .dark-theme .bg-gradient-to-br {
          background-image: none !important;
          background-color: #131b2e !important;
          color: #f1f5f9 !important;
        }
        .dark-theme .from-green-50, .dark-theme .to-emerald-50\\/50, .dark-theme .border-green-100 {
          background-color: #131b2e !important;
          border-color: rgba(16, 185, 129, 0.25) !important;
        }
        .dark-theme .from-red-50, .dark-theme .to-rose-50\\/50, .dark-theme .border-red-100 {
          background-color: #131b2e !important;
          border-color: rgba(239, 68, 68, 0.25) !important;
        }
        /* Ajustar colores para textos de Akaza */
        .dark-theme h1.text-akaza-marron, 
        .dark-theme h2.text-akaza-marron,
        .dark-theme h3.text-akaza-marron,
        .dark-theme .text-akaza-marron {
          color: #f8fafc !important;
        }
        .dark-theme .text-gray-850, .dark-theme .text-gray-800 {
          color: #f1f5f9 !important;
        }
        .dark-theme .text-gray-700 {
          color: #e2e8f0 !important;
        }
        .dark-theme .text-gray-600 {
          color: #cbd5e1 !important;
        }
        .dark-theme .text-gray-500 {
          color: #94a3b8 !important;
        }
        .dark-theme .text-gray-400 {
          color: #64748b !important;
        }
        /* Bordes y elementos divisores */
        .dark-theme .border-gray-50, .dark-theme .border-gray-100, .dark-theme .border-gray-150, .dark-theme .border-gray-200 {
          border-color: #1e294b !important;
        }
        .dark-theme select, .dark-theme input {
          background-color: #0b0f19 !important;
          color: #f1f5f9 !important;
          border-color: #1e294b !important;
        }
        .dark-theme select:focus, .dark-theme input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15) !important;
        }
        .dark-theme tr:hover, .dark-theme .hover\\:bg-gray-50\\/50:hover {
          background-color: #1e294b !important;
        }
        .dark-theme th {
          background-color: #131b2e !important;
          color: #94a3b8 !important;
          border-color: #1e294b !important;
        }
        .dark-theme .bg-gray-50, .dark-theme .bg-gray-100, .dark-theme .bg-gray-150 {
          background-color: #1e294b !important;
          color: #cbd5e1 !important;
        }
        .dark-theme .bg-gray-50\\/50 {
          background-color: #131b2e !important;
        }
        .dark-theme .divide-gray-50 > * {
          border-color: #1e294b !important;
        }
        .dark-theme .bg-akaza-crema, .dark-theme .bg-akaza-crema\\/50 {
          background-color: #1e294b !important;
          color: #f8fafc !important;
          border-color: #1e294b !important;
        }
        /* Badges de estados e indicadores */
        .dark-theme .bg-green-100, .dark-theme .bg-green-50, .dark-theme .bg-green-50\\/50 {
          background-color: rgba(16, 185, 129, 0.12) !important;
          color: #34d399 !important;
          border-color: rgba(16, 185, 129, 0.2) !important;
        }
        .dark-theme .bg-red-100, .dark-theme .bg-red-50, .dark-theme .bg-red-50\\/50, .dark-theme .bg-rose-50 {
          background-color: rgba(239, 68, 68, 0.12) !important;
          color: #f87171 !important;
          border-color: rgba(239, 68, 68, 0.2) !important;
        }
        .dark-theme .bg-blue-100, .dark-theme .bg-blue-50, .dark-theme .bg-blue-50\\/50 {
          background-color: rgba(59, 130, 246, 0.12) !important;
          color: #60a5fa !important;
          border-color: rgba(59, 130, 246, 0.2) !important;
        }
        .dark-theme .bg-amber-50, .dark-theme .bg-amber-100 {
          background-color: rgba(245, 158, 11, 0.12) !important;
          color: #fbbf24 !important;
          border-color: rgba(245, 158, 11, 0.2) !important;
        }
        .dark-theme .text-green-700, .dark-theme .text-green-600 {
          color: #34d399 !important;
        }
        .dark-theme .text-red-700, .dark-theme .text-red-600 {
          color: #f87171 !important;
        }
        .dark-theme .text-blue-700, .dark-theme .text-blue-600 {
          color: #60a5fa !important;
        }
        .dark-theme .text-amber-700, .dark-theme .text-amber-600 {
          color: #fbbf24 !important;
        }
        .dark-theme button.bg-akaza-marron, .dark-theme .bg-akaza-marron {
          background-color: #1e294b !important;
          color: #f8fafc !important;
          border-color: #334155 !important;
        }
        .dark-theme button.bg-akaza-marron:hover, .dark-theme .bg-akaza-marron:hover {
          background-color: #2e3b6b !important;
        }
        /* Ajustar Sidebar/Navbar en modo oscuro */
        .dark-theme aside {
          background-color: #111625 !important;
          border-right: 1px solid #1e294b !important;
        }
        /* En modo oscuro, el link activo de la barra lateral es marrón con texto crema */
        .dark-theme aside .bg-akaza-amarillo {
          background-color: rgb(61, 28, 2) !important;
          color: #fdfcfb !important;
          box-shadow: 0 10px 20px -10px rgba(61, 28, 2, 0.5) !important;
        }
        /* Iconos y textos de links activos de barra lateral en modo oscuro */
        .dark-theme aside .bg-akaza-amarillo svg,
        .dark-theme aside .bg-akaza-amarillo span {
          color: #fdfcfb !important;
        }
        /* Píldora indicadora en modo oscuro */
        .dark-theme aside .bg-akaza-amarillo div {
          background-color: #fdfcfb !important;
        }
        /* Hovers en modo oscuro para links inactivos */
        .dark-theme aside a:not(.bg-akaza-amarillo):hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
        }
        .dark-theme aside a:not(.bg-akaza-amarillo):hover svg {
          color: #f59e0b !important;
        }
      `}} />

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`${collapsed ? "w-[72px]" : "w-64"} relative bg-akaza-marron flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out z-50`}>

        {/* Logo */}
        <div className={`flex items-center gap-3.5 border-b border-white/10 flex-shrink-0 ${collapsed ? "h-20 justify-center px-0" : "h-20 px-5"}`}>
          <div className="w-10 h-10 bg-akaza-amarillo rounded-xl flex-shrink-0 flex items-center justify-center shadow-md shadow-black/20">
            <ChefHat size={20} className="text-akaza-marron" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-in fade-in duration-200">
              <p className="text-white font-black text-base tracking-tight leading-none">AKAZA</p>
              <p className="text-akaza-amarillo text-[9px] font-bold uppercase tracking-[3px] mt-0.5">Cocina</p>
            </div>
          )}
        </div>

        {/* Perfil */}
        {!collapsed && (
          <div className="mx-4 mt-5 mb-1">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 rounded-xl bg-akaza-amarillo/15 border border-akaza-amarillo/20 flex items-center justify-center flex-shrink-0">
                <ChefHat size={15} className="text-akaza-amarillo" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">Cocinero</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">en línea</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1">
          {!collapsed && (
            <p className="px-3 text-[9px] font-black text-white/25 uppercase tracking-[2.5px] mb-3">Módulos</p>
          )}
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3.5 rounded-2xl transition-all duration-200 group
                  ${collapsed ? "justify-center p-4" : "p-4"}
                  ${isActive
                    ? "bg-akaza-amarillo text-akaza-marron shadow-lg shadow-akaza-amarillo/20"
                    : "text-white/55 hover:bg-white/8 hover:text-white"
                  }`}
              >
                <item.icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`shrink-0 transition-all duration-200 ${!isActive ? "group-hover:scale-110 group-hover:text-akaza-amarillo" : ""}`}
                />
                {!collapsed && (
                  <span className={`text-sm font-bold whitespace-nowrap transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}>
                    {item.name}
                  </span>
                )}
                {/* Tooltip colapsado */}
                {collapsed && (
                  <div className="absolute left-[72px] ml-1 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer logout */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-xl p-3.5 text-white/35 hover:text-red-400 hover:bg-red-400/10 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={19} strokeWidth={1.8} />
            {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>

        {/* Toggle collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[88px] w-6 h-6 bg-akaza-amarillo text-akaza-marron rounded-full flex items-center justify-center shadow-md border-2 border-akaza-marron/10 z-[60] hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* ── Área principal ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center justify-between px-6 flex-shrink-0 z-40 bg-white border-gray-105">
          <div className="flex items-center gap-3">
            {currentPage && (
              <div className="w-8 h-8 rounded-xl bg-akaza-crema border border-akaza-marron/10 flex items-center justify-center">
                <currentPage.icon size={16} className="text-akaza-marron" strokeWidth={2} />
              </div>
            )}
            <div>
              <p className="text-sm font-black text-akaza-marron leading-none">{currentPage?.name ?? "Cocina"}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Panel del Cocinero</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* ☀️ Botón Toggle Claro / Oscuro 🌙 */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700" 
                  : "bg-gray-50 border-gray-100 text-akaza-marron hover:bg-gray-100"
              }`}
              title={isDark ? "Activar Modo Claro" : "Activar Modo Oscuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Activo</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>

      <ChatBotButton />
    </div>
  );
}