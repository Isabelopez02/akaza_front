import Image from "next/image";
import { MessageCircle, Send, X } from "lucide-react";

type ChatWidgetProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function ChatWidget({ isOpen, onToggle, onClose }: ChatWidgetProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div className="absolute bottom-[85px] right-0 w-[350px] md:w-[400px] h-[calc(100vh-180px)] max-h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-akaza-marron/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-akaza-marron p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl p-1.5 rotate-3 shadow-inner">
                <Image src="/logo-akaza.png" alt="Bot" width={40} height={40} />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Asistente Akaza</p>
                <p className="text-[10px] font-bold text-akaza-amarillo uppercase tracking-widest">
                  En línea
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-6 bg-akaza-crema/10 overflow-y-auto space-y-4">
            <div className="flex flex-col gap-1 max-w-[90%]">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-akaza-marron shadow-sm border border-akaza-marron/5 font-medium leading-relaxed">
                ¡Hola! Soy tu guía inteligente. ¿En qué puedo ayudarte hoy?
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-akaza-marron/5 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Escribe aquí..."
              className="flex-1 bg-zinc-50 rounded-2xl px-5 py-3.5 text-sm outline-none border border-zinc-100 focus:ring-2 focus:ring-akaza-amarillo/50 transition-all font-medium"
            />
            <button className="bg-akaza-amarillo p-3.5 rounded-2xl text-akaza-marron shadow-md hover:scale-105 transition-all active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="bg-akaza-marron text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white active:scale-90"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
