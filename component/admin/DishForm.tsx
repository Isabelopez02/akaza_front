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
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-akaza-marron rounded-2xl flex items-center justify-center text-white shadow-lg shadow-akaza-marron/20">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 leading-none">
              {editingDish ? "Editar Plato" : "Crear Nuevo Plato"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Configura los detalles de tu menú</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* SECCIÓN 1: IDENTIDAD */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-12">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">01</span>
                Información Básica
              </h3>
            </div>

            {/* Imagen a la izquierda */}
            <div className="md:col-span-4 space-y-4">
              <div className="aspect-[4/5] w-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group flex flex-col items-center justify-center transition-all hover:bg-gray-100 hover:border-gray-300">
                {formData?.img_url ? (
                  <img src={formData.img_url} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
                      <ImageIcon className="text-gray-300" size={24} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Vista previa del plato</p>
                  </div>
                )}
              </div>
            </div>

            {/* Campos a la derecha */}
            <div className="md:col-span-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Nombre comercial</label>
                  <input type="text" required value={formData?.nombre || ""} onChange={(e) => onChange("nombre", e.target.value)} className={inputClass} placeholder="Ej. Lomo Saltado Especial" />
                </div>
                <div>
                  <label className={labelClass}>Precio de venta (S/)</label>
                  <input type="number" step="0.01" required value={formData?.precio || ""} onChange={(e) => onChange("precio", e.target.value)} className={inputClass} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select required value={formData?.categoria || ""} onChange={(e) => onChange("categoria", e.target.value)} className={inputClass}>
                    <option value="">Seleccionar...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>URL de la Imagen</label>
                  <input type="text" value={formData?.img_url || ""} onChange={(e) => onChange("img_url", e.target.value)} className={inputClass} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100 d-flex" />

          {/* SECCIÓN 2: RECETA / INGREDIENTES */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">02</span>
                Receta e Ingredientes
              </h3>
              <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-bold uppercase">
                {selectedProducts.length} Seleccionados
              </span>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
              {/* Buscador de Productos mejorado */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-akaza-marron/10 outline-none shadow-sm transition-all"
                  placeholder="Escribe el nombre de un insumo o producto..."
                />
                
                {/* Dropdown flotante */}
                {searchTerm && (
                  <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProduct(p.id)}
                          className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{p.nombre}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{p.unidad_medida}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-akaza-marron/5 text-akaza-marron flex items-center justify-center">
                            <Plus size={16} />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-4 text-xs text-gray-400 italic flex items-center gap-2">
                        <Info size={14} /> No encontramos ese producto en el inventario
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid de Chips más visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-2xl shadow-sm animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-[10px]">
                        {p.nombre.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-700 leading-none">{p.nombre}</span>
                        <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">Insumo</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => toggleProduct(p.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {selectedProducts.length === 0 && (
                  <div className="col-span-full py-8 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-3xl">
                    <Search size={24} className="mb-2 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest">Debes agregar ingredientes</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <label className={labelClass}>Instrucciones de preparación / Descripción</label>
            <textarea
              required
              rows={4}
              value={formData?.descripcion || ""}
              onChange={(e) => onChange("descripcion", e.target.value)}
              className={`${inputClass} resize-none py-4`}
              placeholder="Escribe la receta o una descripción atractiva para el cliente..."
            />
          </section>
        </div>
      </form>

      {/* Footer Fijo con Botones de Acción */}
      <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3.5 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
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
          className="flex-1 max-w-[300px] py-3.5 rounded-2xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-akaza-marron/20 disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={18} />
              {editingDish ? "Guardar Cambios" : "Crear Plato"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}