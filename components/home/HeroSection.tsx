"use client";

type HeroSectionProps = {
  onDownloadMenu: () => void;
};

export function HeroSection({ onDownloadMenu }: HeroSectionProps) {
  return (
    <section className="relative w-full bg-black text-white min-h-[520px] md:min-h-[580px] flex items-center justify-center overflow-hidden">
      {/* Imagen marina de fondo completo con overlay oscuro */}
      <div className="absolute inset-0 z-0">
        <img
          src="/header.jpg"
          alt="Mariscos Akaza"
          className="w-full h-full object-cover object-center brightness-[0.45] contrast-105"
        />
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-100" />
      </div>

      {/* Contenido Centralizado Sobrio y Minimalista */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-12 text-center space-y-6 flex flex-col items-center">
        
        {/* Marca Superior decorada: —— AKAZA —— */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xs">
          <div className="h-[1.5px] bg-white/70 flex-1" />
          <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white drop-shadow">
            AKAZA
          </span>
          <div className="h-[1.5px] bg-white/70 flex-1" />
        </div>

        {/* Encabezado Principal Sobrio en Merriweather */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-wide max-w-2xl uppercase drop-shadow-md">
          SIENTE LA BRIZA DEL MAR EN CADA BOCADO
        </h1>

        {/* Botón Centralizado Rectangular DESCARGAR PDF */}
        <div className="pt-2">
          <button
            onClick={onDownloadMenu}
            className="border border-white/80 bg-black/30 hover:bg-white hover:text-black text-white font-serif text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-2 rounded-sm transition-all duration-300 shadow-md active:scale-95"
          >
            DESCARGAR MENÚ DE HOY
          </button>
        </div>

      </div>
    </section>
  );
}
