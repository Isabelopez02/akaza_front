"use client";

import { MessageCircle, Facebook, Instagram, Phone } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Footer Principal */}
      <footer className="bg-akaza-marron text-white py-12 px-6 border-t border-white/10 text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Marca en Merriweather */}
          <div>
            <span className="font-serif text-2xl font-black uppercase tracking-widest text-white">
              AKAZA
            </span>
            <p className="text-xs text-white/70 mt-1 font-medium">
              Cocina Marina & Tradición Peruana en Santa Anita
            </p>
          </div>

          {/* Refrán Pequeño Marino */}
          <div className="max-w-md mx-auto py-2 border-y border-white/10">
            <p className="font-serif text-xs italic text-akaza-amarillo font-medium">
              "Camarón que se duerme, acaba en nuestro ceviche"
            </p>
          </div>

          {/* Redes Sociales */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-akaza-amarillo hover:text-akaza-marron text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="Facebook Akaza"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-akaza-amarillo hover:text-akaza-marron text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="Instagram Akaza"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://wa.me/51986310588"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-green-500 hover:text-white text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="WhatsApp Akaza"
            >
              <MessageCircle size={18} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] pt-4">
            Santa Anita, Lima • Akaza Experience 2026
          </p>

        </div>
      </footer>

      {/* Botón Flotante de WhatsApp */}
      <a
        href="https://wa.me/51986310588"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} className="fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
          Pedir por WhatsApp
        </span>
      </a>
    </>
  );
}
