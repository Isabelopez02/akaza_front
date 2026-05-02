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
    "w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron disabled:opacity-60";
  const labelClass =
    "text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1 block mb-2";

  return (
    <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-akaza-crema rounded-2xl flex items-center justify-center">
              <Package size={20} className="text-akaza-marron" />
            </div>
            <h2 className="text-2xl font-black text-akaza-marron">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Form — scrollable */}
        <form onSubmit={onSubmit} className="p-8 space-y-5 overflow-y-auto">
          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-medium">
              <AlertTriangle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── SECCIÓN: IDENTIFICACIÓN ───────────────────────────────── */}
          <p className="text-[10px] font-black uppercase tracking-widest text-akaza-marron/30">
            Identificación
          </p>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Unidad de Medida</label>
              <select
                value={formData.unidad_medida}
                onChange={(e) => onChange("unidad_medida", e.target.value)}
                className={inputClass + " appearance-none"}
                disabled={isLoading}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Precio de Compra (S/)</label>
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

          {/* ── SECCIÓN: STOCK ────────────────────────────────────────── */}
          <p className="text-[10px] font-black uppercase tracking-widest text-akaza-marron/30 pt-2">
            Stock e inventario
          </p>

          <div className="grid grid-cols-2 gap-4">
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
              <label className={labelClass}>Alerta de Stock Mín.</label>
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

          {/* ── SECCIÓN: MERMA ESTIMADA ───────────────────────────────── */}
          <p className="text-[10px] font-black uppercase tracking-widest text-akaza-marron/30 pt-2">
            Merma Estimada (%)
          </p>
          <p className="text-[10px] text-gray-400 -mt-3">
            Pérdida estimada del insumo durante la preparación de platos.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Merma Mínima %</label>
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
              <label className={labelClass}>Merma Máxima %</label>
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Guardando...
              </>
            ) : editingProduct ? (
              "Actualizar Producto"
            ) : (
              "Guardar Producto"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
