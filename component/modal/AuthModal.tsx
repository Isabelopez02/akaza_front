import Image from "next/image";
import { Lock, Mail, User, X } from "lucide-react";
import { AuthForm } from "@/ts/types";

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

      <div className="relative bg-akaza-crema w-full max-w-md rounded-[2.5rem] shadow-[0_30px_100px_rgba(61,28,2,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 border border-akaza-marron/5">
        <div className="bg-akaza-marron p-12 text-center relative text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity"
          >
            <X size={24} />
          </button>
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 p-2 shadow-xl flex items-center justify-center">
            <Image src="/logo-akaza.png" alt="Logo" width={60} height={60} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-1">
            {isRegisterMode ? "Crea tu cuenta" : "¡Bienvenido!"}
          </h2>
          <p className="text-akaza-amarillo text-xs font-bold uppercase tracking-widest">
            {isRegisterMode ? "Registro Akaza" : "Acceso Akaza"}
          </p>
        </div>

        <form className="p-10 space-y-5" onSubmit={onSubmit}>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-2xl">
              {errorMessage}
            </div>
          )}
          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-5 top-5 text-akaza-marron/20" size={18} />
                <input
                  type="text"
                  required
                  value={authForm.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  placeholder="María Fernanda Díaz"
                  className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-5 text-akaza-marron/20" size={18} />
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-5 text-akaza-marron/20" size={18} />
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => onChange("password", e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner"
              />
            </div>
          </div>

          <button className="w-full bg-akaza-marron text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-akaza-marron/20 transition-all text-lg mt-6 active:scale-95">
            {isRegisterMode ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="w-full text-center text-sm font-semibold text-akaza-marron/70 hover:text-akaza-marron transition-colors"
          >
            {isRegisterMode
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </form>
      </div>
    </div>
  );
}
