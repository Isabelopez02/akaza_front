"use client";
import { useState } from "react";
import {
  Package,
  Pencil,
  Trash2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Producto } from "@/ts/types";
import { CompraModal } from "./CompraModal";

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
  onProductoActualizado,
}: ProductCardProps) {
  const [showCompraModal, setShowCompraModal] = useState(false);

  const stockBajo = Number(product.stock_actual) < Number(product.stock_minimo_alerta);
  const hasMerma =
    product.merma_min_porcentaje != null && product.merma_max_porcentaje != null;

  const precioActual = product.precio_compra != null ? Number(product.precio_compra) : null;
  const precioAnterior =
    product.precio_compra_anterior != null ? Number(product.precio_compra_anterior) : null;
  
  let variacionPct = null;
  let diferencia = null;
  let precioSubio = false;
  let precioBajo = false;
  
  if (precioActual !== null && precioAnterior !== null && precioAnterior > 0) {
    const diff = precioActual - precioAnterior;
    diferencia = diff;
    precioSubio = diff > 0;
    precioBajo = diff < 0;
    variacionPct = ((diff / precioAnterior) * 100).toFixed(1);
  }

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
        {/* 1. Producto */}
        <td className="px-6 py-4 min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-akaza-amarillo group-hover:text-white transition-all">
              <Package size={16} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{product.nombre}</p>
              <p className="text-[10px] text-gray-400 uppercase">{product.unidad_medida}</p>
            </div>
          </div>
        </td>

        {/* 2. Stock Actual */}
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${stockBajo ? "text-red-500" : "text-gray-700"}`}>
              {Number(product.stock_actual).toFixed(2)}
            </span>
            {stockBajo && (
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-tighter">Bajo Stock</span>
            )}
          </div>
        </td>

        {/* 3. Precio Anterior */}
        <td className="px-6 py-4 whitespace-nowrap">
          {precioAnterior !== null ? (
            <span className="text-sm text-gray-400 line-through decoration-gray-300">
              S/ {precioAnterior.toFixed(2)}
            </span>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </td>

        {/* 4. Precio Actual (Resaltado) */}
        <td className="px-6 py-4 whitespace-nowrap">
          {precioActual !== null ? (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">
                S/ {precioActual.toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400">por {product.unidad_medida}</span>
            </div>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </td>

        {/* 5. Variación (Columna separada) */}
        <td className="px-6 py-4 whitespace-nowrap">
          {variacionPct ? (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              precioSubio ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}>
              {precioSubio ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {precioSubio ? '+' : ''}{variacionPct}%
            </div>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </td>

        {/* 6. Merma */}
        <td className="px-6 py-4">
          {hasMerma ? (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
              {Number(product.merma_min_porcentaje).toFixed(0)}-{Number(product.merma_max_porcentaje).toFixed(0)}%
            </span>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </td>

        {/* 7. Acciones */}
        <td className="px-6 py-4 text-right">
          <div className="flex gap-1 justify-end">
            <button onClick={() => setShowCompraModal(true)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
              <Plus size={16} />
            </button>
            <button onClick={() => onEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Pencil size={16} />
            </button>
            <button onClick={() => onDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {showCompraModal && (
        <CompraModal
          producto={product}
          onClose={() => setShowCompraModal(false)}
          onSuccess={(productoActualizado) => {
            onProductoActualizado(productoActualizado);
            setShowCompraModal(false);
          }}
        />
      )}
    </>
  );
}