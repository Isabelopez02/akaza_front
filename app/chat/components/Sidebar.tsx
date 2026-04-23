"use client";
import { ArrowLeft, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

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
}

export function Sidebar({
  chatHistory,
  currentSessionId,
  setCurrentSessionId,
  createNewGeneralSession,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex md:w-80 bg-akaza-marron text-akaza-blanco border-r border-akaza-blanco/10">
        <div className="flex flex-col h-full p-8 w-full">
          <Link href="/" className="flex items-center gap-2 mb-10 opacity-60 hover:opacity-100 transition-opacity font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <h1 className="text-3xl font-black leading-none mb-1">Akaza <span className="text-akaza-amarillo">Bot</span></h1>
          <button
            onClick={createNewGeneralSession}
            className="flex items-center gap-3 bg-akaza-amarillo/90 text-akaza-marron w-full p-4 rounded-2xl font-black text-xs my-8 uppercase transition-colors hover:bg-akaza-amarillo"
          >
            <Plus size={18} /> Nuevo Chat
          </button>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentSessionId(chat.id)}
                className={`group w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 cursor-pointer transition-all border text-left ${
                  currentSessionId === chat.id ? "border-akaza-amarillo/40 bg-white/5" : "border-transparent"
                }`}
              >
                <MessageSquare size={14} className="text-akaza-amarillo" />
                <div className="flex-1 overflow-hidden text-left">
                  <p className="text-sm font-bold truncate">{chat.title}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">
                    {chat.mode === "mesa" && chat.mesaId ? `Mesa ${chat.mesaId}` : "General"} · {chat.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* SIDEBAR MOBILE DRAWER */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-akaza-marron text-akaza-blanco transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-6 w-full">
          <Link href="/" className="flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <h1 className="text-2xl font-black leading-none mb-1">Akaza <span className="text-akaza-amarillo">Bot</span></h1>
          <button
            onClick={createNewGeneralSession}
            className="flex items-center gap-3 bg-akaza-amarillo/90 text-akaza-marron w-full p-3.5 rounded-2xl font-black text-xs my-6 uppercase transition-colors hover:bg-akaza-amarillo"
          >
            <Plus size={16} /> Nuevo Chat
          </button>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setCurrentSessionId(chat.id);
                  setIsSidebarOpen(false);
                }}
                className={`group w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all border text-left ${
                  currentSessionId === chat.id ? "border-akaza-amarillo/40 bg-white/5" : "border-transparent"
                }`}
              >
                <MessageSquare size={14} className="text-akaza-amarillo" />
                <div className="flex-1 overflow-hidden text-left">
                  <p className="text-sm font-bold truncate">{chat.title}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">
                    {chat.mode === "mesa" && chat.mesaId ? `Mesa ${chat.mesaId}` : "General"} · {chat.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}