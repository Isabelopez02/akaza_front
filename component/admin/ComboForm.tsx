"use client";
import { useState, type FormEvent, useMemo, useEffect } from "react";
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

  // Cálculo automático del ahorro
  useEffect(() => {
    const totalSumaPlatos = selectedPlatos.reduce((acc, p) => acc + Number(p.precio_venta || p.precio || 0), 0);
    const precioCombo = Number(formData.precio || 0);
    const ahorro = Math.max(0, totalSumaPlatos - precioCombo).toFixed(2);
    
    if (formData.ahorro_estimado !== ahorro && precioCombo > 0) {
      onChange("ahorro_estimado", ahorro);
    }
  }, [selectedPlatos, formData.precio]);

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
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-akaza-marron rounded-xl flex items-center justify-center text-white shadow-md shadow-akaza-marron/20">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-800 leading-none">
              {editingCombo ? "Editar Combo" : "Nuevo Combo"}
            </h2>
            <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Configuración de promoción</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-[10px] font-bold flex items-center gap-2">
              <Info size={14} /> {error}
            </div>
          )}

          {/* SECCIÓN 1: IDENTIDAD DEL COMBO */}
          <section className="flex gap-6">
            {/* Imagen Pequeña a la izquierda */}
            <div className="w-28 h-28 flex-shrink-0 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group flex flex-col items-center justify-center transition-all hover:bg-gray-100 hover:border-gray-300">
              {formData?.img_url ? (
                <img src={formData.img_url} alt="Combo" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
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
                <label className={labelClass}>Nombre del Combo</label>
                <input type="text" required value={formData?.nombre || ""} onChange={(e) => onChange("nombre", e.target.value)} className={inputClass} placeholder="Ej. Familiar" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Precio Especial (S/)</label>
                <input type="number" step="0.01" required value={formData?.precio || ""} onChange={(e) => onChange("precio", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Ahorro para el cliente (S/)</label>
                <input type="number" step="0.01" readOnly value={formData?.ahorro_estimado || ""} onChange={(e) => onChange("ahorro_estimado", e.target.value)} className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} placeholder="0.00" title="Calculado automáticamente" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>URL de Imagen</label>
                <input type="text" value={formData?.img_url || ""} onChange={(e) => onChange("img_url", e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECCIÓN 2: PLATOS INCLUIDOS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                Platos Incluidos
              </h3>
              <span className="text-[9px] bg-akaza-amarillo/10 text-akaza-marron px-2 py-0.5 rounded-md font-bold uppercase">
                {selectedPlatos.length} Platos
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
              {/* Buscador de Platos */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border-none rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none shadow-sm transition-all"
                  placeholder="Buscar platos por nombre..."
                />
                
                {searchTerm && (
                  <div className="absolute z-30 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePlato(p.id)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{p.nombre}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-tighter">S/ {p.precio_venta || p.precio}</span>
                          </div>
                          <div className="w-6 h-6 rounded-md bg-akaza-marron/5 text-akaza-marron flex items-center justify-center">
                            <Plus size={14} />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-[10px] text-gray-400 italic">No se encontraron platos.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid de Chips más visual y compacto */}
              <div className="flex flex-wrap gap-2">
                {selectedPlatos.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-gray-700">{p.nombre}</span>
                    <button type="button" onClick={() => togglePlato(p.id)} className="text-gray-300 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {selectedPlatos.length === 0 && (
                  <div className="w-full py-4 flex flex-col items-center justify-center text-gray-300 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Sin platos agregados</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </form>

      {/* Footer Fijo */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
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
          disabled={isLoading || !formData.nombre || selectedPlatos.length === 0}
          className="flex-1 max-w-[200px] py-2.5 rounded-xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-akaza-marron/20 disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={14} />
              {editingCombo ? "Actualizar Combo" : "Guardar Combo"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}