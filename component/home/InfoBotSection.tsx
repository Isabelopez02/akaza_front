"use client";

import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export function InfoBotSection() {
  const router = useRouter();

  return (
    <section className="bg-white py-12 sm:py-14 w-full border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        {/* Encabezado Centrado en Merriweather */}
        <div className="mb-10 flex flex-col items-center">
          <h2 className="font-serif text-base sm:text-lg font-bold uppercase tracking-widest text-black">
            SABOR PERUANO AUTENTICO
          </h2>
          <div className="w-28 sm:w-36 h-[2px] bg-black mt-1.5 rounded-full" />
        </div>

        {/* Grilla Asimétrica con Imagen Principal Más Delgada + Imagen del Robot Bajo el Asistente */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch max-w-4xl mx-auto text-left">
          
          {/* Columna 1 (Izquierda): 2 Imágenes Rectangulares con Titulares */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <div className="relative h-40 sm:h-44 rounded-xl overflow-hidden shadow-xs border border-gray-100 group">
              <img
                src="/plato1.jpg"
                alt="Ceviche Tradicional"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 right-2.5 font-serif text-[11px] font-bold text-white tracking-wide">
                Ceviche Tradicional
              </span>
            </div>

            <div className="relative h-40 sm:h-44 rounded-xl overflow-hidden shadow-xs border border-gray-100 group">
              <img
                src="/plato2.jpg"
                alt="Lomo Saltado al Wok"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 right-2.5 font-serif text-[11px] font-bold text-white tracking-wide">
                Lomo Saltado al Wok
              </span>
            </div>
          </div>

          {/* Columna 2 (Centro): 1 Imagen Alta Estilizada y Más Delgada */}
          <div className="md:col-span-3">
            <div className="relative h-full min-h-[330px] sm:min-h-[360px] rounded-xl overflow-hidden shadow-xs border border-gray-100 group">
              <img
                src="/plato3.jpg"
                alt="Arroz con Mariscos Akaza"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[9px] font-bold text-akaza-amarillo uppercase tracking-wider block mb-0.5">
                  Especialidad
                </span>
                <span className="font-serif text-xs font-bold block leading-snug">
                  Arroz con Mariscos
                </span>
              </div>
            </div>
          </div>

          {/* Columna 3 (Derecha): Asistente Virtual Texto + Imagen de ROBOT Debajo */}
          <div className="md:col-span-5 flex flex-col justify-between gap-3.5">
            {/* Bloque Informativo del Asistente Virtual */}
            <div className="bg-akaza-crema/60 border border-akaza-marron/15 rounded-xl p-4 text-center md:text-left flex flex-col justify-center space-y-1.5">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-akaza-marron">
                <Sparkles size={11} className="text-akaza-marron" />
                <span>Novedad Integrada</span>
              </div>
              <h3 className="font-serif text-sm font-bold text-black leading-snug">
                Asistente Virtual Integrado
              </h3>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Ahora tu mesa incluye un asistente virtual con IA que te asesora en la carta, filtra alérgenos y toma tu pedido al instante.
              </p>
              <button
                onClick={() => router.push("/chat")}
                className="pt-1 text-[11px] font-bold text-akaza-marron hover:underline flex items-center gap-1 justify-center md:justify-start"
              >
                Chatear con el Bot <ArrowRight size={12} />
              </button>
            </div>

            {/* Imagen del Robot Asistente justo DEBAJO del Asistente Virtual */}
            <div className="relative h-40 sm:h-44 rounded-xl overflow-hidden shadow-xs border border-akaza-marron/15 bg-gradient-to-br from-akaza-marron/90 to-black p-3 flex items-center justify-between group cursor-pointer" onClick={() => router.push("/chat")}>
              <div className="space-y-1 text-white text-left z-10 pl-2">
                <div className="w-7 h-7 rounded-lg bg-akaza-amarillo text-akaza-marron flex items-center justify-center font-bold">
                  <Bot size={18} />
                </div>
                <h4 className="font-serif text-xs font-bold text-white">
                  Robot Akaza AI
                </h4>
                <p className="text-[10px] text-white/80 font-medium">
                  Listo para ayudarte en mesa
                </p>
              </div>

              {/* Imagen Ilustrativa del Robot */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 relative z-10 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=80"
                  alt="Robot Asistente Inteligente"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
