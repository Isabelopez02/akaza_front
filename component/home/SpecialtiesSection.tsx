"use client";
import Image from "next/image";
import { Dish } from "@/types";
import { MessageSquare, Heart } from "lucide-react";

type SpecialtiesSectionProps = {
  dishes: Dish[];
  onOrderViaChat: (dishName: string) => void;
};

export function SpecialtiesSection({
  dishes,
  onOrderViaChat,
}: SpecialtiesSectionProps) {
  // Tomar exactamente los 3 mejores platos recomendados
  const top3Dishes = dishes.slice(0, 3);

  return (
    <section id="joyas" className="max-w-7xl mx-auto px-6 py-20 w-full bg-white">
      
      {/* Cabecera Gourmet */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-black text-akaza-marron/40 uppercase tracking-[4px]">
          Joyas de la Mesa
        </span>
        <h2 className="text-akaza-marron text-3xl sm:text-4xl font-black tracking-tight mt-1.5 mb-3 italic">
          Nuestras Joyas Marinas
        </h2>
        <div className="w-16 h-0.5 bg-akaza-amarillo mx-auto"></div>
      </div>

      {/* Grilla Premium de 3 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {top3Dishes.map((item) => (
          <div
            key={item.n}
            className="group bg-[#FAF8F5] rounded-3xl border border-akaza-marron/5 overflow-hidden transition-all duration-500 hover:border-akaza-amarillo hover:shadow-xl flex flex-col justify-between"
          >
            {/* Contenedor de Imagen */}
            <div className="relative h-60 w-full overflow-hidden bg-akaza-crema/10">
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-akaza-marron/5 text-akaza-marron text-[9px] font-black uppercase px-2.5 py-1 rounded-full z-20 flex items-center gap-1 shadow-sm">
                <Heart size={10} className="fill-red-500 text-red-500" /> Preferido
              </div>
              <Image
                src={item.img}
                alt={item.n}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Detalles */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-lg font-black text-akaza-marron tracking-tight truncate">
                    {item.n}
                  </h3>
                  <span className="text-base font-black text-akaza-marron shrink-0">
                    {item.p}
                  </span>
                </div>
                
                <p className="text-xs font-medium text-akaza-marron/50 leading-relaxed">
                  {item.d}
                </p>
              </div>

              <button
                onClick={() => onOrderViaChat(item.n)}
                className="w-full py-3 mt-4 rounded-xl bg-akaza-marron hover:bg-akaza-amarillo hover:text-akaza-marron text-white font-bold text-[10px] transition-all uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <MessageSquare size={13} />
                Pedir por el Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
