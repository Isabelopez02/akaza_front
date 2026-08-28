"use client";

import { X, AlertTriangle, Package, Check } from "lucide-react";
import { Producto } from "@/types";

export type ProductFormData = {
  nombre: string;
  unidad_medida: string;
  stock_actual: string;
  stock_minimo_alerta: string;
  precio_compra: string;
};

export const DEFAULT_PRODUCT_FORM: ProductFormData = {
  nombre: "",
  unidad_medida: "kg",
  stock_actual: "",
  stock_minimo_alerta: "",
  precio_compra: "",
};

const UNIDADES = ["kg", "litro", "unidad", "gramo", "ml", "paquete", "caja"];

type ProductModalProps = {
  isOpen: boolean;
  editingProduct: Producto | null;
  formData: ProductFormData;
  isLoading: boolean;
  error: string | null;
  onChange: (field: keyof ProductFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
};

export function ProductModal({
  isOpen,
  editingProduct,
  formData,
  isLoading,
  error,
  onChange,
  onSubmit,
  onClose,
}: ProductModalProps) {
  if (!isOpen) return null;

  const inputClass =
    "w-full bg-white border border-gray-150 focus:border-akaza-marron focus:ring-2 focus:ring-akaza-marron/10 rounded-lg py-1.5 px-3 outline-none transition-all text-xs text-gray-700 shadow-2xs font-medium disabled:opacity-50 disabled:bg-gray-50";
  const labelClass =
    "text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1 block text-left";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col text-left border border-gray-150">
        
        {/* Header Compacto */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-akaza-marron text-white rounded-lg flex items-center justify-center shadow-2xs">
              <Package size={15} />
            </div>
            <h2 className="font-serif text-sm font-bold text-akaza-marron">
              {editingProduct ? "Editar Insumo" : "Nuevo Insumo"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Formulario Compacto sin Merma */}
        <form onSubmit={onSubmit} className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-2.5 text-xs font-medium">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Nombre del Insumo */}
            <div className="space-y-1">
              <label className={labelClass}>Nombre del Insumo</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
                className={inputClass}
                placeholder="Ej. Carne de Res"
                disabled={isLoading}
              />
            </div>

            {/* Unidad & Precio */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className={labelClass}>Unidad de Medida</label>
                <select
                  value={formData.unidad_medida}
                  onChange={(e) => onChange("unidad_medida", e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                  disabled={isLoading}
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Costo de Compra (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precio_compra}
                  onChange={(e) => onChange("precio_compra", e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Stock Actual & Alerta Mínima */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className={labelClass}>Stock Inicial / Actual</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.stock_actual}
                  onChange={(e) => onChange("stock_actual", e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Alerta Stock Mínimo</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.stock_minimo_alerta}
                  onChange={(e) => onChange("stock_minimo_alerta", e.target.value)}
                  className={inputClass}
                  placeholder="Ej. 5.00"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-gray-200 font-mono font-bold text-gray-500 hover:bg-gray-50 transition-all text-[10px] uppercase"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); onSubmit(e); }}
            disabled={isLoading || !formData.nombre}
            className="flex-1 py-2 rounded-lg bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={13} />
                <span>{editingProduct ? "Actualizar Insumo" : "Guardar Insumo"}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
