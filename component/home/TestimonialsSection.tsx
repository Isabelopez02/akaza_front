"use client";

import { Star, CheckCircle2, MapPin, Clock, Car, Navigation, Phone } from "lucide-react";

export function TestimonialsSection() {
  const comentarios = [
    {
      id: 1,
      nombre: "Carlos Rivas",
      comentario: "Pedí por el chat desde mi mesa y en 10 minutos el ceviche estaba listo. ¡Increíble!",
      rating: 5,
      inicial: "CR",
      platoProbado: "Ceviche Akaza",
    },
    {
      id: 2,
      nombre: "Isabel López",
      comentario: "El asistente filtró mis alergias al instante. Comí súper segura y delicioso.",
      rating: 5,
      inicial: "IL",
      platoProbado: "Lomo Saltado",
    },
    {
      id: 3,
      nombre: "María F. Díaz",
      comentario: "Sazón criolla perfecta y atención digital rapidísima. Totalmente recomendado.",
      rating: 5,
      inicial: "MD",
      platoProbado: "Arroz Marino",
    },
  ];

  return (
    <section id="faq" className="bg-white py-12 sm:py-16 border-b border-gray-100 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ── 1. BANNER CON FONDO MARRÓN: "NUESTROS CLIENTES RECOMIENDAN" ── */}
        <div className="bg-akaza-marron text-white rounded-2xl py-4 sm:py-5 px-6 text-center shadow-md mb-8">
          <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-widest text-white">
            NUESTROS CLIENTES RECOMIENDAN
          </h2>
          <div className="w-20 sm:w-28 h-[2px] bg-akaza-amarillo mx-auto mt-2 rounded-full" />
        </div>

        {/* ── 2. CARDS DE CLIENTES CON ESTRELLAS AMARILLAS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {comentarios.map((com) => (
            <div
              key={com.id}
              className="bg-akaza-crema/40 border border-akaza-marron/15 rounded-xl p-4 flex flex-col justify-between hover:border-akaza-marron/40 transition-all duration-200 shadow-xs"
            >
              <div>
                {/* Estrellas Color Amarillo */}
                <div className="flex gap-1 mb-2">
                  {[...Array(com.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-akaza-amarillo text-akaza-amarillo" />
                  ))}
                </div>
                <p className="text-xs text-gray-800 font-medium leading-relaxed italic">
                  "{com.comentario}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-akaza-marron/10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-akaza-marron text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                    {com.inicial}
                  </div>
                  <h4 className="font-serif font-bold text-black text-[11px] flex items-center gap-1">
                    {com.nombre}
                    <CheckCircle2 size={10} className="text-akaza-marron shrink-0" />
                  </h4>
                </div>

                <span className="text-[9px] font-semibold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {com.platoProbado}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 3. SECCIÓN DE UBICACIÓN Y HORARIOS (2 COLUMNAS) ── */}
        <div className="bg-akaza-crema/20 border border-akaza-marron/15 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="font-serif text-[10px] font-bold text-akaza-marron/60 uppercase tracking-wider block">
              Visítanos en nuestro local
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-black tracking-tight">
              Ubicación y Horarios
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* LADO IZQUIERDO: INFORMACIÓN */}
            <div className="space-y-5 text-left">
              {/* Dirección */}
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-akaza-marron/10 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-akaza-marron text-akaza-amarillo flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-black uppercase tracking-wide">
                    Dirección
                  </h4>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed mt-0.5">
                    Av. Los Eucaliptos 142, Santa Anita – Lima, Perú
                  </p>
                </div>
              </div>

              {/* Horario de atención */}
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-akaza-marron/10 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-akaza-marron text-akaza-amarillo flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-black uppercase tracking-wide">
                    Horario de atención
                  </h4>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed mt-0.5">
                    Martes a Domingo de 11:00 am a 5:00 pm.
                  </p>
                </div>
              </div>

              {/* Estacionamiento */}
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-akaza-marron/10 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-akaza-marron text-akaza-amarillo flex items-center justify-center shrink-0 mt-0.5">
                  <Car size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-black uppercase tracking-wide">
                    Estacionamiento
                  </h4>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed mt-0.5">
                    Estacionamiento privado y seguro disponible para nuestros comensales.
                  </p>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: VISUAL (GOOGLE MAPS CON CÓMO LLEGAR) */}
            <div className="bg-white rounded-xl border border-akaza-marron/20 overflow-hidden shadow-sm flex flex-col h-full min-h-[300px]">
              <div className="p-3 bg-akaza-marron text-white flex items-center justify-between">
                <span className="font-serif text-xs font-bold">Mapa de Ubicación</span>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-akaza-amarillo text-akaza-marron px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-white transition-colors"
                >
                  <Navigation size={12} /> Cómo llegar
                </a>
              </div>

              <div className="relative w-full flex-1 min-h-[240px] bg-gray-100">
                <iframe
                  title="Mapa de Ubicación Restaurante Akaza"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.8973634125867!2d-76.97232!3d-12.05055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6f37691885b%3A0xb71e164f9b8c067d!2sSanta%20Anita%2C%20Lima!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-2.5 bg-akaza-crema text-center text-[11px] font-medium text-akaza-marron">
                <Phone size={11} className="inline mr-1 text-akaza-marron" /> Consultas y Reservas: +51 986 310 588
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
