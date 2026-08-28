"use client";

import Image from "next/image";
import { User, Mail, ShieldAlert, Utensils, Save, X, Sparkles } from "lucide-react";
import { ProfileData } from "@/types";

type ProfileModalProps = {
  isOpen: boolean;
  profileData: ProfileData;
  onClose: () => void;
  onChange: (field: keyof ProfileData, value: string) => void;
  onSave?: () => void;
};

export function ProfileModal({
  isOpen,
  profileData,
  onClose,
  onChange,
  onSave,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Tarjeta Modal Principal */}
      <div className="relative bg-akaza-crema w-full max-w-sm sm:max-w-md md:max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-akaza-marron/15 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto md:overflow-y-visible">
        
        {/* ── COLUMNA IZQUIERDA: FONDO MARINO Y TÍTULO MERRIWEATHER (5 COLS) ── */}
        <div className="md:col-span-5 relative p-6 text-left flex flex-col justify-between text-white overflow-hidden min-h-[220px] md:min-h-[460px]">
          {/* Imagen Marina de Fondo con Overlay Dark */}
          <div className="absolute inset-0 z-0">
            <img
              src="/plato3.jpg"
              alt="Fondo Marino Akaza"
              className="w-full h-full object-cover object-center brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-akaza-marron/85 backdrop-brightness-75" />
          </div>

          {/* Texto en Merriweather sobre el Fondo */}
          <div className="relative z-10 space-y-4 my-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-md flex items-center justify-center shrink-0">
                <Image src="/logo-akaza.png" alt="Logo Akaza" width={24} height={24} className="object-contain" />
              </div>
              <span className="font-serif text-lg font-black tracking-widest uppercase text-white drop-shadow">
                AKAZA
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">
              Configuración de Perfil
            </h2>

            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Personaliza tus datos, preferencias gastronómicas y alergias para que la inteligencia artificial te recomiende platillos a tu medida.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-akaza-amarillo px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <Sparkles size={12} />
                Sabor & Inteligencia
              </span>
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA: FORMULARIO DE CONFIGURACIÓN RESPONSIVO (7 COLS) ── */}
        <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between relative bg-akaza-crema">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-akaza-marron/50 hover:text-akaza-marron hover:bg-akaza-marron/10 transition-all"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>

          <form
            className="space-y-3.5 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              onSave?.();
            }}
          >
            <div>
              <h3 className="font-serif text-lg font-bold text-akaza-marron">
                Preferencias & Datos
              </h3>
              <p className="text-[11px] text-akaza-marron/70">
                Mantén actualizada tu información personal
              </p>
            </div>

            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-akaza-marron/80 block">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-akaza-marron/40" size={15} />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full bg-white border border-akaza-marron/20 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron font-medium"
                />
              </div>
            </div>

            {/* Correo Electrónico (Solo Lectura) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-akaza-marron/80 block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-akaza-marron/40" size={15} />
                <input
                  type="email"
                  readOnly
                  value={profileData.email}
                  className="w-full bg-gray-100/70 border border-akaza-marron/10 rounded-lg py-2.5 pl-9 pr-3 outline-none text-xs text-akaza-marron/60 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Alergias Alimentarias */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-akaza-marron/80 block">
                Alergias Alimentarias
              </label>
              <div className="relative">
                <ShieldAlert className="absolute left-3 top-3 text-akaza-marron/40" size={15} />
                <textarea
                  value={profileData.allergies}
                  onChange={(e) => onChange("allergies", e.target.value)}
                  rows={2}
                  placeholder="ej. Mariscos crudos, maní, picante extremo..."
                  className="w-full bg-white border border-akaza-marron/20 rounded-lg py-2 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35 resize-none font-medium"
                />
              </div>
            </div>

            {/* Preferencias Gastronómicas */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-akaza-marron/80 block">
                Preferencias Gastronómicas
              </label>
              <div className="relative">
                <Utensils className="absolute left-3 top-3 text-akaza-marron/40" size={15} />
                <textarea
                  value={profileData.preferences}
                  onChange={(e) => onChange("preferences", e.target.value)}
                  rows={2}
                  placeholder="ej. Término medio, poco limón, bajo en sal..."
                  className="w-full bg-white border border-akaza-marron/20 rounded-lg py-2 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35 resize-none font-medium"
                />
              </div>
            </div>

            {/* Botón Guardar Cambios */}
            <button
              type="submit"
              className="w-full bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <Save size={15} />
              <span>Guardar Cambios</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
