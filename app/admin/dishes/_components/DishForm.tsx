"use client";

import { useState, type FormEvent, useMemo } from "react";
import type { Plato, Producto } from "@/types";
import { X, Search, Image as ImageIcon, Plus, Check, UtensilsCrossed, Info } from "lucide-react";

export type DishFormData = {
  nombre: string;
  precio: string;
  descripcion: string;
  img_url: string;
  categoria: string;
  productos_seleccionados: number[];
};

export const DEFAULT_DISH_FORM: DishFormData = {
  nombre: "",
  precio: "",
  descripcion: "",
  img_url: "",
  categoria: "",
  productos_seleccionados: [],
};

type DishFormProps = {
  editingDish: Plato | null;
  formData: DishFormData;
  productOptions: Producto[];
  isLoading: boolean;
  onChange: (field: keyof DishFormData, value: string | number[]) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

const CATEGORIES = ["Criollo", "Marino", "Internacional", "Entrada", "Postre", "Bebida"];

export function DishForm({
  editingDish,
  formData,
  productOptions,
  isLoading,
  onChange,
  onSubmit,
  onClose,
}: DishFormProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    const seleccionados = formData?.productos_seleccionados || [];
    return (productOptions || []).filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !seleccionados.includes(p.id)
    );
  }, [searchTerm, productOptions, formData?.productos_seleccionados]);

  const selectedProducts = useMemo(() => {
    const seleccionados = formData?.productos_seleccionados || [];
    return (productOptions || []).filter((p) => seleccionados.includes(p.id));
  }, [formData?.productos_seleccionados, productOptions]);

  const toggleProduct = (id: number) => {
    const seleccionadosActuales = formData?.productos_seleccionados || [];
    if (seleccionadosActuales.includes(id)) {
      onChange("productos_seleccionados", seleccionadosActuales.filter((pId) => pId !== id));
    } else {
      onChange("productos_seleccionados", [...seleccionadosActuales, id]);
      setSearchTerm("");
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 focus:border-akaza-marron focus:ring-2 focus:ring-akaza-marron/10 rounded-lg py-2 px-3 outline-none transition-all text-xs text-gray-700 shadow-2xs font-medium";
  const labelClass = "text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1 block text-left";

  return (
    <div className="flex flex-col h-full bg-white font-sans text-left">
      {/* Header Compacto */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-akaza-marron text-white rounded-lg flex items-center justify-center shadow-xs">
            <UtensilsCrossed size={16} />
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold text-gray-800 leading-none">
              {editingDish ? "Editar Plato" : "Nuevo Plato"}
            </h2>
            <p className="text-[9px] text-gray-400 mt-0.5 font-mono font-bold uppercase tracking-wider">
              Configuración de menú
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* SECCIÓN 1: IDENTIDAD */}
        <section className="flex gap-4 items-start">
          {/* Preview Imagen Compacto */}
          <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-50 border border-dashed border-gray-200 overflow-hidden relative flex flex-col items-center justify-center">
            {formData?.img_url ? (
              <img src={formData.img_url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-1">
                <ImageIcon className="text-gray-300 mx-auto mb-0.5" size={16} />
                <p className="text-[8px] text-gray-400 font-mono font-bold uppercase">Previa</p>
              </div>
            )}
          </div>

          {/* Campos a la derecha */}
          <div className="flex-1 grid grid-cols-2 gap-2.5">
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Nombre comercial</label>
              <input
                type="text"
                required
                value={formData?.nombre || ""}
                onChange={(e) => onChange("nombre", e.target.value)}
                className={inputClass}
                placeholder="Ej. Lomo Saltado"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Categoría</label>
              <select
                required
                value={formData?.categoria || ""}
                onChange={(e) => onChange("categoria", e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Precio Venta (S/)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData?.precio || ""}
                onChange={(e) => onChange("precio", e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>URL de Imagen</label>
              <input
                type="text"
                value={formData?.img_url || ""}
                onChange={(e) => onChange("img_url", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* SECCIÓN 2: RECETA / INGREDIENTES */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800 font-serif">
              Receta e Ingredientes
            </h3>
            <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-200">
              {selectedProducts.length} seleccionados
            </span>
          </div>

          <div className="bg-gray-50/70 rounded-xl p-3 space-y-2 border border-gray-100">
            {/* Buscador de Insumos */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-150 rounded-lg py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-2 focus:ring-akaza-marron/10 shadow-2xs"
                placeholder="Buscar insumo..."
              />
              
              {/* Dropdown Flotante */}
              {searchTerm && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-150 rounded-lg shadow-lg overflow-hidden max-h-36 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProduct(p.id)}
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-gray-700 block text-xs">{p.nombre}</span>
                          <span className="text-[9px] text-gray-400 font-mono uppercase">{p.unidad_medida}</span>
                        </div>
                        <div className="w-5 h-5 rounded bg-akaza-marron/10 text-akaza-marron flex items-center justify-center">
                          <Plus size={12} />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-[10px] text-gray-400 italic flex items-center gap-1.5">
                      <Info size={12} /> No encontrado
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chips de Ingredientes Seleccionados */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-700">{p.nombre}</span>
                  <button type="button" onClick={() => toggleProduct(p.id)} className="text-gray-400 hover:text-red-500">
                    <X size={11} />
                  </button>
                </div>
              ))}
              {selectedProducts.length === 0 && (
                <div className="w-full py-2.5 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg bg-white">
                  <p className="text-[9px] font-mono font-bold uppercase">Sin ingredientes agregados</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-1">
          <label className={labelClass}>Descripción / Preparación</label>
          <textarea
            required
            rows={2.5}
            value={formData?.descripcion || ""}
            onChange={(e) => onChange("descripcion", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Escribe la receta o descripción corta..."
          />
        </section>
      </form>

      {/* Footer Fijo */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 rounded-lg border border-gray-200 font-mono font-bold text-gray-500 hover:bg-gray-50 transition-all text-[10px] uppercase"
        >
          Descartar
        </button>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
          disabled={isLoading || !formData.nombre || selectedProducts.length === 0}
          className="flex-1 py-2 rounded-lg bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={13} />
              <span>{editingDish ? "Guardar Cambios" : "Crear Plato"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}