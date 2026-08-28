"use client";

import {
  MessageCircle,
  Facebook,
  Instagram,
  Phone,
  MapPin,
  Mail,
  Clock,
  Navigation,
} from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Footer Principal Estilo Dark Map & Floating Contact Card */}
      <footer className="bg-[#121212] text-white py-12 px-4 sm:px-6 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* ── 1. BANNER MAPA OSCURO DE FONDO CON TARJETA BLANCA FLOTANTE A LA DERECHA ── */}
          <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A] border border-white/10 shadow-2xl p-6 sm:p-10 min-h-[420px] flex flex-col justify-between">
            
            {/* Mapa de Google Maps Oscuro de Fondo */}
            <div className="absolute inset-0 z-0 opacity-40 hover:opacity-50 transition-opacity duration-300">
              <iframe
                title="Mapa de Ubicación Akaza"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.8973634125867!2d-76.97232!3d-12.05055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6f37691885b%3A0xb71e164f9b8c067d!2sSanta%20Anita%2C%20Lima!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
                className="w-full h-full border-0 filter invert contrast-125 saturate-0"
                loading="lazy"
              />
            </div>

            {/* Contenido Grid (Título Izquierda / Tarjeta Flotante Derecha) */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              
              {/* LADO IZQUIERDO: TÍTULO EN BLANCO + VER EN MAPS */}
              <div className="lg:col-span-6 text-left space-y-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-akaza-amarillo uppercase tracking-widest hover:underline"
                >
                  <span>ver en google maps</span>
                  <span>——</span>
                  <Navigation size={12} />
                </a>

                <h2 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight uppercase drop-shadow-md">
                  Contáctanos
                </h2>

                <p className="text-xs sm:text-sm text-white/70 font-medium max-w-sm leading-relaxed">
                  Estamos ubicados en Santa Anita. Visítanos o comunícate directamente con nosotros para reservar tu mesa.
                </p>
              </div>

              {/* LADO DERECHO: TARJETA BLANCA FLOTANTE SUPERPUESTA CON INFORMACIÓN DE CONTACTO */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <div className="bg-white text-black rounded-2xl p-6 sm:p-7 shadow-2xl border border-gray-100 max-w-md w-full space-y-5 text-left transform transition-transform duration-300 hover:scale-[1.01]">
                  
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-black tracking-tight">
                      Información de Contacto
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
                      Comunícate con nuestro equipo para reservas y consultas.
                    </p>
                  </div>

                  {/* Lista de Puntos de Contacto con Insignias Circulares */}
                  <div className="space-y-4 pt-1">
                    
                    {/* 1. Hotline / Teléfono */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-akaza-marron text-akaza-amarillo flex items-center justify-center shrink-0 shadow-sm font-bold">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-black block leading-none">
                          Hotline
                        </span>
                        <a href="tel:+51986310588" className="text-xs font-semibold text-gray-700 hover:text-akaza-marron transition-colors mt-1 block">
                          +51 986 310 588
                        </a>
                      </div>
                    </div>

                    {/* 2. Nuestra Ubicación */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-akaza-amarillo text-akaza-marron flex items-center justify-center shrink-0 shadow-sm font-bold">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-black block leading-none">
                          Nuestra Ubicación
                        </span>
                        <p className="text-xs font-semibold text-gray-700 mt-1">
                          Av. Los Eucaliptos 142, Santa Anita - Lima
                        </p>
                      </div>
                    </div>

                    {/* 3. Correo Oficial */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-akaza-marron text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-black block leading-none">
                          Correo Oficial
                        </span>
                        <a href="mailto:contacto@akaza.com" className="text-xs font-semibold text-gray-700 hover:text-akaza-marron transition-colors mt-1 block">
                          contacto@akaza.com
                        </a>
                      </div>
                    </div>

                    {/* 4. Horarios & Estacionamiento */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                        <Clock size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-black block leading-none">
                          Horarios & Cochera
                        </span>
                        <p className="text-xs font-semibold text-gray-700 mt-1">
                          Mar a Dom: 11:00 am - 5:00 pm • Estacionamiento Privado
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* ── 2. BARRA INFERIOR DEL FOOTER CON DIRECCIÓN, CONTACTOS Y REDES SOCIALES ── */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-left">
            
            {/* Nuestra Dirección */}
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-mono text-akaza-amarillo uppercase tracking-wider block font-bold">
                Nuestra Dirección
              </span>
              <p className="text-white/80 font-medium">
                Av. Los Eucaliptos 142, Santa Anita – Lima, Perú
              </p>
            </div>

            {/* Nuestros Contactos */}
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-mono text-akaza-amarillo uppercase tracking-wider block font-bold">
                Nuestros Contactos
              </span>
              <p className="text-white/80 font-medium">
                contacto@akaza.com • +51 986 310 588
              </p>
            </div>

            {/* Refrán Marino */}
            <div className="text-center italic text-akaza-amarillo font-serif font-medium">
              "Camarón que se duerme, acaba en nuestro ceviche"
            </div>

            {/* Redes Sociales (- follow us) */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest hidden sm:inline">
                — follow us
              </span>
              <div className="flex gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-akaza-amarillo hover:text-akaza-marron text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook Akaza"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-akaza-amarillo hover:text-akaza-marron text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram Akaza"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://wa.me/51986310588"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-500 hover:text-white text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp Akaza"
                >
                  <MessageCircle size={15} />
                </a>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="text-center pt-2 border-t border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
              Santa Anita, Lima • Akaza Experience 2026
            </p>
          </div>

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
