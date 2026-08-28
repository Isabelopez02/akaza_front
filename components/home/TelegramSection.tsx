"use client";

import { Send, MessageSquare } from "lucide-react";

export function TelegramSection() {
  const telegramBotUrl = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || "https://t.me/akazita_bot";

  return (
    <section className="bg-akaza-crema/40 py-16 sm:py-20 w-full border-b border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* ── COLUMNA IZQUIERDA: TEXTO ESTRUCTURA IDÉNTICA A ASISTENTE IA ── */}
          <div className="lg:col-span-6 text-center space-y-4 max-w-lg mx-auto">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-black tracking-tight mb-1">
                ¿Prefieres tu app de mensajería?
              </h3>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
                Conversa por Telegram
              </h2>
              <div className="w-28 sm:w-36 h-[2.5px] bg-black mx-auto mt-3 rounded-full" />
            </div>

            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed max-w-md mx-auto pt-2">
              Conéctate directamente con nuestro Bot de Inteligencia Artificial en Telegram. Consulta recomendaciones marinas, ingredientes y la carta del día sin salir de tu chat.
            </p>

            <div className="pt-4">
              <a
                href={telegramBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-akaza-marron text-white font-serif text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full shadow-md transition-all inline-flex items-center gap-2 mx-auto active:scale-95"
              >
                <Send size={15} className="text-akaza-amarillo" />
                Iniciar Chat en Telegram
              </a>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: TARJETA MOCKUP COMPACTA SOBRIA ── */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xl space-y-4 font-sans text-xs">
              
              {/* Header Mockup Bot */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-black text-akaza-amarillo flex items-center justify-center font-bold shadow-sm">
                  <Send size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-black flex items-center gap-1.5 font-serif">
                    Akaza Bot IA
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-gray-500">@akazita_bot • Telegram API</div>
                </div>
              </div>

              {/* Globos de Mensaje */}
              <div className="space-y-3 pt-1">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] leading-normal">
                  ¡Hola! 🌊 Bienvenido a <b>Akaza</b>. ¿Qué se te antoja probar hoy de nuestra pesca del día?
                </div>

                <div className="bg-black text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-right leading-normal">
                  ¿Tienen opciones suaves sin mucho ají?
                </div>

                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] leading-normal">
                  Te recomiendo un delicioso <b>Lomo del Huerto</b> o una <b>Causa Girasol</b>. ¡Son riquísimos y de picor suave! 🐟
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
