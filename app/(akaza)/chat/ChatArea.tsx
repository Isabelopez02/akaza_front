"use client";

import { useEffect, useRef } from "react";
import { Bot, Menu, Mic, Send, User, ArrowLeft, QrCode, Sparkles } from "lucide-react";
import Link from "next/link";

type ChatRole = "user" | "bot";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ParsedChunk =
  | { type: "text"; value: string }
  | { type: "dish"; name: string; price: string; imageUrl: string };

interface ChatAreaProps {
  messages: ChatMessage[];
  handleSend: (e: React.FormEvent) => void;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleVoiceInput: () => void;
  isVoicePending: boolean;
  nroMesa: number | null;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenQr?: () => void;
}

export function ChatArea({
  messages,
  handleSend,
  input,
  setInput,
  isLoading,
  handleVoiceInput,
  isVoicePending,
  nroMesa,
  setIsSidebarOpen,
  onOpenQr,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseMessageContent = (content: string): ParsedChunk[] => {
    const regex = /\|\|([^|]+)\|\|/g;
    const chunks: ParsedChunk[] = [];
    let lastIndex = 0;
    let match = regex.exec(content);

    while (match) {
      if (match.index > lastIndex) {
        chunks.push({ type: "text", value: content.slice(lastIndex, match.index) });
      }

      const rawDish = match[1].trim();
      const splitDish = rawDish.split(" - ");
      const name = splitDish[0]?.trim() || "Plato sugerido";
      const price = splitDish.slice(1).join(" - ").trim() || "Precio por confirmar";
      const imageUrl = splitDish[2]?.trim() || "null";
      chunks.push({ type: "dish", name, price, imageUrl });

      lastIndex = regex.lastIndex;
      match = regex.exec(content);
    }

    if (lastIndex < content.length) {
      chunks.push({ type: "text", value: content.slice(lastIndex) });
    }

    return chunks.length ? chunks : [{ type: "text", value: content }];
  };

  const sugerenciasRapidas = [
    "Recomiéndame un ceviche",
    "Ver platos de hoy",
    "Combos y promociones",
    "Bebidas frías",
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-akaza-crema/60 h-full overflow-hidden">
      
      {/* ── HEADER DEL ÁREA DE CHAT ── */}
      <header className="bg-[#24130C] text-white shadow-md z-40 px-4 md:px-6 py-3 shrink-0 border-b border-white/10">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-9 h-9 text-white bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
              aria-label="Abrir menú"
            >
              <Menu size={18} />
            </button>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm md:text-base font-bold uppercase tracking-wider text-white">
                  ASISTENTE AKAZA
                </span>
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  En línea {nroMesa ? `· Mesa ${nroMesa}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* ACCIONES DEL HEADER: REGRESAR A LA PÁGINA Y ESCANEAR QR */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/15 shadow-xs"
            >
              <ArrowLeft size={14} className="text-akaza-amarillo" />
              <span className="hidden sm:inline">Regresar a la página</span>
            </Link>

            {onOpenQr && (
              <button
                onClick={onOpenQr}
                className="bg-akaza-amarillo text-akaza-marron hover:bg-white px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 shadow-sm uppercase tracking-wider"
              >
                <QrCode size={14} />
                <span className="hidden sm:inline">Escanear QR</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ── ÁREA DE MENSAJES DE CONVERSACIÓN ── */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 md:pt-6 pb-4 space-y-6">
        <div className="max-w-4xl mx-auto w-full space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[92%] md:max-w-[78%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-auto shadow-sm ${
                    m.role === "user"
                      ? "bg-akaza-amarillo text-akaza-marron font-bold"
                      : "bg-akaza-marron text-white"
                  }`}
                >
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`p-4 md:p-5 rounded-2xl shadow-sm text-xs sm:text-sm ${
                    m.role === "user"
                      ? "bg-akaza-marron text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-akaza-marron/15"
                  }`}
                >
                  <div className="font-medium leading-relaxed space-y-3">
                    {parseMessageContent(m.content).map((chunk, idx) =>
                      chunk.type === "text" ? (
                        <p key={`${idx}-${chunk.value.slice(0, 8)}`}>{chunk.value}</p>
                      ) : (
                        <div
                          key={`${idx}-${chunk.name}`}
                          className="bg-akaza-crema border border-akaza-marron/20 rounded-xl p-3.5 shadow-sm mt-2"
                        >
                          {chunk.imageUrl !== "null" && (
                            <img
                              src={chunk.imageUrl}
                              alt={chunk.name}
                              className="w-full h-32 object-cover rounded-lg mb-2.5 shadow-sm border border-akaza-marron/10"
                            />
                          )}
                          <p className="font-serif text-sm font-bold text-akaza-marron">
                            {chunk.name}
                          </p>
                          <p className="text-xs text-akaza-marron/70 font-semibold mt-0.5">
                            {chunk.price}
                          </p>
                          <button
                            type="button"
                            onClick={() => setInput(`Quiero pedir ${chunk.name}`)}
                            className="mt-2.5 bg-akaza-marron hover:bg-black text-white text-xs font-serif font-bold uppercase px-4 py-2 rounded-lg transition-colors shadow-xs"
                          >
                            Pedir ahora
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── FOOTER DE ENTRADA Y SUGERENCIAS RÁPIDAS (RESEÑADO) ── */}
      <footer className="flex-shrink-0 px-4 md:px-8 py-3 bg-akaza-crema/80 border-t border-akaza-marron/15 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto space-y-2.5">
          
          {/* Sugerencias Rápidas de Pedido */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {sugerenciasRapidas.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => setInput(sug)}
                className="bg-white hover:bg-akaza-marron hover:text-white border border-akaza-marron/20 text-akaza-marron text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
              >
                <Sparkles size={11} className="text-akaza-amarillo shrink-0" />
                <span>{sug}</span>
              </button>
            ))}
          </div>

          {/* Formulario de Entrada de Texto Mejorado */}
          <form onSubmit={handleSend} className="bg-white border border-akaza-marron/25 shadow-lg rounded-2xl p-1.5 flex items-center gap-2">
            
            <div className="pl-3 text-akaza-marron/40 shrink-0">
              <Sparkles size={16} />
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pedido o pregunta al asistente de Akaza..."
              enterKeyHint="send"
              className="flex-1 bg-transparent py-2 text-xs sm:text-sm text-black font-medium outline-none placeholder:text-gray-400"
            />

            <div className="flex items-center gap-1.5 pr-1 shrink-0">
              {/* Botón de Nota de Voz */}
              <button
                type="button"
                onClick={handleVoiceInput}
                aria-label="Grabar nota de voz"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isVoicePending
                    ? "bg-akaza-amarillo text-akaza-marron animate-pulse shadow-md"
                    : "bg-akaza-crema hover:bg-akaza-amarillo text-akaza-marron"
                }`}
                title="Nota de voz"
              >
                <Mic size={17} />
              </button>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-akaza-marron hover:bg-black text-white w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shadow-sm active:scale-95"
                title="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </div>

          </form>

        </div>
      </footer>

    </div>
  );
}