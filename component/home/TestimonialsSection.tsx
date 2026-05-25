"use client";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const comentarios = [
    {
      nombre: "Carlos Rivas",
      rol: "Cliente VIP",
      comentario: "Excelente experiencia. Escaneé el código QR de mi mesa, pedí un ceviche clásico por chat y en 10 minutos estaba listo. Muy eficiente.",
      rating: 5,
      inicial: "C",
      avatarBg: "bg-red-50 text-red-700",
    },
    {
      nombre: "Isabel López",
      rol: "Comensal Frecuente",
      comentario: "Me encanta la validación de alergias del chatbot. Indicó al instante qué platos eran seguros para mí. Muy atenta la IA.",
      rating: 5,
      inicial: "I",
      avatarBg: "bg-akaza-marron text-white",
    },
    {
      nombre: "María F. Díaz",
      rol: "Cliente Casual",
      comentario: "El lomo fino al wok estuvo extraordinario. Pagar con Yape desde el mismo chat del ticket ahorra mucho tiempo en mesa.",
      rating: 5,
      inicial: "M",
      avatarBg: "bg-akaza-amarillo/20 text-akaza-marron",
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-20 w-full border-t border-akaza-marron/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabecera Minimalista */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-akaza-marron/40 uppercase tracking-[3px]">
            Opiniones
          </span>
          <h2 className="text-akaza-marron text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Clientes Satisfechos
          </h2>
        </div>

        {/* Rejilla de Reseñas Ultra-Limpia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comentarios.map((com, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-akaza-marron/5 p-6 flex flex-col justify-between hover:border-akaza-amarillo transition-all duration-300 shadow-sm"
            >
              <div className="space-y-3">
                {/* Calificación Minimalista */}
                <div className="flex gap-0.5">
                  {Array(com.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} size={11} className="fill-akaza-amarillo text-akaza-amarillo" />
                    ))}
                </div>

                <p className="text-xs font-medium text-akaza-marron/70 leading-relaxed italic">
                  "{com.comentario}"
                </p>
              </div>

              {/* Autor Minimalista */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-akaza-marron/5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${com.avatarBg}`}>
                  {com.inicial}
                </div>
                <div>
                  <h4 className="text-xs font-black text-akaza-marron leading-none mb-1">
                    {com.nombre}
                  </h4>
                  <span className="text-[9px] font-bold text-akaza-marron/35 uppercase tracking-wider">
                    {com.rol}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
