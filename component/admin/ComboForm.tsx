"use client";
import { useState, type FormEvent, useMemo } from "react";
import type { Combo, Plato } from "@/ts/types";
import { X, Search, Image as ImageIcon, Plus, Check, Package, Info, Zap } from "lucide-react";

export type ComboFormData = {
  nombre: string;
  precio: string;
  incluye: string;
  ahorro_estimado: string;
  img_url: string;
  platos_seleccionados: number[];
};

export const DEFAULT_COMBO_FORM: ComboFormData = {
  nombre: "",
  precio: "",
  incluye: "",
  ahorro_estimado: "",
  img_url: "",
  platos_seleccionados: [],
};

type ComboFormProps = {
  editingCombo: Combo | null;
  formData: ComboFormData;
  platoOptions: Plato[];
  isLoading: boolean;
  error: string | null;
  onChange: (field: keyof ComboFormData, value: string | number[]) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
};

export function ComboForm({
  editingCombo,
  formData,
  platoOptions,
  isLoading,
  error,
  onChange,
  onSubmit,
  onClose,
}: ComboFormProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Filtrado de Platos para el buscador
  const filteredOptions = useMemo(() => {
    const seleccionados = formData?.platos_seleccionados || [];
    return (platoOptions || []).filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !seleccionados.includes(p.id)
    );
  }, [searchTerm, platoOptions, formData?.platos_seleccionados]);

  // 2. Obtener los platos seleccionados para mostrar los chips
  const selectedPlatos = useMemo(() => {
    const seleccionados = formData?.platos_seleccionados || [];
    return (platoOptions || []).filter((p) => seleccionados.includes(p.id));
  }, [formData?.platos_seleccionados, platoOptions]);

  // 3. Lógica para agregar/quitar platos del combo
  const togglePlato = (id: number) => {
    const seleccionadosActuales = formData?.platos_seleccionados || [];
    if (seleccionadosActuales.includes(id)) {
      onChange("platos_seleccionados", seleccionadosActuales.filter((pId) => pId !== id));
    } else {
      onChange("platos_seleccionados", [...seleccionadosActuales, id]);
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
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 leading-none">
              {editingCombo ? "Editar Combo" : "Crear Nuevo Combo"}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Paquetes promocionales y ofertas</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
              <Info size={16} /> {error}
            </div>
          )}

          {/* SECCIÓN 1: IDENTIDAD DEL COMBO */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-12">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">01</span>
                Datos de la Promoción
              </h3>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="aspect-square w-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group flex flex-col items-center justify-center transition-all hover:bg-gray-100 hover:border-gray-300">
                {formData?.img_url ? (
                  <img src={formData.img_url} alt="Combo" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3 text-gray-300">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Imagen del combo</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Nombre del Combo</label>
                  <input type="text" required value={formData?.nombre || ""} onChange={(e) => onChange("nombre", e.target.value)} className={inputClass} placeholder="Ej. Combo Familiar de Fin de Semana" />
                </div>
                <div>
                  <label className={labelClass}>Precio Especial (S/)</label>
                  <input type="number" step="0.01" required value={formData?.precio || ""} onChange={(e) => onChange("precio", e.target.value)} className={inputClass} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelClass}>Ahorro para el cliente (S/)</label>
                  <input type="number" step="0.01" required value={formData?.ahorro_estimado || ""} onChange={(e) => onChange("ahorro_estimado", e.target.value)} className={inputClass} placeholder="Ej. 5.00" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>URL de la Imagen</label>
                  <input type="text" value={formData?.img_url || ""} onChange={(e) => onChange("img_url", e.target.value)} className={inputClass} placeholder="https://..." />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECCIÓN 2: PLATOS INCLUIDOS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">02</span>
                Platos Incluidos
              </h3>
              <span className="text-[10px] bg-akaza-amarillo/10 text-akaza-marron px-3 py-1 rounded-full font-bold uppercase">
                {selectedPlatos.length} Platos en combo
              </span>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
              {/* Buscador de Platos */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-akaza-marron/10 outline-none shadow-sm"
                  placeholder="Buscar platos por nombre (ej. Ceviche, Lomo...)"
                />
                
                {searchTerm && (
                  <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePlato(p.id)}
                          className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{p.nombre}</span>
                            <span className="text-[10px] text-gray-400 font-medium italic">S/ {p.precio}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-akaza-marron text-white flex items-center justify-center shadow-md">
                            <Plus size={16} />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-4 text-xs text-gray-400 italic">No se encontraron platos con ese nombre.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid de Platos Seleccionados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPlatos.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-akaza-marron/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-akaza-amarillo/20 text-akaza-marron flex items-center justify-center overflow-hidden">
                        {p.img_url ? (
                          <img src={p.img_url} className="w-full h-full object-cover" />
                        ) : (
                          <Zap size={18} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-800 leading-tight">{p.nombre}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{p.categoria}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => togglePlato(p.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {selectedPlatos.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-3xl">
                    <Package size={32} className="mb-2 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-widest">Añade platos a este combo</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Resumen automático (Solo lectura para UI) */}
          <section className="space-y-4 pb-10">
            <label className={labelClass}>Resumen del Contenido</label>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-medium text-gray-500 italic">
              {selectedPlatos.length > 0 
                ? `Este combo incluye: ${selectedPlatos.map(p => p.nombre).join(", ")}.`
                : "Selecciona platos arriba para generar el resumen."}
            </div>
          </section>
        </div>
      </form>

      {/* Footer Fijo */}
      <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3.5 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={(e) => { e.preventDefault(); onSubmit(e); }}
          disabled={isLoading || !formData.nombre || selectedPlatos.length === 0}
          className="flex-1 max-w-[300px] py-3.5 rounded-2xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-akaza-marron/20 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={18} />
              {editingCombo ? "Actualizar Combo" : "Guardar Combo"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}