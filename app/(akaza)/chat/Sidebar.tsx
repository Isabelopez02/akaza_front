"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Bot,
  UtensilsCrossed,
  Pencil,
  Check,
  X,
  Settings,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

type ChatSessionMode = "general" | "mesa";

type ChatSession = {
  id: string;
  title: string;
  date: string;
  mode: ChatSessionMode;
  mesaId: number | null;
  messages: any[];
};

interface SidebarProps {
  chatHistory: ChatSession[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  createNewGeneralSession: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenQr?: () => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
  isLoggedIn?: boolean;
  profileName?: string;
  onOpenLogin?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export function Sidebar({
  chatHistory,
  currentSessionId,
  setCurrentSessionId,
  createNewGeneralSession,
  isSidebarOpen,
  setIsSidebarOpen,
  onRenameSession,
  isLoggedIn,
  profileName,
  onOpenLogin,
  onOpenProfile,
  onLogout,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startRenaming = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveRenaming = (sessionId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onRenameSession && editingTitle.trim()) {
      onRenameSession(sessionId, editingTitle);
    }
    setEditingSessionId(null);
  };

  const cancelRenaming = () => {
    setEditingSessionId(null);
  };

  return (
    <>
      {/* SIDEBAR DESKTOP ESTILO WHATSAPP WEB CON EDICIÓN DE TÍTULO & CONFIGURACIÓN */}
      <aside className="hidden md:flex md:w-80 bg-[#24130C] text-white border-r border-white/10 shadow-2xl shrink-0 flex-col h-full">
        
        {/* Cabecera Estilo WhatsApp */}
        <div className="p-4 bg-[#1B0E09] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-akaza-marron border border-akaza-amarillo/40 text-akaza-amarillo flex items-center justify-center font-bold shadow-xs">
              <Bot size={18} />
            </div>
            <div className="text-left">
              <h1 className="font-serif text-sm font-bold tracking-widest text-white uppercase leading-none">
                AKAZA <span className="text-[9px] font-sans text-akaza-amarillo font-semibold">BOT</span>
              </h1>
              <span className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Asistente Activo
              </span>
            </div>
          </div>

          <button
            onClick={createNewGeneralSession}
            className="bg-akaza-amarillo hover:bg-white text-akaza-marron p-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            title="Nuevo Chat"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Buscador de Chats */}
        <div className="p-3 bg-[#24130C] border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversación..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/35 outline-none focus:border-akaza-amarillo/50 transition-all font-sans"
            />
          </div>
        </div>

        {/* Lista de Hilos de Conversación con Edición de Título */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-white/40 font-mono">
              No se encontraron chats
            </div>
          ) : (
            filteredHistory.map((chat) => {
              const isSelected = currentSessionId === chat.id;
              const isEditing = editingSessionId === chat.id;
              const lastMsg = chat.messages[chat.messages.length - 1]?.content || "Sin mensajes";

              return (
                <div
                  key={chat.id}
                  onClick={() => setCurrentSessionId(chat.id)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer relative group ${
                    isSelected
                      ? "bg-white/10 border-l-4 border-akaza-amarillo"
                      : "hover:bg-white/5 border-l-4 border-transparent"
                  }`}
                >
                  {/* Avatar de la Conversación */}
                  <div className="w-9 h-9 rounded-full bg-akaza-marron border border-white/10 text-akaza-amarillo flex items-center justify-center shrink-0 shadow-xs font-bold">
                    {chat.mode === "mesa" ? <UtensilsCrossed size={15} /> : <Bot size={15} />}
                  </div>

                  {/* Info del Chat & Edición de Título */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      {isEditing ? (
                        <form
                          onSubmit={(e) => saveRenaming(chat.id, e)}
                          className="flex items-center gap-1 w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            autoFocus
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded outline-none w-full"
                          />
                          <button type="submit" className="text-green-400 hover:text-white p-0.5">
                            <Check size={13} />
                          </button>
                          <button type="button" onClick={cancelRenaming} className="text-red-400 hover:text-white p-0.5">
                            <X size={13} />
                          </button>
                        </form>
                      ) : (
                        <>
                          <h4 className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                            {chat.title}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-white/40 font-mono">
                              {chat.date}
                            </span>
                            <button
                              onClick={(e) => startRenaming(chat, e)}
                              className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-akaza-amarillo transition-all p-1"
                              title="Editar título"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <p className="text-[11px] text-white/60 truncate font-sans">
                        {chat.mode === "mesa" && chat.mesaId ? `Mesa ${chat.mesaId} · ` : ""}
                        {lastMsg}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER DEL SIDEBAR: MÓDULO DE INICIAR SESIÓN / CONFIGURACIÓN ── */}
        <div className="p-3 bg-[#1B0E09] border-t border-white/10">
          {!isLoggedIn ? (
            <button
              onClick={onOpenLogin}
              className="w-full bg-white/10 hover:bg-akaza-amarillo hover:text-akaza-marron text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/15 shadow-xs"
            >
              <LogIn size={15} />
              <span>Iniciar Sesión</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-xl border border-white/15">
              <div className="flex items-center gap-2 overflow-hidden text-left">
                <div className="w-7 h-7 rounded-full bg-akaza-amarillo text-akaza-marron font-bold flex items-center justify-center text-xs shrink-0">
                  <User size={14} />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">
                    {profileName || "Usuario"}
                  </span>
                  <span className="text-[9px] text-white/60 font-mono">En línea</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={onOpenProfile}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-akaza-amarillo transition-colors"
                  title="Configuración de Perfil"
                >
                  <Settings size={15} />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

      </aside>

      {/* SIDEBAR MOBILE DRAWER CON EDICIÓN DE TÍTULO */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#24130C] text-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 bg-[#1B0E09] border-b border-white/10 flex items-center justify-between">
          <span className="font-serif text-sm font-bold tracking-widest text-white uppercase">
            AKAZA BOT
          </span>
          <button
            onClick={() => {
              createNewGeneralSession();
              setIsSidebarOpen(false);
            }}
            className="bg-akaza-amarillo text-akaza-marron px-2.5 py-1 rounded-lg text-xs font-bold"
          >
            + Nuevo
          </button>
        </div>

        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={13} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar chat..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/40 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setCurrentSessionId(chat.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full p-3 flex items-center gap-3 text-left ${
                currentSessionId === chat.id ? "bg-white/10 border-l-4 border-akaza-amarillo" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-akaza-marron text-akaza-amarillo flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{chat.title}</p>
                <p className="text-[10px] text-white/50 truncate">
                  {chat.mode === "mesa" && chat.mesaId ? `Mesa ${chat.mesaId}` : "General"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#1B0E09] border-t border-white/10">
          {!isLoggedIn ? (
            <button
              onClick={() => {
                if (onOpenLogin) onOpenLogin();
                setIsSidebarOpen(false);
              }}
              className="w-full bg-white/10 text-white text-xs font-bold py-2 rounded-xl"
            >
              Iniciar Sesión
            </button>
          ) : (
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold truncate">{profileName}</span>
              <button
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  setIsSidebarOpen(false);
                }}
                className="text-akaza-amarillo"
              >
                <Settings size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}