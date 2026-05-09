"use client";
import { useState } from "react";
import { ChefHat, LayoutDashboard, ClipboardList, LogOut, ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const currentPage = menuItems.find(m => m.href === pathname);

  return (
    <div className="flex h-screen bg-[#FDFCFB] overflow-hidden">
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
          <button className={`w-full flex items-center gap-3 rounded-xl p-3.5 text-white/35 hover:text-red-400 hover:bg-red-400/10 transition-all ${collapsed ? "justify-center" : ""}`}>
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
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 z-40">
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

          <div className="flex items-center gap-2.5">
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