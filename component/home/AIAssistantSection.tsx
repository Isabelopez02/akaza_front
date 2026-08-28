"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export function AIAssistantSection() {
  const router = useRouter();

  return (
    <section className="bg-white py-16 sm:py-20 w-full border-b border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* ── COLUMNA IZQUIERDA: TEXTO FIEL A LA FOTO COMPARTIDA ── */}
          <div className="lg:col-span-6 text-center space-y-4 max-w-lg mx-auto">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-black tracking-tight mb-1">
                ¿No sabes qué elegir?
              </h3>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
                Preguntale a nuestro asistente
              </h2>
              <div className="w-28 sm:w-36 h-[2.5px] bg-black mx-auto mt-3 rounded-full" />
            </div>

            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed max-w-md mx-auto pt-2">
              Nuestro asistente integrado conoce cada detalle de nuestras recetas y está listo para darte recomendaciones personalizadas. Solo dile qué se te antoja hoy y deja que la inteligencia artificial te guíe hacia el sabor perfecto del mar.
            </p>

            <div className="pt-4">
              <button
                onClick={() => router.push("/chat")}
                className="bg-black hover:bg-akaza-marron text-white font-serif text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full shadow-md transition-all flex items-center gap-2 mx-auto active:scale-95"
              >
                <MessageSquare size={16} className="text-akaza-amarillo" />
                Pregúntame por Chat
              </button>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: ENVOLVENTE CIRCULAR DEL ROBOT FIEL A LA FOTO ── */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-gray-200 bg-[#FAF8F5] p-6 shadow-xl flex items-center justify-center overflow-hidden group">
              {/* Fondo circular tenue */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white to-gray-100 rounded-full" />

              {/* Contenedor de las dos figuras de Robot Referenciales */}
              <div className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                {/* Robot Principal con pantalla "PREGÚNTAME" y Mandil */}
                <div className="w-200 sm:w-60 h-48 sm:h-60 relative drop-shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <img
                    src="/akaza_robot2.png"
                    alt="Robot Bistro Asistente Pregúntame"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>

                {/* Chef Robot Secundario */}
                <div className="w-20 sm:w-28 h-20 sm:h-28 relative -ml-6 -mt-10 drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <img
                    src="/akaza_robot1.png"
                    alt="Chef Robot"
                    className="w-full h-full object-contain rounded-full border-2 border-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
