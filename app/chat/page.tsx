"use client";
import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, ArrowLeft, Menu, Plus, MessageSquare, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatAkazaFinal() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([
    { role: "bot", content: "¡Bienvenido al centro de atención Akaza! Estoy listo para tomar tu pedido." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

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
            { id: 1, title: "Reserva de Ceviche", date: "Hoy" },
            { id: 2, title: "Consulta Horarios", date: "Ayer" }
          ]);
        } catch (error) {
          console.error("Error al conectar con Python (History):", error);
        }
      };
      fetchHistory();
    }
  }, [isMounted]);

  // ============================================================
  // 🚩 PUNTO DE CONEXIÓN 2: ENVIAR MENSAJE (POST)
  // ============================================================
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      /* CONEXIÓN PYTHON:
         const response = await fetch('http://tu-ip-python:8000/api/chat', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: input, user: 'Nayely' })
         });
         const data = await response.json();
         setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
      */
      
      // Simulación temporal
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", content: "Recibí tu pedido. El sistema de Akaza lo está procesando..." }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Error al conectar con Python (Chat):", error);
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-[100dvh] bg-akaza-crema overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-akaza-marron text-white transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 lg:w-80 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-8">
          <Link href="/" className="flex items-center gap-2 mb-10 opacity-60 hover:opacity-100 transition-opacity font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <h1 className="text-3xl font-black leading-none mb-1">Akaza <span className="text-akaza-amarillo">Bot</span></h1>
          <button className="flex items-center gap-3 bg-akaza-amarillo text-akaza-marron w-full p-4 rounded-2xl font-black text-xs my-8 shadow-lg uppercase">
            <Plus size={18} /> Nuevo Chat
          </button>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatHistory.map((chat: any) => (
              <div key={chat.id} className="group flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 cursor-pointer transition-all border border-transparent">
                <MessageSquare size={14} className="text-akaza-amarillo" />
                <div className="flex-1 overflow-hidden text-left">
                  <p className="text-sm font-bold truncate">{chat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ÁREA DE CHAT */}
      <div className="flex-1 flex flex-col min-w-0 bg-akaza-crema relative h-full">
        <header className="flex items-center justify-between p-4 md:p-6 bg-white/80 backdrop-blur-md border-b border-akaza-marron/5 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 text-akaza-marron bg-akaza-marron/5 rounded-2xl"><Menu size={20} /></button>
          <div className="flex flex-col items-center lg:items-start">
            <span className="font-black text-akaza-marron text-sm uppercase">Asistente Akaza</span>
            <span className="text-[9px] font-bold text-green-500 uppercase">En línea</span>
          </div>
          <div className="w-10 h-10 bg-akaza-amarillo rounded-full flex items-center justify-center text-akaza-marron font-black text-xs border-2 border-white shadow-sm">NY</div>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8 pb-32">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[88%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-auto shadow-sm ${m.role === 'user' ? 'bg-akaza-amarillo' : 'bg-white border border-akaza-marron/5'}`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-5 rounded-[2rem] shadow-sm text-sm ${m.role === 'user' ? 'bg-akaza-marron text-white rounded-tr-none' : 'bg-white text-akaza-marron rounded-tl-none border border-akaza-marron/5'}`}>
                  <p className="font-medium">{m.content}</p>
                </div>
              </div>
            </div>
          ))}
        </main>

        <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-akaza-crema via-akaza-crema/90 to-transparent z-50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pedido aquí..."
              className="w-full bg-white shadow-xl rounded-[2.5rem] py-5 pl-8 pr-20 outline-none text-akaza-marron font-medium text-sm md:text-base"
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 bottom-2 bg-akaza-marron text-white w-14 rounded-[1.8rem] flex items-center justify-center shadow-lg">
              <Send size={18} />
            </button>
          </form>
        </footer>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}