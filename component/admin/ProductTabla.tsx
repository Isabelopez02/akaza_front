"use client";

import { Package, Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { Producto } from "@/types";

type ProductCardProps = {
  product: Producto;
  onEdit: (product: Producto) => void;
  onDelete: (id: number) => void;
  onProductoActualizado: (productoActualizado: Producto) => void;
};

export function ProductTabla({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const hasMerma =
    product.merma_min_porcentaje != null && product.merma_max_porcentaje != null;

  const precioActual = product.precio_compra != null ? Number(product.precio_compra) : null;
  const precioAnterior =
    product.precio_compra_anterior != null ? Number(product.precio_compra_anterior) : null;
  
  let variacionPct = null;
  let precioSubio = false;
  
  if (precioActual !== null && precioAnterior !== null && precioAnterior > 0) {
    const diff = precioActual - precioAnterior;
    precioSubio = diff > 0;
    variacionPct = ((diff / precioAnterior) * 100).toFixed(1);
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group text-left">
      {/* 1. Producto */}
      <td className="px-3.5 py-2.5 min-w-[180px]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-akaza-amarillo group-hover:text-akaza-marron transition-all shrink-0">
            <Package size={14} />
          </div>
          <div className="truncate">
            <p className="font-bold text-gray-800 text-xs truncate">{product.nombre}</p>
            <p className="text-[9px] text-gray-400 font-mono uppercase">{product.unidad_medida}</p>
          </div>
        </div>
      </td>

      {/* 2. Precio Anterior */}
      <td className="px-3.5 py-2.5 whitespace-nowrap">
        {precioAnterior !== null ? (
          <span className="text-xs text-gray-400 line-through decoration-gray-300 font-mono">
            S/ {precioAnterior.toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-300 text-[10px]">—</span>
        )}
      </td>

      {/* 3. Precio Actual */}
      <td className="px-3.5 py-2.5 whitespace-nowrap">
        {precioActual !== null ? (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-800 font-mono">
              S/ {precioActual.toFixed(2)}
            </span>
            <span className="text-[9px] text-gray-400">por {product.unidad_medida}</span>
          </div>
        ) : (
          <span className="text-gray-300 text-[10px]">—</span>
        )}
      </td>

      {/* 4. Variación */}
      <td className="px-3.5 py-2.5 whitespace-nowrap">
        {variacionPct ? (
          <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            precioSubio ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          }`}>
            {precioSubio ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {precioSubio ? '+' : ''}{variacionPct}%
          </div>
        ) : (
          <span className="text-gray-300 text-[10px]">—</span>
        )}
      </td>

      {/* 5. Merma */}
      <td className="px-3.5 py-2.5">
        {hasMerma ? (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-mono">
            {Number(product.merma_min_porcentaje).toFixed(0)}-{Number(product.merma_max_porcentaje).toFixed(0)}%
          </span>
        ) : (
          <span className="text-gray-300 text-[10px]">—</span>
        )}
      </td>

      {/* 6. Acciones */}
      <td className="px-3.5 py-2.5 text-right">
        <div className="flex gap-1 justify-end">
          <button 
            onClick={() => onEdit(product)} 
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
            title="Editar insumo"
          >
            <Pencil size={14} />
          </button>
          <button 
            onClick={() => onDelete(product.id)} 
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            title="Eliminar insumo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}