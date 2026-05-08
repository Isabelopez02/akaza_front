"use client";
import type { FormEvent } from "react";
import { Combo } from "@/ts/types";

export type ComboFormData = {
  nombre: string;
  precio: string;
  incluye: string;
  ahorro_estimado: string;
  img_url: string;
};

export const DEFAULT_COMBO_FORM: ComboFormData = {
  nombre: "",
  precio: "",
  incluye: "",
  ahorro_estimado: "",
  img_url: "",
};

type ComboFormProps = {
  editingCombo: Combo | null;
  formData: ComboFormData;
  isLoading: boolean;
  error: string | null;
  onChange: (field: keyof ComboFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function ComboForm({
  editingCombo,
  formData,
  isLoading,
  error,
  onChange,
  onSubmit,
  onClose,
}: ComboFormProps) {
  return (
    <div className="flex-1 flex flex-col max-h-[90vh] overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-black text-akaza-marron">
            {editingCombo ? "Editar Combo" : "Nuevo Combo"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {editingCombo
              ? "Actualiza los datos del combo existente"
              : "Agrega un nuevo combo para promociones y paquetes especiales."}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="sr-only">Cerrar modal</span>
          ✕
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                Imagen del Combo
              </label>
              <div className="aspect-square w-full rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 overflow-hidden relative group">
                {formData.img_url ? (
                  <img
                    src={formData.img_url}
                    alt="Vista previa del combo"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder-dish.jpg")}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3">
                    <span className="text-5xl">🖼️</span>
                    <p className="text-sm font-bold tracking-wider">VISTA PREVIA</p>
                  </div>
                )}
              </div>
            </div>

            <input
              type="text"
              value={formData.img_url}
              onChange={(e) => onChange("img_url", e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
              placeholder="URL de la imagen"
              disabled={isLoading}
            />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                Nombre del Combo
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                placeholder="Ej. Combo Parrillero"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                Contenido (separar con '+')
              </label>
              <textarea
                required
                rows={4}
                value={formData.incluye}
                onChange={(e) => onChange("incluye", e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                placeholder="Ej. 1 Pollo + Papas + Ensalada"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                  Precio Combo
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio}
                  onChange={(e) => onChange("precio", e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                  Ahorro estimado (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.ahorro_estimado}
                  onChange={(e) => onChange("ahorro_estimado", e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : editingCombo ? "Actualizar Combo" : "Guardar Combo"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
