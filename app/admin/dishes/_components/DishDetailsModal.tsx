"use client";

import { X, UtensilsCrossed, DollarSign, Tag } from "lucide-react";
import { Plato, Producto } from "@/types";

type DishDetailsModalProps = {
  isOpen: boolean;
  dish: Plato | null;
  productOptions: Producto[];
  onClose: () => void;
};

export function DishDetailsModal({ isOpen, dish, productOptions, onClose }: DishDetailsModalProps) {
  if (!isOpen || !dish) return null;

  const ingredients = dish.recetas?.map((receta: any) => {
    const product = productOptions.find(p => p.id === receta.id_producto);
    return {
      nombre: product?.nombre || "Producto desconocido",
      cantidad: receta.cantidad_estimada || 1,
      unidad_medida: receta.unidad_medida || "unid",
    };
  }) || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden text-left border border-gray-150 animate-in zoom-in-95 duration-200">
        
        {/* Header Compacto */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <h2 className="font-serif text-sm font-bold text-akaza-marron tracking-tight">Detalles del Plato</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto max-h-[calc(85vh-100px)] custom-scrollbar">
          {/* Imagen Compacta */}
          <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 relative">
            {dish.img_url ? (
              <img
                src={dish.img_url}
                alt={dish.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center bg-gray-200 ${dish.img_url ? "hidden" : ""}`}>
              <span className="text-gray-400 text-xs font-mono font-bold">Sin imagen</span>
            </div>
          </div>

          {/* Info Básica */}
          <div>
            <h3 className="font-serif text-base font-bold text-akaza-marron mb-1">{dish.nombre}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{dish.descripcion}</p>

            <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 font-serif text-xs font-black text-akaza-marron">
                <DollarSign size={14} />
                <span>S/ {Number(dish.precio).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-500">
                <Tag size={12} className="text-akaza-marron/60" />
                <span>{dish.categoria}</span>
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 mb-2">
              <UtensilsCrossed size={14} className="text-akaza-marron" />
              <h4 className="font-serif text-xs font-bold text-akaza-marron">Ingredientes</h4>
            </div>

            <div className="space-y-1">
              {ingredients.length > 0 ? (
                ingredients.map((ing, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-medium text-gray-700">{ing.nombre}</span>
                    <span className="text-[10px] font-mono font-bold text-akaza-marron bg-akaza-crema px-2 py-0.5 rounded border border-akaza-marron/10">
                      {ing.cantidad} {ing.unidad_medida}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No hay ingredientes registrados</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-bold text-gray-600 hover:text-akaza-marron transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}