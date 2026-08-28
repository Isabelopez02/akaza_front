"use client";

import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { Plato } from "@/types";

type DishCardProps = {
  dish: Plato;
  onEdit: (dish: Plato) => void;
  onDelete: (id: number) => void;
  onView: (dish: Plato) => void;
};

export function DishCard({ dish, onEdit, onDelete, onView }: DishCardProps) {
  return (
    <div 
      className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden hover:shadow-md transition-all group cursor-pointer flex flex-col h-full text-left"
      onClick={() => onView(dish)}
    >
      <div className="h-32 sm:h-36 relative overflow-hidden bg-gray-100 shrink-0">
        {dish.img_url ? (
          <img
            src={dish.img_url}
            alt={dish.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs font-bold font-mono">Sin imagen</span>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full font-serif text-xs font-black text-akaza-marron shadow-2xs">
          S/ {(Number(dish.precio) || 0).toFixed(2)}
        </div>

        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-akaza-amarillo bg-akaza-marron/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {dish.categoria}
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-start justify-between mb-1 gap-1.5">
            <h3 className="font-serif text-xs sm:text-sm font-bold text-akaza-marron leading-tight flex-1 truncate">
              {dish.nombre}
            </h3>

            <div className="flex gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(dish);
                }}
                className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-md transition-all"
                title="Editar plato"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(dish.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                title="Eliminar plato"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-500 text-[11px] line-clamp-2 font-medium">
            {dish.descripcion}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              {dish.categoria}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-akaza-marron/50 uppercase tracking-wider">
            <UtensilsCrossed size={11} />
            <span>Plato</span>
          </div>
        </div>
      </div>
    </div>
  );
}
