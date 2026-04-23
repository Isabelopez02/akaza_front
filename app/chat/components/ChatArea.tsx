"use client";
import { useRef } from "react";
import { Bot, Headphones, Menu, Mic, Send, User } from "lucide-react";

type ChatRole = "user" | "bot";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ParsedChunk =
  | { type: "text"; value: string }
  | { type: "dish"; name: string; price: string; imageUrl:string };

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
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-akaza-crema relative h-full">
      <header className="bg-akaza-blanco/85 backdrop-blur-md border-b border-akaza-marron/5 z-40 px-4 md:px-8 py-3 md:py-4">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 text-akaza-marron bg-akaza-marron/5 rounded-xl flex items-center justify-center">
            <Menu size={20} />
          </button>
          <div className="flex flex-col items-start">
            <span className="font-black text-akaza-marron text-base md:text-lg uppercase">Asistente Akaza</span>
            <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase">
              En línea {nroMesa ? `· Mesa ${nroMesa}` : ""}
            </span>
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
                  <div className="font-medium leading-relaxed space-y-3">
                    {parseMessageContent(m.content).map((chunk, idx) =>
                      chunk.type === "text" ? (
                        <p key={`${idx}-${chunk.value.slice(0, 8)}`}>{chunk.value}</p>
                      ) : (
                        <div
                          key={`${idx}-${chunk.name}`}
                          className="bg-akaza-crema border border-akaza-marron/10 rounded-2xl p-3 md:p-4 shadow-sm"
                        >
                          {chunk.imageUrl !== "null" && (
                            <img 
                              src={chunk.imageUrl} 
                              alt={chunk.name} 
                              className="w-full h-28 md:h-32 object-cover rounded-xl mb-3 shadow-sm border border-akaza-marron/5"
                            />
                          )}
                          <p className="text-sm md:text-base font-black text-akaza-marron">
                            {chunk.name}
                          </p>
                          <p className="text-xs md:text-sm text-akaza-marron/70 font-semibold mt-1">
                            {chunk.price}
                          </p>
                          <button
                            type="button"
                            onClick={() => setInput(`Quiero pedir ${chunk.name}`)}
                            className="mt-3 bg-akaza-marron text-akaza-blanco text-xs md:text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                          >
                            Pedir
                          </button>
                        </div>
                      ),
                    )}
                  </div>
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
  );
}