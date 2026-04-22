import { CircleUserRound, Save, X } from "lucide-react";
import { ProfileData } from "./types";

type ProfileModalProps = {
  isOpen: boolean;
  profileData: ProfileData;
  onClose: () => void;
  onChange: (field: keyof ProfileData, value: string) => void;
};

export function ProfileModal({
  isOpen,
  profileData,
  onClose,
  onChange,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-akaza-marron/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-akaza-crema w-full max-w-2xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(61,28,2,0.2)] border border-akaza-marron/5 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-akaza-marron px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CircleUserRound size={24} />
            <h3 className="text-2xl font-black">Mi Perfil</h3>
          </div>
          <button
            onClick={onClose}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <X size={22} />
          </button>
        </div>

        <form className="p-8 md:p-10 grid gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
              Nombre
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
              Correo
            </label>
            <input
              type="email"
              readOnly
              value={profileData.email}
              className="w-full bg-zinc-50 border border-akaza-marron/5 rounded-2xl py-4 px-5 outline-none font-medium text-akaza-marron/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
              Alergias
            </label>
            <textarea
              value={profileData.allergies}
              onChange={(e) => onChange("allergies", e.target.value)}
              rows={3}
              className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
              Preferencias
            </label>
            <textarea
              value={profileData.preferences}
              onChange={(e) => onChange("preferences", e.target.value)}
              rows={4}
              className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner resize-none"
            />
          </div>

          <button className="bg-akaza-marron text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-akaza-marron/20 transition-all text-base mt-2 active:scale-95 flex items-center justify-center gap-2">
            <Save size={18} /> Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
