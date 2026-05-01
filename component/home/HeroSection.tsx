import { ChevronRight } from "lucide-react";

type HeroSectionProps = {
  onDownloadMenu: () => void;
};

export function HeroSection({ onDownloadMenu }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 md:py-40">
      <h1 className="text-6xl md:text-8xl font-black text-akaza-marron mb-8 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
        Sabor que <span className="text-akaza-amarillo">inspira</span>,<br />
        conexiones reales.
      </h1>
      <p className="max-w-2xl text-lg text-akaza-marron/60 font-medium mb-12">
        Tradición peruana con un toque moderno en Santa Anita.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="https://wa.me/51986310588"
          target="_blank"
          className="bg-akaza-marron text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-2 justify-center"
        >
          Reservar ahora <ChevronRight size={20} />
        </a>
        <button
          onClick={onDownloadMenu}
          className="bg-white text-akaza-marron border border-akaza-marron/10 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
        >
          Descargar Menú (PDF)
        </button>
      </div>
    </section>
  );
}
