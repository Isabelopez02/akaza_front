"use client";

import { MapPin, Compass, Sparkles } from "lucide-react";

export function TreasureTransitionSection() {
  return (
    <section className="bg-akaza-crema/40 py-6 sm:py-8 border-b border-akaza-marron/10 w-full relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Trazo del Mapa del Tesoro con Línea Punteada */}
        <div className="relative flex items-center justify-between gap-4 py-2">
          <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-akaza-marron/30 z-0 hidden sm:block" />

          {/* Marcador Izquierda */}
          <div className="relative z-10 bg-white border border-akaza-marron/20 rounded-full px-3 py-1 text-[10px] font-bold font-serif text-akaza-marron flex items-center gap-1.5 shadow-sm">
            <Compass size={13} className="text-akaza-marron" />
            <span>Inicio de la Ruta</span>
          </div>

          {/* Bloque Central Garfield & Tesoro */}
          <div className="relative z-10 bg-akaza-marron text-white rounded-2xl p-3 sm:p-4 border border-akaza-marron/30 shadow-md flex items-center gap-3.5 max-w-md mx-auto">
            {/* Imagen/Mascota de Garfield */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-akaza-amarillo border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&auto=format&fit=crop&q=80"
                alt="Garfield Mascota del Tesoro"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="text-left space-y-0.5">
              <span className="text-[9px] font-bold text-akaza-amarillo uppercase tracking-wider block flex items-center gap-1">
                <Sparkles size={10} /> Garfield en Busca del Tesoro
              </span>
              <h4 className="font-serif text-xs font-bold text-white leading-tight">
                ¡Sigue la huella marina hacia los mejores sabores!
              </h4>
              <p className="text-[10px] text-white/80 leading-normal">
                El mapa te guía directo a nuestros platillos estrella.
              </p>
            </div>
          </div>

          {/* Marcador Derecha */}
          <div className="relative z-10 bg-white border border-akaza-marron/20 rounded-full px-3 py-1 text-[10px] font-bold font-serif text-akaza-marron flex items-center gap-1.5 shadow-sm hidden sm:flex">
            <MapPin size={13} className="text-akaza-marron" />
            <span>Sabor Auténtico</span>
          </div>
        </div>

      </div>
    </section>
  );
}
