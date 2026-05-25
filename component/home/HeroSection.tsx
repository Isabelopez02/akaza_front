import { ChevronRight, FileText, Anchor } from "lucide-react";

type HeroSectionProps = {
  onDownloadMenu: () => void;
};

export function HeroSection({ onDownloadMenu }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-[#F3EFE9] to-akaza-crema/10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-24 overflow-hidden border-b border-akaza-marron/5">
      {/* Elemento de fondo decorativo marino (Ancla/Olas tenue) */}
      <div className="absolute -top-10 -right-10 text-akaza-marron/[0.02] transform rotate-12 pointer-events-none">
        <Anchor size={250} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6">
        {/* Badge Gourmet */}
        <span className="inline-flex items-center gap-1.5 bg-white border border-akaza-marron/5 text-akaza-marron/60 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-sm">
          <span>🐚</span> Cocina Marina & Tradición Peruana
        </span>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-akaza-marron leading-tight tracking-tight max-w-3xl">
          Sabor que <span className="text-akaza-amarillo font-extrabold italic">conecta</span> con lo auténtico
        </h1>

        {/* Subtítulo */}
        <p className="max-w-xl text-sm md:text-base text-akaza-marron/60 font-medium leading-relaxed">
          Disfruta de la mejor pesca fresca y la sazón criolla tradicional en Santa Anita, fusionada con una experiencia digital única.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
          <a
            href="https://wa.me/51986310588"
            target="_blank"
            className="bg-akaza-marron text-white hover:bg-akaza-amarillo hover:text-akaza-marron px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-akaza-amarillo/20 transition-all flex items-center gap-1.5 justify-center active:scale-95"
          >
            Reservar Mesa <ChevronRight size={16} />
          </a>
          <button
            onClick={onDownloadMenu}
            className="bg-white hover:bg-gray-50 text-akaza-marron border border-akaza-marron/10 px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 justify-center active:scale-95"
          >
            <FileText size={16} />
            Descargar Carta (PDF)
          </button>
        </div>
      </div>
    </section>
  );
}
