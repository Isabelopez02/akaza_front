"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CategoriesSection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const categorias = [
    {
      id: "ceviches",
      nombre: "Ceviches & Marinos",
      descripcion: "Pesca fresca del día con limón norteño",
      image: "/plato1.jpg",
    },
    {
      id: "platos-fuertes",
      nombre: "Platos Fuertes",
      descripcion: "Especialidades calientes al wok",
      image: "/plato2.jpg",
    },
    {
      id: "combos",
      nombre: "Combos & Dúos",
      descripcion: "Paquetes marinos para compartir",
      image: "/plato3.jpg",
    },
    {
      id: "bebidas",
      nombre: "Bebidas Artesanales",
      descripcion: "Chicha morada helada y limonadas",
      image: "/plato1.jpg",
    },
    {
      id: "postres",
      nombre: "Postres Peruanos",
      descripcion: "Mazamorra morada y dulces criollos",
      image: "/plato2.jpg",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white py-12 sm:py-14 w-full border-b border-gray-100 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Encabezado y Controles del Carrusel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="font-serif text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Explora nuestra carta
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-widest text-black">
              NUESTRAS CATEGORIAS
            </h2>
          </div>

          {/* Flechas de Navegación del Carrusel */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all shadow-xs active:scale-95"
              aria-label="Anterior categoría"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all shadow-xs active:scale-95"
              aria-label="Siguiente categoría"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carrusel Desplazable Horizontalmente con Imágenes */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categorias.map((cat) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/chat?category=${encodeURIComponent(cat.nombre)}`)}
              className="snap-start shrink-0 w-[240px] sm:w-[270px] group cursor-pointer relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Contenedor de Imagen de Referencia */}
              <div className="h-52 sm:h-60 relative w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.nombre}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Texto sobre la Imagen */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-base font-bold leading-tight group-hover:text-akaza-amarillo transition-colors">
                    {cat.nombre}
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium leading-tight mt-1">
                    {cat.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
