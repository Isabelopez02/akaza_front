"use client";
import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { Plato } from "@/ts/types";

type DishCardProps = {
  dish: Plato;
  onEdit: (dish: Plato) => void;
  onDelete: (id: number) => void;
};

export function DishCard({ dish, onEdit, onDelete }: DishCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
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
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-akaza-marron shadow-sm">
          S/ {(Number(dish.precio) || 0).toFixed(2)}
        </div>
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-akaza-amarillo bg-akaza-marron/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {dish.categoria}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-black text-akaza-marron leading-tight">
            {dish.nombre}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(dish)}
              className="p-2 text-gray-400 hover:text-akaza-marron hover:bg-akaza-crema rounded-xl transition-all"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(dish.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 font-medium mb-4">
          {dish.descripcion}
        </p>

        <div className="flex items-center gap-2 text-xs font-bold text-akaza-marron/40 uppercase tracking-widest">
          <UtensilsCrossed size={14} />
          <span>Plato de la Carta</span>
        </div>
      </div>
    </div>
  );
}
