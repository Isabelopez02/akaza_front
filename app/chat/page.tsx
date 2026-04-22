"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bot,
  Headphones,
  Menu,
  MessageSquare,
  Mic,
  Plus,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "../components/home/Navbar";

type ChatRole = "user" | "bot";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatSessionMode = "general" | "mesa";

type ChatSession = {
  id: string;
  title: string;
  date: string;
  mode: ChatSessionMode;
  mesaId: number | null;
  messages: ChatMessage[];
};

export default function ChatAkazaFinal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileName] = useState("Invitado");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("general-main");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoicePending, setIsVoicePending] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ============================================================
  // 🚩 PUNTO DE CONEXIÓN 1: CARGAR HISTORIAL (GET)
  // ============================================================
  useEffect(() => {
    if (isMounted) {
      const fetchHistory = async () => {
        try {
          /* CONEXIÓN PYTHON:
             const response = await fetch('http://tu-ip-python:8000/api/history');
             const data = await response.json();
             setChatHistory(data);
          */
          setChatHistory([
            {
              id: "general-main",
              title: "Chat General",
              date: "Hoy",
              mode: "general",
              mesaId: null,
              messages: [
                {
                  role: "bot",
                  content: "¡Bienvenido al centro de atención Akaza! Estoy listo para tomar tu pedido.",
                },
              ],
            },
            {
              id: "mesa-7",
              title: "Mesa 7 - Pedido",
              date: "Ayer",
              mode: "mesa",
              mesaId: 7,
              messages: [
                { role: "user", content: "Quiero un ceviche clásico y una limonada." },
                { role: "bot", content: "Perfecto, mesa 7. ¿Deseas agregar algo más?" },
              ],
            },
          ]);
        } catch (error) {
          console.error("Error al conectar con Python (History):", error);
        }
      };
      fetchHistory();
    }
  }, [isMounted]);

  const currentSession = chatHistory.find((session) => session.id === currentSessionId);
  const messages = currentSession?.messages ?? [];

  const updateCurrentSessionMessages = (nextMessages: ChatMessage[]) => {
    setChatHistory((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: nextMessages,
              date: "Ahora",
            }
          : session,
      ),
    );
  };

  // ============================================================
  // 🚩 PUNTO DE CONEXIÓN 2: ENVIAR MENSAJE (POST)
  // ============================================================
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentSession) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    updateCurrentSessionMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      /* CONEXIÓN PYTHON:
         const response = await fetch('http://tu-ip-python:8000/api/chat', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             message: input,
             session_id: currentSession.id,
             session_mode: currentSession.mode,
             mesa_id: currentSession.mesaId
           })
         });
         const data = await response.json();
         updateCurrentSessionMessages([
           ...messages,
           userMessage,
           { role: "bot", content: data.reply }
         ]);
      */

      // Simulación temporal
      setTimeout(() => {
        updateCurrentSessionMessages([
          ...messages,
          userMessage,
          { role: "bot", content: "Recibí tu pedido. El sistema de Akaza lo está procesando..." },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error al conectar con Python (Chat):", error);
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    // Aquí conectarás Web Speech API o grabación para enviar audio al backend.
    setIsVoicePending(true);
    setTimeout(() => setIsVoicePending(false), 800);
  };

  const createNewGeneralSession = () => {
    const newSession: ChatSession = {
      id: `general-${Date.now()}`,
      title: "Nuevo Chat General",
      date: "Ahora",
      mode: "general",
      mesaId: null,
      messages: [
        {
          role: "bot",
          content: "Hola, soy Akaza. Cuéntame tu consulta y te ayudo.",
        },
      ],
    };
    setChatHistory((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  if (!isMounted) return null;

  return (
    <div className="h-[100dvh] bg-akaza-crema overflow-hidden font-sans flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        isUserMenuOpen={isUserMenuOpen}
        profileName={profileName}
        onOpenLogin={() => {}}
        onOpenQr={() => {}}
        onToggleUserMenu={() => setIsUserMenuOpen((prev) => !prev)}
        onOpenProfile={() => {}}
        onOpenOrders={() => {}}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsUserMenuOpen(false);
        }}
        onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onScrollToSection={() => {}}
      />

      <div className="flex flex-1 min-h-0">
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

      {/* ÁREA DE CHAT */}
      <div className="flex-1 flex flex-col min-w-0 bg-akaza-crema relative h-full">
        <header className="bg-akaza-blanco/85 backdrop-blur-md border-b border-akaza-marron/5 z-40 px-4 md:px-8 py-3 md:py-4">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 text-akaza-marron bg-akaza-marron/5 rounded-xl flex items-center justify-center">
              <Menu size={20} />
            </button>
            <div className="flex flex-col items-start">
              <span className="font-black text-akaza-marron text-base md:text-lg uppercase">Asistente Akaza</span>
              <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase">En línea</span>
            </div>
            <div className="w-10 h-10 md:w-11 md:h-11 bg-akaza-amarillo/85 rounded-full flex items-center justify-center text-akaza-marron border border-akaza-blanco shadow-sm">
              <Headphones size={18} />
            </div>
          </div>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 md:pt-6 pb-40 md:pb-44">
          <div className="max-w-4xl mx-auto w-full space-y-6 md:space-y-8">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2.5 md:gap-3 max-w-[92%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-auto shadow-sm ${m.role === 'user' ? 'bg-akaza-amarillo' : 'bg-akaza-blanco border border-akaza-marron/5'}`}>
                    {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </div>
                  <div className={`p-4 md:p-5 rounded-[1.6rem] md:rounded-[2rem] shadow-sm text-sm md:text-base ${m.role === 'user' ? 'bg-akaza-marron text-akaza-blanco rounded-tr-none' : 'bg-akaza-blanco text-akaza-marron rounded-tl-none border border-akaza-marron/5'}`}>
                    <p className="font-medium leading-relaxed">{m.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="absolute bottom-4 md:bottom-6 left-0 right-0 px-4 md:px-8 bg-akaza-crema z-50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pedido aquí..."
              className="w-full bg-akaza-blanco shadow-xl rounded-[2.5rem] py-4 md:py-5 pl-5 md:pl-8 pr-32 md:pr-36 outline-none text-akaza-marron font-medium text-sm md:text-base border border-akaza-marron/10"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              aria-label="Grabar nota de voz"
              className={`absolute right-[58px] md:right-[72px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-[1.1rem] md:rounded-[1.3rem] flex items-center justify-center shadow-lg transition-all ${
                isVoicePending
                  ? "bg-akaza-amarillo text-akaza-marron scale-95"
                  : "bg-akaza-amarillo/90 text-akaza-marron hover:bg-akaza-amarillo"
              }`}
            >
              <Mic size={18} />
            </button>
            <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-akaza-marron text-akaza-blanco w-10 h-10 md:w-12 md:h-12 rounded-[1.1rem] md:rounded-[1.3rem] flex items-center justify-center shadow-lg">
              <Send size={18} />
            </button>
          </form>
        </footer>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[55] md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      </div>
    </div>
  );
}