"use client";
import type { FormEvent } from "react";
import { Plato } from "@/ts/types";

export type DishFormData = {
  nombre: string;
  precio: string;
  descripcion: string;
  img_url: string;
  categoria: string;
};

export const DEFAULT_DISH_FORM: DishFormData = {
  nombre: "",
  precio: "",
  descripcion: "",
  img_url: "",
  categoria: "",
};

const CATEGORIES = [
  "Criollo",
  "Marino",
  "Internacional",
  "Entrada",
  "Postre",
  "Bebida",
];

type DishFormProps = {
  editingDish: Plato | null;
  formData: DishFormData;
  isLoading: boolean;
  onChange: (field: keyof DishFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function DishForm({
  editingDish,
  formData,
  isLoading,
  onChange,
  onSubmit,
  onClose,
}: DishFormProps) {
  const inputClass =
    "w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron";
  const labelClass =
    "text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1 block mb-2";

  return (
    <div className="flex-1 flex flex-col max-h-[90vh] overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-black text-akaza-marron">
            {editingDish ? "Editar Plato" : "Nuevo Plato"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {editingDish
              ? "Actualiza los datos del plato"
              : "Agrega un nuevo plato a la carta"}
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
              <label className={labelClass}>Imagen del Plato</label>
              <div className="aspect-square w-full rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 overflow-hidden relative group transition-all hover:border-akaza-amarillo/30">
                {formData.img_url ? (
                  <img
                    src={formData.img_url}
                    alt="Vista previa del plato"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder-dish.jpg")}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3">
                    <span className="text-5xl">🖼️</span>
                    <p className="text-sm font-bold uppercase tracking-wider">Vista previa</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>URL de la imagen</label>
              <input
                type="text"
                value={formData.img_url}
                onChange={(e) => onChange("img_url", e.target.value)}
                className={inputClass}
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-2">
              <label className={labelClass}>Nombre del Plato</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
                className={inputClass}
                placeholder="Ej. Lomo Saltado"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio}
                  onChange={(e) => onChange("precio", e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Categoría</label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => onChange("categoria", e.target.value)}
                  className={inputClass + " appearance-none"}
                  disabled={isLoading}
                >
                  <option value="" disabled hidden>
                    Selecciona una categoría
                  </option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Descripción</label>
              <textarea
                required
                rows={5}
                value={formData.descripcion}
                onChange={(e) => onChange("descripcion", e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                placeholder="Describe los ingredientes..."
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading
                ? "Guardando..."
                : editingDish
                ? "Actualizar Plato"
                : "Guardar Plato"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
