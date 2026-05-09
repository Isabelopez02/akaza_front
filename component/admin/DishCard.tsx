"use client";
import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { Plato } from "@/ts/types";

type DishCardProps = {
  dish: Plato;
  onEdit: (dish: Plato) => void;
  onDelete: (id: number) => void;
  onView: (dish: Plato) => void;
};

export function DishCard({ dish, onEdit, onDelete, onView }: DishCardProps) {
  return (
    <div 
      className="bg-white rounded-[1.2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group cursor-pointer"
      onClick={() => onView(dish)}
    >
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {dish.img_url ? (
          <img
            src={dish.img_url}
            alt={dish.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Si la imagen falla, la ocultamos mostrando el fondo gris
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          // Placeholder local simple (sin icono)
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs font-bold">Sin imagen</span>
          </div>
        )}
        <div className="absolute text-sm top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-akaza-marron shadow-sm">
          S/ {(Number(dish.precio) || 0).toFixed(2)}
        </div>
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-akaza-amarillo bg-akaza-marron/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {dish.categoria}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-base font-black text-akaza-marron leading-tight flex-1">
            {dish.nombre}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(dish)}
              className="p-1.5 text-gray-400 hover:text-akaza-marron hover:bg-akaza-crema rounded-lg transition-all"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(dish.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <p className="text-gray-500 text-xs line-clamp-2 font-medium mb-4 flex-1">
          {dish.descripcion}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Categoría</p>
            <p className="text-xs font-black text-akaza-marron">{dish.categoria}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-akaza-marron/40 uppercase tracking-widest">
            <UtensilsCrossed size={14} />
            <span>Plato</span>
          </div>
        </div>
      </div>
    </div>
  );
}
