"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send, X, Sparkles, Fish, ShieldAlert, MessageCircle } from "lucide-react";

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSendPrompt = (prompt: string) => {
    if (!prompt.trim()) return;
    router.push(`/chat?prompt=${encodeURIComponent(prompt.trim())}`);
    setIsOpen(false);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendPrompt(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 items-end">
      
      {/* ── POPOVER DE ACCESO RÁPIDO A LA IA (SI ESTÁ ABIERTO) ── */}
      {isOpen && (
        <div className="bg-white text-black border border-akaza-marron/15 shadow-2xl rounded-2xl p-4 w-76 text-left mb-1 flex flex-col space-y-3 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-akaza-marron text-akaza-amarillo rounded-full flex items-center justify-center shadow-xs">
                <Bot size={16} />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-akaza-marron leading-tight">
                  Asistente Akaza
                </h4>
                <span className="text-[9px] font-mono text-green-600 font-bold block">
                  En línea
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-black p-1 rounded-md transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Consultas Sugeridas */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">
              Consultas rápidas
            </span>

            <button
              onClick={() => handleSendPrompt("¿Qué me recomiendas hoy? 🐟")}
              className="w-full text-left bg-akaza-crema/50 hover:bg-akaza-marron hover:text-white rounded-lg px-2.5 py-1.5 text-xs font-medium text-akaza-marron flex items-center gap-2 transition-colors"
            >
              <Fish size={13} className="shrink-0" />
              <span>¿Qué me recomiendas hoy?</span>
            </button>

            <button
              onClick={() => handleSendPrompt("¿Tienen opciones sin picante? 🌶️")}
              className="w-full text-left bg-akaza-crema/50 hover:bg-akaza-marron hover:text-white rounded-lg px-2.5 py-1.5 text-xs font-medium text-akaza-marron flex items-center gap-2 transition-colors"
            >
              <ShieldAlert size={13} className="shrink-0" />
              <span>¿Opciones sin picante?</span>
            </button>

            <button
              onClick={() => handleSendPrompt("Quiero ver los combos marinos 🍱")}
              className="w-full text-left bg-akaza-crema/50 hover:bg-akaza-marron hover:text-white rounded-lg px-2.5 py-1.5 text-xs font-medium text-akaza-marron flex items-center gap-2 transition-colors"
            >
              <Sparkles size={13} className="shrink-0" />
              <span>Combos y ofertas marinos</span>
            </button>
          </div>

          {/* Mini Input */}
          <div className="pt-2 border-t border-gray-100 flex gap-1.5">
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-black focus:outline-none focus:border-akaza-marron transition-colors"
            />
            <button
              onClick={() => handleSendPrompt(inputValue)}
              className="bg-akaza-marron text-white rounded-lg px-2.5 flex items-center justify-center shadow-xs hover:bg-black transition-colors shrink-0"
            >
              <Send size={13} />
            </button>
          </div>

        </div>
      )}

      {/* ── BOTÓN FLOTANTE SUPERIOR: ¿TIENES HAMBRE? PREGÚNTAME (ASISTENTE IA) ── */}
      <button
        onClick={() => router.push("/chat")}
        className="bg-akaza-marron hover:bg-black text-akaza-amarillo px-4 py-3 rounded-full shadow-2xl border border-akaza-amarillo/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 group active:scale-95"
        aria-label="¿Tienes hambre? Pregúntame"
      >
        <Bot size={20} className="text-akaza-amarillo animate-pulse" />
        <span className="text-xs font-bold text-white whitespace-nowrap">
          Preguntame
        </span>
      </button>

      {/* ── BOTÓN FLOTANTE INFERIOR: WHATSAPP DIRECTO ── */}
      <a
        href="https://wa.me/51986310588"
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={18} className="fill-current text-white" />
      </a>

    </div>
  );
}
