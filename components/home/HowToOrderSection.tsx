"use client";

import { MapPin, Anchor, Scroll, Trophy } from "lucide-react";

export function HowToOrderSection() {
  const estaciones = [
    {
      estacion: "Estación 01",
      titulo: "Escanea la Mesa",
      descripcion: "Usa el QR de tu mesa para iniciar la ruta del pedido.",
      icon: MapPin,
    },
    {
      estacion: "Estación 02",
      titulo: "Asistente Capitán",
      descripcion: "Chatea con Akaza Bot para consultar y armar tu orden.",
      icon: Anchor,
    },
    {
      estacion: "Estación 03",
      titulo: "Pergamino a Cocina",
      descripcion: "Tu ticket viaja en 1 segundo a la pantalla del chef.",
      icon: Scroll,
    },
    {
      estacion: "Estación 04",
      titulo: "El Tesoro Servido",
      descripcion: "Disfruta tus manjares calientes en tu mesa.",
      icon: Trophy,
    },
  ];

  return (
    <section className="bg-akaza-crema/50 py-14 sm:py-16 border-b border-akaza-marron/10 w-full relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        
        {/* Encabezado Mapa del Tesoro en Merriweather */}
        <div className="mb-14 flex flex-col items-center">
          <span className="font-serif text-[11px] font-bold text-akaza-marron/60 uppercase tracking-[0.25em] block mb-1">
            Ruta del Tesoro Gastronómico
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-widest text-black">
            ¿Cómo realizar tu pedido?
          </h2>
          <div className="w-28 sm:w-36 h-[2.5px] bg-black mt-2 rounded-full" />
        </div>

        {/* Línea Punteada Conectora (Treasure Path) */}
        <div className="relative max-w-4xl mx-auto">
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-[2px] border-t-2 border-dashed border-akaza-marron/30 -translate-y-8 z-0" />

          {/* 4 Estaciones del Mapa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {estaciones.map((est, idx) => {
              const Icon = est.icon;
              return (
                <div
                  key={est.estacion}
                  className="group bg-white border border-akaza-marron/15 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Hito de la Estación */}
                  <div className="w-12 h-12 rounded-full bg-akaza-marron text-akaza-amarillo flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider text-akaza-marron/50 block mb-1 font-mono">
                    {est.estacion}
                  </span>

                  <h3 className="font-serif text-xs font-bold text-black mb-1">
                    {est.titulo}
                  </h3>

                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                    {est.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
