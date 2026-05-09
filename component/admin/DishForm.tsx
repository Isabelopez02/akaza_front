"use client";
import { useState, type FormEvent, useMemo } from "react";
import type { Plato, Producto } from "@/ts/types";
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

  const inputClass = "w-full bg-white border border-gray-200 focus:border-akaza-marron focus:ring-4 focus:ring-akaza-marron/5 rounded-xl py-3 px-4 outline-none transition-all text-sm text-gray-700 shadow-sm";
  const labelClass = "text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2";

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Header Estilizado */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-akaza-marron rounded-xl flex items-center justify-center text-white shadow-md shadow-akaza-marron/20">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-800 leading-none">
              {editingDish ? "Editar Plato" : "Nuevo Plato"}
            </h2>
            <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Configuración de menú</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* SECCIÓN 1: IDENTIDAD */}
          <section className="flex gap-6">
            {/* Imagen Pequeña a la izquierda */}
            <div className="w-28 h-28 flex-shrink-0 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group flex flex-col items-center justify-center transition-all hover:bg-gray-100 hover:border-gray-300">
              {formData?.img_url ? (
                <img src={formData.img_url} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="text-center p-2">
                  <ImageIcon className="text-gray-300 mx-auto mb-1" size={20} />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter leading-tight">Vista<br/>Previa</p>
                </div>
              )}
            </div>

            {/* Campos a la derecha */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Nombre comercial</label>
                <input type="text" required value={formData?.nombre || ""} onChange={(e) => onChange("nombre", e.target.value)} className={inputClass} placeholder="Ej. Lomo Saltado Especial" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Categoría</label>
                <select required value={formData?.categoria || ""} onChange={(e) => onChange("categoria", e.target.value)} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Precio de venta (S/)</label>
                <input type="number" step="0.01" required value={formData?.precio || ""} onChange={(e) => onChange("precio", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>URL de Imagen</label>
                <input type="text" value={formData?.img_url || ""} onChange={(e) => onChange("img_url", e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECCIÓN 2: RECETA / INGREDIENTES */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                Receta e Ingredientes
              </h3>
              <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-bold uppercase">
                {selectedProducts.length} Seleccionados
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              {/* Buscador de Productos mejorado */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-none rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none shadow-sm transition-all"
                  placeholder="Buscar insumo o producto..."
                />
                
                {/* Dropdown flotante */}
                {searchTerm && (
                  <div className="absolute z-30 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProduct(p.id)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{p.nombre}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-tighter">{p.unidad_medida}</span>
                          </div>
                          <div className="w-6 h-6 rounded-md bg-akaza-marron/5 text-akaza-marron flex items-center justify-center">
                            <Plus size={14} />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-[10px] text-gray-400 italic flex items-center gap-2">
                        <Info size={12} /> No encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid de Chips más visual y compacto */}
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-gray-700">{p.nombre}</span>
                    <button type="button" onClick={() => toggleProduct(p.id)} className="text-gray-300 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {selectedProducts.length === 0 && (
                  <div className="w-full py-4 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Sin ingredientes agregados</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <label className={labelClass}>Descripción / Preparación</label>
            <textarea
              required
              rows={3}
              value={formData?.descripcion || ""}
              onChange={(e) => onChange("descripcion", e.target.value)}
              className={`${inputClass} resize-none py-2`}
              placeholder="Escribe la receta o descripción atractiva..."
            />
          </section>
        </div>
      </form>

      {/* Footer Fijo con Botones de Acción */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest"
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
          className="flex-1 max-w-[200px] py-2.5 rounded-xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-akaza-marron/20 disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={14} />
              {editingDish ? "Guardar Cambios" : "Crear Plato"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}