"use client";
import { X, UtensilsCrossed, DollarSign, Tag, FileText } from "lucide-react";
import { Plato, Producto } from "@/ts/types";

type DishDetailsModalProps = {
  isOpen: boolean;
  dish: Plato | null;
  productOptions: Producto[];
  onClose: () => void;
};

export function DishDetailsModal({ isOpen, dish, productOptions, onClose }: DishDetailsModalProps) {
  if (!isOpen || !dish) return null;

  // Mapear ingredientes
  const ingredients = dish.recetas?.map((receta: any) => {
    const product = productOptions.find(p => p.id === receta.id_producto);
    return {
      nombre: product?.nombre || "Producto desconocido",
      cantidad: receta.cantidad_estimada || 1,
      unidad_medida: receta.unidad_medida || "unid",
    };
  }) || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-akaza-marron tracking-tight">Detalles del Plato</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-akaza-marron hover:bg-akaza-crema rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Imagen */}
          <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100">
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
              <span className="text-gray-400 text-sm font-bold">Sin imagen</span>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-akaza-marron mb-2">{dish.nombre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{dish.descripcion}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-akaza-marron" />
                  <span className="text-lg font-black text-akaza-marron">
                    S/ {Number(dish.precio).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-akaza-marron" />
                  <span className="text-sm font-bold text-gray-600">{dish.categoria}</span>
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed size={18} className="text-akaza-marron" />
                <h4 className="text-base font-black text-akaza-marron">Ingredientes</h4>
              </div>
              <div className="space-y-2">
                {ingredients.length > 0 ? (
                  ingredients.map((ing, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">{ing.nombre}</span>
                      <span className="text-xs font-bold text-akaza-marron bg-akaza-crema px-2 py-1 rounded-lg">
                        {ing.cantidad} {ing.unidad_medida}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay ingredientes registrados</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-akaza-marron transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}