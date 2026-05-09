/**
 * ProductModal — Modal de Creación y Edición de Productos (Página Admin → Gestión de Productos)
 *
 * Campos del backend (POST /api/inventario/  →  schema ProductoCreate):
 *   - nombre           → requerido
 *   - unidad_medida    → requerido
 *   - stock_actual     → opcional (default 0)
 *   - stock_minimo_alerta → requerido
 *
 * Campos extra (frontend-only, almacenados en tablas separadas del backend):
 *   - precio_compra        → CompraHistorial.precio_unidad_compra
 *   - merma_min_porcentaje → MermaEstimada.merma_min_porcentaje
 *   - merma_max_porcentaje → MermaEstimada.merma_max_porcentaje
 */
"use client";
import { X, RefreshCw, AlertTriangle, Package } from "lucide-react";
import { Producto } from "@/ts/types";

export type ProductFormData = {
  nombre: string;
  unidad_medida: string;
  stock_actual: string;
  stock_minimo_alerta: string;
  precio_compra: string;
  merma_min_porcentaje: string;
  merma_max_porcentaje: string;
};

export const DEFAULT_PRODUCT_FORM: ProductFormData = {
  nombre: "",
  unidad_medida: "kg",
  stock_actual: "",
  stock_minimo_alerta: "",
  precio_compra: "",
  merma_min_porcentaje: "",
  merma_max_porcentaje: "",
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
    "w-full bg-white border border-gray-200 focus:border-akaza-marron focus:ring-2 focus:ring-akaza-marron/10 rounded-xl py-2 px-3 outline-none transition-all text-xs text-gray-700 shadow-sm disabled:opacity-50 disabled:bg-gray-50";
  const labelClass =
    "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block";

  return (
    <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-xl sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-akaza-marron/10 rounded-lg flex items-center justify-center">
              <Package size={16} className="text-akaza-marron" />
            </div>
            <h2 className="text-base font-black text-gray-800 leading-none">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form — scrollable */}
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-5">
          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-[10px] font-bold">
              <AlertTriangle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Fila 1: Identificación */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 space-y-1">
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
              <div className="sm:col-span-3 space-y-1">
                <label className={labelClass}>Unidad</label>
                <select
                  value={formData.unidad_medida}
                  onChange={(e) => onChange("unidad_medida", e.target.value)}
                  className={inputClass + " appearance-none cursor-pointer"}
                  disabled={isLoading}
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className={labelClass}>Costo (S/)</label>
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

            {/* Fila 2: Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Stock Actual</label>
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
                <label className={labelClass}>Alerta Mínima</label>
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

            {/* Fila 3: Merma */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="col-span-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                Merma Estimada (%)
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Mínima (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.merma_min_porcentaje}
                  onChange={(e) => onChange("merma_min_porcentaje", e.target.value)}
                  className={inputClass}
                  placeholder="Ej. 5"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Máxima (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.merma_max_porcentaje}
                  onChange={(e) => onChange("merma_max_porcentaje", e.target.value)}
                  className={inputClass}
                  placeholder="Ej. 15"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); onSubmit(e); }}
            disabled={isLoading}
            className="flex-1 max-w-[200px] py-2.5 rounded-xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-akaza-marron/20 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editingProduct ? (
              "Actualizar"
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
