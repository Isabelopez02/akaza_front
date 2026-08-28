"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Mail, User, X, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react";
import { AuthForm } from "@/types";

type AuthModalProps = {
  isOpen: boolean;
  isRegisterMode: boolean;
  authForm: AuthForm;
  errorMessage?: string;
  onClose: () => void;
  onToggleMode: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof AuthForm, value: string) => void;
};

export function AuthModal({
  isOpen,
  isRegisterMode,
  authForm,
  errorMessage,
  onClose,
  onToggleMode,
  onSubmit,
  onChange,
}: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);

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
        
        {/* ── COLUMNA IZQUIERDA: FONDO MARINO Y BIENVENIDA A AKAZA (5 COLS) ── */}
        <div className="md:col-span-5 relative p-6 text-left flex flex-col justify-between text-white overflow-hidden min-h-[260px] md:min-h-[420px]">
          {/* Imagen Marina de Fondo del Header con Overlay Oscuro */}
          <div className="absolute inset-0 z-0">
            <img
              src="/plato3.jpg"
              alt="Fondo Marino Akaza"
              className="w-full h-full object-cover object-center brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-akaza-marron/80 backdrop-brightness-75" />
          </div>

          {/* Contenido Texto sobre el Fondo */}
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
              Bienvenido de nuevo a Akaza
            </h2>

            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Inicia sesión para pedir tus favoritos y chatear con nuestro asistente.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-akaza-amarillo px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                <Sparkles size={12} />
                Sabor & Inteligencia
              </span>
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA: FORMULARIO Y DEMO DE CUENTA DE PRUEBA (7 COLS) ── */}
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between relative bg-akaza-crema">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-akaza-marron/50 hover:text-akaza-marron hover:bg-akaza-marron/10 transition-all"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <h3 className="font-serif text-lg font-bold text-akaza-marron">
                {isRegisterMode ? "Crear cuenta nueva" : "Iniciar sesión"}
              </h3>
              <p className="text-[11px] text-akaza-marron/70">
                {isRegisterMode
                  ? "Ingresa tus datos para registrarte"
                  : "Ingresa tus credenciales para continuar"}
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg font-medium">
                {errorMessage}
              </div>
            )}
            
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-akaza-marron/80 block">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-akaza-marron/40" size={15} />
                  <input
                    type="text"
                    required
                    value={authForm.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="María Fernanda Díaz"
                    className="w-full bg-white border border-akaza-marron/20 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-akaza-marron/80 block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-akaza-marron/40" size={15} />
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-white border border-akaza-marron/20 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-akaza-marron/80 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-akaza-marron/40" size={15} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={authForm.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-akaza-marron/20 rounded-lg py-2.5 pl-9 pr-9 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35"
                />
                {/* Botón de Ojito para Mostrar/Ocultar Contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-akaza-marron/40 hover:text-akaza-marron transition-colors p-1"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all active:scale-[0.99] shadow-sm"
            >
              {isRegisterMode ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          </form>

          {/* ── CUENTA DE PRUEBA INTEGRADA CON ESTILO HOME ── */}
          {!isRegisterMode && (
            <div className="mt-4 pt-3 border-t border-akaza-marron/15 text-left bg-white/70 rounded-xl p-3.5 border border-akaza-marron/10">
              <div className="flex items-center gap-1.5 text-akaza-marron font-serif text-xs font-bold mb-1">
                <ShieldCheck size={14} className="text-akaza-marron" />
                <span>¿Explorando la plataforma?</span>
              </div>
              <p className="text-[11px] text-akaza-marron/70 font-medium mb-2">
                Accede rápidamente con nuestra cuenta de prueba:
              </p>
              <div className="space-y-1 text-[11px] text-akaza-marron bg-akaza-crema p-2 rounded-lg border border-akaza-marron/10 font-mono">
                <div className="flex items-center justify-between">
                  <span>📧 Correo:</span>
                  <code className="font-bold select-all">admin@akaza.com</code>
                </div>
                <div className="flex items-center justify-between">
                  <span>🔑 Contraseña:</span>
                  <code className="font-bold select-all">admin123</code>
                </div>
              </div>
            </div>
          )}

          <div className="text-center pt-3">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-[11px] font-bold text-akaza-marron/80 hover:text-black transition-colors underline-offset-4 hover:underline"
            >
              {isRegisterMode
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
