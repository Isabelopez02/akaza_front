import Image from "next/image";
import { Lock, Mail, User, X, ShieldCheck } from "lucide-react";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-akaza-marron/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div className="relative bg-akaza-crema w-full max-w-sm sm:max-w-md md:max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-akaza-marron/10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto md:overflow-y-visible">
        
        {/* ── COLUMNA IZQUIERDA: BIENVENIDA E INFO ── */}
        <div className="bg-akaza-marron p-5 sm:p-6 text-left flex flex-col justify-between text-white relative">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white rounded-xl p-1 shadow-md flex items-center justify-center shrink-0">
                <Image src="/logo-akaza.png" alt="Logo Akaza" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-akaza-amarillo uppercase tracking-wider block">
                  Restaurante Akaza
                </span>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {isRegisterMode ? "Crear cuenta" : "Iniciar sesión"}
                </h2>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4">
              {isRegisterMode
                ? "Regístrate para acceder a nuestro menú exclusivo y realizar pedidos rápido."
                : "Accede a tu cuenta para continuar con tu experiencia gastronómica."}
            </p>
          </div>

          {!isRegisterMode && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white/90 space-y-2 mt-2">
              <div className="flex items-center gap-1.5 text-akaza-amarillo text-[11px] font-semibold">
                <ShieldCheck size={14} />
                <span>Credenciales de prueba</span>
              </div>
              <div className="space-y-1 text-[11px] text-white/75 pt-1 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span>Correo:</span>
                  <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-white select-all">
                    admin@akaza.com
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span>Contraseña:</span>
                  <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-white select-all">
                    admin123
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: FORMULARIO ── */}
        <div className="p-5 sm:p-6 flex flex-col justify-center relative bg-akaza-crema">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-akaza-marron/50 hover:text-akaza-marron hover:bg-akaza-marron/5 transition-all"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>

          <form className="space-y-3.5" onSubmit={onSubmit}>
            <div className="mb-1">
              <h3 className="text-base font-bold text-akaza-marron">
                {isRegisterMode ? "Registro de usuario" : "Bienvenido de nuevo"}
              </h3>
              <p className="text-[11px] text-akaza-marron/60">
                Ingresa tus datos para continuar
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg font-medium">
                {errorMessage}
              </div>
            )}
            
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-akaza-marron/80 block">
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
                    className="w-full bg-white border border-akaza-marron/15 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-akaza-marron/80 block">
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
                  className="w-full bg-white border border-akaza-marron/15 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-akaza-marron/80 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-akaza-marron/40" size={15} />
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-akaza-marron/15 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-akaza-marron focus:ring-1 focus:ring-akaza-marron/20 transition-all text-xs text-akaza-marron placeholder:text-akaza-marron/35"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-akaza-marron hover:bg-akaza-marron/90 text-white font-semibold py-2.5 rounded-lg transition-all text-xs mt-3 active:scale-[0.99] shadow-sm"
            >
              {isRegisterMode ? "Crear cuenta" : "Iniciar sesión"}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-[11px] font-medium text-akaza-marron/70 hover:text-akaza-marron transition-colors underline-offset-4 hover:underline"
              >
                {isRegisterMode
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

