"use client";

import { useState, type FormEvent, useMemo, useEffect } from "react";
import type { Combo, Plato } from "@/types";
import { X, Search, Image as ImageIcon, Plus, Check, Package, Info } from "lucide-react";

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

  const filteredOptions = useMemo(() => {
    const seleccionados = formData?.platos_seleccionados || [];
    return (platoOptions || []).filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !seleccionados.includes(p.id)
    );
  }, [searchTerm, platoOptions, formData?.platos_seleccionados]);

  const selectedPlatos = useMemo(() => {
    const seleccionados = formData?.platos_seleccionados || [];
    return (platoOptions || []).filter((p) => seleccionados.includes(p.id));
  }, [formData?.platos_seleccionados, platoOptions]);

  useEffect(() => {
    const totalSumaPlatos = selectedPlatos.reduce((acc, p) => acc + Number(p.precio_venta || p.precio || 0), 0);
    const precioCombo = Number(formData.precio || 0);
    const ahorro = Math.max(0, totalSumaPlatos - precioCombo).toFixed(2);
    
    if (formData.ahorro_estimado !== ahorro && precioCombo > 0) {
      onChange("ahorro_estimado", ahorro);
    }
  }, [selectedPlatos, formData.precio]);

  const togglePlato = (id: number) => {
    const seleccionadosActuales = formData?.platos_seleccionados || [];
    if (seleccionadosActuales.includes(id)) {
      onChange("platos_seleccionados", seleccionadosActuales.filter((pId) => pId !== id));
    } else {
      onChange("platos_seleccionados", [...seleccionadosActuales, id]);
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
            <Package size={16} />
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold text-gray-800 leading-none">
              {editingCombo ? "Editar Combo" : "Nuevo Combo"}
            </h2>
            <p className="text-[9px] text-gray-400 mt-0.5 font-mono font-bold uppercase tracking-wider">
              Configuración de promoción
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs font-medium flex items-center gap-2">
            <Info size={14} /> {error}
          </div>
        )}

        {/* SECCIÓN 1: IDENTIDAD DEL COMBO */}
        <section className="flex gap-4 items-start">
          {/* Preview Imagen Compacto */}
          <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-50 border border-dashed border-gray-200 overflow-hidden relative flex flex-col items-center justify-center">
            {formData?.img_url ? (
              <img src={formData.img_url} alt="Combo" className="w-full h-full object-cover" />
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
              <label className={labelClass}>Nombre del Combo</label>
              <input
                type="text"
                required
                value={formData?.nombre || ""}
                onChange={(e) => onChange("nombre", e.target.value)}
                className={inputClass}
                placeholder="Ej. Combo Familiar"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Precio Especial (S/)</label>
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
              <label className={labelClass}>Ahorro Cliente (S/)</label>
              <input
                type="number"
                step="0.01"
                readOnly
                value={formData?.ahorro_estimado || ""}
                className={`${inputClass} bg-gray-100/70 text-gray-500 cursor-not-allowed`}
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

        {/* SECCIÓN 2: PLATOS INCLUIDOS */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800 font-serif">
              Platos Incluidos en el Combo
            </h3>
            <span className="text-[9px] font-mono bg-akaza-amarillo/10 text-akaza-marron px-2 py-0.5 rounded-full font-bold uppercase border border-akaza-amarillo/20">
              {selectedPlatos.length} Platos
            </span>
          </div>

          <div className="bg-gray-50/70 rounded-xl p-3 space-y-2 border border-gray-100">
            {/* Buscador de Platos */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-150 rounded-lg py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-2 focus:ring-akaza-marron/10 shadow-2xs"
                placeholder="Buscar plato..."
              />
              
              {searchTerm && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-150 rounded-lg shadow-lg overflow-hidden max-h-36 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlato(p.id)}
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-gray-700 block text-xs">{p.nombre}</span>
                          <span className="text-[9px] text-gray-400 font-mono">S/ {p.precio_venta || p.precio}</span>
                        </div>
                        <div className="w-5 h-5 rounded bg-akaza-marron/10 text-akaza-marron flex items-center justify-center">
                          <Plus size={12} />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-[10px] text-gray-400 italic">No se encontraron platos.</div>
                  )}
                </div>
              )}
            </div>

            {/* Chips de Platos Seleccionados */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedPlatos.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-700">{p.nombre}</span>
                  <button type="button" onClick={() => togglePlato(p.id)} className="text-gray-400 hover:text-red-500">
                    <X size={11} />
                  </button>
                </div>
              ))}
              {selectedPlatos.length === 0 && (
                <div className="w-full py-2.5 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg bg-white">
                  <p className="text-[9px] font-mono font-bold uppercase">Sin platos agregados</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </form>

      {/* Footer Fijo */}
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
          onClick={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
          disabled={isLoading || !formData.nombre || selectedPlatos.length === 0}
          className="flex-1 py-2 rounded-lg bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={13} />
              <span>{editingCombo ? "Actualizar Combo" : "Guardar Combo"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}