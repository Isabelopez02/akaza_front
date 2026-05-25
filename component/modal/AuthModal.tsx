import Image from "next/image";
import { Lock, Mail, User, X, Shield } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-akaza-marron/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-akaza-crema w-full max-w-lg md:max-w-3xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_100px_rgba(61,28,2,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 border border-akaza-marron/5 grid grid-cols-1 md:grid-cols-2 max-h-[92vh] md:max-h-[85vh] overflow-y-auto md:overflow-y-visible">
        
        {/* ── COLUMNA IZQUIERDA: BIENVENIDA E INFO DEL PROYECTO ── */}
        <div className="bg-akaza-marron p-6 sm:p-10 text-center md:text-left flex flex-col justify-center text-white border-b md:border-b-0 md:border-r border-white/5 relative">
          <div className="w-16 h-16 bg-white rounded-full mx-auto md:mx-0 mb-4 p-1.5 shadow-xl flex items-center justify-center">
            <Image src="/logo-akaza.png" alt="Logo" width={50} height={50} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 leading-none">
            {isRegisterMode ? "Crea tu cuenta" : "¡Bienvenido!"}
          </h2>
          <p className="text-akaza-amarillo text-xs font-bold uppercase tracking-widest mb-6">
            {isRegisterMode ? "Registro Akaza" : "Acceso Akaza"}
          </p>

          {!isRegisterMode && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-xs text-white/95 text-left space-y-2.5 shadow-sm">
              <p className="font-bold flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest text-akaza-amarillo">
                <span>💡</span> Info del Proyecto
              </p>
              <p className="font-medium leading-relaxed text-white/80">
                Restaurante Akaza es un proyecto piloto para el uso de chatbot con Inteligencia Artificial.
              </p>
              <div className="pt-2 border-t border-white/10 text-[9px] sm:text-[10px] font-bold space-y-1">
                <p className="text-akaza-amarillo uppercase tracking-wider">Credenciales de Admin:</p>
                <p className="text-white/70 font-medium">Correo: <code className="bg-white/10 px-1 py-0.5 rounded font-mono select-all text-white">admin@akaza.com</code></p>
                <p className="text-white/70 font-medium">Contraseña: <code className="bg-white/10 px-1 py-0.5 rounded font-mono select-all text-white">admin123</code></p>
              </div>
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: FORMULARIO DE ACCESO ── */}
        <div className="p-6 sm:p-10 flex flex-col justify-center relative bg-akaza-crema">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity text-akaza-marron"
          >
            <X size={20} />
          </button>

          <form className="space-y-4" onSubmit={onSubmit}>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
                {errorMessage}
              </div>
            )}
            
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-akaza-marron/60 uppercase ml-1 tracking-wide">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-akaza-marron/25" size={16} />
                  <input
                    type="text"
                    required
                    value={authForm.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="María Fernanda Díaz"
                    className="w-full bg-white border border-akaza-marron/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all text-xs font-semibold text-akaza-marron shadow-inner"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-akaza-marron/60 uppercase ml-1 tracking-wide">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-akaza-marron/25" size={16} />
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-white border border-akaza-marron/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all text-xs font-semibold text-akaza-marron shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-akaza-marron/60 uppercase ml-1 tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-akaza-marron/25" size={16} />
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-white border border-akaza-marron/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all text-xs font-semibold text-akaza-marron shadow-inner"
                />
              </div>
            </div>

            <button className="w-full bg-akaza-marron text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-akaza-marron/20 transition-all text-sm mt-4 active:scale-95">
              {isRegisterMode ? "Crear Cuenta" : "Iniciar Sesión"}
            </button>

            <button
              type="button"
              onClick={onToggleMode}
              className="w-full text-center text-xs font-bold text-akaza-marron/70 hover:text-akaza-marron transition-colors pt-2"
            >
              {isRegisterMode
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
