"use client";

import { Star, CheckCircle2 } from "lucide-react";

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
    <section id="faq" className="bg-white py-14 sm:py-16 border-b border-gray-100 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* ── SECCIÓN TESTIMONIOS CENTRADA (50% TEXTO ESTILO IA / 50% CARDS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-center">
          
          {/* MITAD IZQUIERDA: ENCABEZADO CENTRADO CON ESTILO IA */}
          <div className="md:col-span-5 text-center md:text-left space-y-3">
            <div>
              <span className="font-serif text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Opiniones & Experiencias
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-black leading-tight tracking-tight mt-1">
                Nuestros clientes recomiendan
              </h2>
              <div className="w-24 sm:w-32 h-[2.5px] bg-black mt-2.5 rounded-full mx-auto md:mx-0" />
            </div>

            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed pt-1">
              Conoce la experiencia real de quienes ya disfrutaron de nuestra sazón marina artesanal y la comodidad del asistente virtual en mesa.
            </p>

            <div className="inline-flex items-center gap-2 bg-akaza-crema border border-akaza-marron/15 px-3 py-1.5 rounded-lg text-xs font-bold text-akaza-marron mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-akaza-amarillo text-akaza-amarillo" />
                ))}
              </div>
              <span>4.9 / 5.0 (+350 reseñas)</span>
            </div>
          </div>

          {/* MITAD DERECHA: TARJETAS DE OPINIONES CON ESTRELLAS AMARILLAS */}
          <div className="md:col-span-7 space-y-3">
            {comentarios.map((com) => (
              <div
                key={com.id}
                className="bg-akaza-crema/40 border border-akaza-marron/15 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between hover:border-black/30 transition-all duration-200 shadow-xs"
              >
                <div>
                  <div className="flex gap-1 mb-1.5">
                    {[...Array(com.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-akaza-amarillo text-akaza-amarillo" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed italic">
                    "{com.comentario}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-akaza-marron/10 text-xs">
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

        </div>

      </div>
    </section>
  );
}
