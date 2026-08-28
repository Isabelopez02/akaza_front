"use client";

import { Pencil, Trash2, Package, CheckCircle2 } from "lucide-react";
import { Combo } from "@/types";

type ComboCardProps = {
  combo: Combo;
  onEdit: (combo: Combo) => void;
  onDelete: (id: number) => void;
};

export function ComboCard({ combo, onEdit, onDelete }: ComboCardProps) {
  const precio = Number(combo.precio || combo.precio_venta || 0);
  const imageUrl = combo.img_url || combo.imagen_url;
  const incluyeItems = combo.incluye ? combo.incluye.split(" + ") : (combo.platos ? combo.platos.map(p => p.nombre) : []);

  return (
    <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden hover:shadow-md transition-all group flex flex-col h-full text-left">
      <div className="h-32 sm:h-36 relative overflow-hidden bg-gray-100 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={combo.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Package size={24} className="text-gray-400 opacity-50" />
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full font-serif text-xs font-black text-akaza-marron shadow-2xs">
          S/ {precio.toFixed(2)}
        </div>

        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-akaza-amarillo bg-akaza-marron/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
            Combo Promo
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-start justify-between mb-1.5 gap-1.5">
            <h3 className="font-serif text-xs sm:text-sm font-bold text-akaza-marron leading-tight flex-1 truncate">
              {combo.nombre}
            </h3>

            <div className="flex gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(combo);
                }}
                className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-md transition-all"
                title="Editar combo"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(combo.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                title="Eliminar combo"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          
          <div className="space-y-1 mb-2">
            {incluyeItems.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <CheckCircle2 size={12} className="text-akaza-amarillo shrink-0" />
                <span className="font-medium truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-gray-100 mt-auto">
          <div>
            <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Precio Promo</p>
            <p className="font-serif text-xs sm:text-sm font-black text-akaza-marron leading-none">
              S/ {precio.toFixed(2)}
            </p>
          </div>

          <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Ahorro S/ {Number(combo.ahorro_estimado || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
