"use client";
import { useRouter } from "next/navigation";
import { Fish, Flame, Compass, CupSoda, Cake } from "lucide-react";

export function CategoriesSection() {
  const router = useRouter();
  const categorias = [
    {
      nombre: "Ceviches",
      descripcion: "Pesca del día con limón norteño.",
      icon: Fish,
    },
    {
      nombre: "Platos Fuertes",
      descripcion: "Especialidades calientes al wok.",
      icon: Flame,
    },
    {
      nombre: "Combos",
      descripcion: "Paquetes marinos para compartir.",
      icon: Compass,
    },
    {
      nombre: "Bebidas",
      descripcion: "Chicha morada y limonadas caseras.",
      icon: CupSoda,
    },
    {
      nombre: "Postres",
      descripcion: "Mazamorra y dulces tradicionales.",
      icon: Cake,
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-16 border-y border-akaza-marron/5 w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabecera Minimalista */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-akaza-marron/40 uppercase tracking-[3px]">
            Explora la Carta
          </span>
          <h2 className="text-akaza-marron text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Categorías
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categorias.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => router.push(`/chat?category=${encodeURIComponent(cat.nombre)}`)}
                className="group bg-white hover:bg-akaza-marron border border-akaza-marron/5 rounded-2xl p-5 transition-all duration-300 flex flex-col items-center text-center cursor-pointer active:scale-98"
              >
                {/* Icono Minimalista */}
                <div className="w-10 h-10 bg-akaza-crema/20 rounded-xl flex items-center justify-center text-akaza-marron group-hover:bg-white/10 group-hover:text-white transition-all duration-300 mb-4">
                  <Icon size={20} />
                </div>

                <h3 className="text-xs font-black text-akaza-marron group-hover:text-white tracking-tight mb-1">
                  {cat.nombre}
                </h3>
                <p className="text-[10px] font-medium text-akaza-marron/40 group-hover:text-white/60 leading-normal">
                  {cat.descripcion}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
