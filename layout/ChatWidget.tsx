"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send, X, Sparkles, Fish, ShieldAlert } from "lucide-react";

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(true);

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
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      
      {/* ── GLOBO INFORMATIVO INICIAL DE LA IA ── */}
      {showTooltip && !isOpen && (
        <div className="bg-white border border-akaza-marron/5 shadow-xl rounded-2xl px-4 py-2.5 mb-3 text-[10px] font-black text-akaza-marron flex items-center gap-2 select-none animate-bounce relative shrink-0">
          <span>🤖</span> ¿Tienes hambre? ¡Pregúntame!
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-akaza-marron/40 hover:text-akaza-marron transition-colors"
          >
            <X size={10} />
          </button>
          {/* Triangulito de la burbuja */}
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-akaza-marron/5 transform rotate-45"></div>
        </div>
      )}

      {/* ── GLOBO DE DIÁLOGO PRE-CHAT (POPOVER) ── */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md border border-akaza-marron/5 shadow-2xl rounded-3xl p-5 w-80 text-left mb-4 flex flex-col space-y-4 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header del Asistente */}
          <div className="flex items-center justify-between pb-3 border-b border-akaza-marron/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-akaza-marron text-akaza-amarillo rounded-full flex items-center justify-center shadow-md">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-akaza-marron leading-tight flex items-center gap-1">
                  Akaza Asistente <span className="text-[10px]">🐚</span>
                </h4>
                <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-ping"></span> Activo hoy
                </span>
              </div>
            </div>
            
            {/* Cerrar Popover */}
            <button 
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg bg-gray-50 border border-akaza-marron/5 flex items-center justify-center text-akaza-marron/60 hover:text-akaza-marron transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* Opciones Rápidas */}
          <div className="space-y-2">
            <span className="text-[8px] font-black text-akaza-marron/40 uppercase tracking-wider block mb-1">
              Consultas sugeridas
            </span>
            
            <button
              onClick={() => handleSendPrompt("¿Qué me recomiendas hoy? 🐟")}
              className="w-full text-left bg-[#FAF8F5] hover:bg-akaza-marron hover:text-white border border-akaza-marron/5 rounded-xl px-3 py-2.5 text-[10px] font-bold text-akaza-marron flex items-center gap-2 transition-all active:scale-98"
            >
              <Fish size={12} className="shrink-0" />
              <span>¿Qué me recomiendas hoy?</span>
            </button>

            <button
              onClick={() => handleSendPrompt("¿Tienen opciones sin picante? 🌶️")}
              className="w-full text-left bg-[#FAF8F5] hover:bg-akaza-marron hover:text-white border border-akaza-marron/5 rounded-xl px-3 py-2.5 text-[10px] font-bold text-akaza-marron flex items-center gap-2 transition-all active:scale-98"
            >
              <ShieldAlert size={12} className="shrink-0" />
              <span>¿Tienen opciones sin picante?</span>
            </button>

            <button
              onClick={() => handleSendPrompt("Quiero ver los combos marinos 🍱")}
              className="w-full text-left bg-[#FAF8F5] hover:bg-akaza-marron hover:text-white border border-akaza-marron/5 rounded-xl px-3 py-2.5 text-[10px] font-bold text-akaza-marron flex items-center gap-2 transition-all active:scale-98"
            >
              <Sparkles size={12} className="shrink-0" />
              <span>Quiero ver los combos marinos</span>
            </button>
          </div>

          {/* Mini Formulario de Entrada */}
          <div className="pt-2 border-t border-akaza-marron/5 flex gap-2">
            <input
              type="text"
              placeholder="Pregúntale a la IA aquí..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-[#FAF8F5] border border-akaza-marron/5 rounded-xl px-3.5 py-2 text-[10px] font-bold text-akaza-marron placeholder-akaza-marron/30 focus:outline-none focus:border-akaza-marron transition-colors"
            />
            <button
              onClick={() => handleSendPrompt(inputValue)}
              className="w-8 h-8 bg-akaza-marron text-white rounded-xl flex items-center justify-center shadow-md hover:bg-akaza-amarillo hover:text-akaza-marron transition-colors shrink-0 active:scale-95"
            >
              <Send size={11} />
            </button>
          </div>

        </div>
      )}

      {/* ── BOTÓN CIRCULAR PRINCIPAL (BOTÓN IA) ── */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          setShowTooltip(false);
        }}
        aria-label="Hablar con el Asistente de IA"
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white ${
          isOpen ? "bg-akaza-amarillo text-akaza-marron" : "bg-akaza-marron text-white hover:bg-akaza-marron/95"
        }`}
      >
        <Bot size={28} className={isOpen ? "rotate-12 transition-transform duration-300" : ""} />
      </button>

    </div>
  );
}
