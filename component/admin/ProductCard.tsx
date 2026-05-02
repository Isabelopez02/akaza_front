/**
 * ProductCard — Tarjeta de producto para el panel Admin → Gestión de Productos
 *
 * Novedades:
 * - Stock muestra el sufijo de unidad (ej: "5.00 kg")
 * - Botón "+" abre CompraModal para registrar ingreso de mercadería
 * - Badge de alza si precio_compra > precio_compra_anterior
 */
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
  /** Callback cuando se registra una compra → actualiza la card inline */
  onProductoActualizado: (productoActualizado: Producto) => void;
};

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onProductoActualizado,
}: ProductCardProps) {
  const [showCompraModal, setShowCompraModal] = useState(false);

  // Stock bajo = ESTRICTAMENTE menor al mínimo (si stock==mínimo, todavía está bien)
  const stockBajo = Number(product.stock_actual) < Number(product.stock_minimo_alerta);
  const hasMerma =
    product.merma_min_porcentaje != null && product.merma_max_porcentaje != null;

  // Indicador de alza de precio
  const precioActual = product.precio_compra != null ? Number(product.precio_compra) : null;
  const precioAnterior =
    product.precio_compra_anterior != null ? Number(product.precio_compra_anterior) : null;
  const precioSubio =
    precioActual !== null && precioAnterior !== null && precioActual > precioAnterior;
  const precioBajo =
    precioActual !== null && precioAnterior !== null && precioActual < precioAnterior;
  const variacionPct =
    precioActual !== null && precioAnterior !== null && precioAnterior > 0
      ? (((precioActual - precioAnterior) / precioAnterior) * 100).toFixed(1)
      : null;

  return (
    <>
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
        {/* ── Top row: icon + actions ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 bg-akaza-crema rounded-2xl flex items-center justify-center text-akaza-marron group-hover:bg-akaza-amarillo transition-colors">
            <Package size={22} />
          </div>
          <div className="flex gap-1">
            {/* ── Botón + (registrar compra) ── */}
            <button
              onClick={() => setShowCompraModal(true)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
              title={`Registrar compra de ${product.nombre}`}
            >
              <Plus size={17} />
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-400 hover:text-akaza-marron hover:bg-gray-50 rounded-xl transition-all"
              title="Editar"
            >
              <Pencil size={17} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Eliminar"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        {/* ── Nombre + unidad ─────────────────────────────────────────────── */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full mb-2 inline-block">
            {product.unidad_medida}
          </span>
          <h3 className="text-lg font-black text-akaza-marron leading-tight">
            {product.nombre}
          </h3>
        </div>

        {/* ── Stock ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Stock Actual
            </p>
            <p className={`text-xl font-black ${stockBajo ? "text-red-500" : "text-green-600"}`}>
              {Number(product.stock_actual).toFixed(2)}{" "}
              <span className="text-sm font-bold opacity-60">{product.unidad_medida}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Alerta mín.
            </p>
            <p className="text-xl font-black text-akaza-marron">
              {Number(product.stock_minimo_alerta).toFixed(2)}{" "}
              <span className="text-sm font-bold opacity-60">{product.unidad_medida}</span>
            </p>
          </div>
        </div>

        {/* ── Precio de compra + indicador de alza ─────────────────────── */}
        {precioActual !== null && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Precio de Compra
            </p>

            {/* Fila: precio actual + badge de variación */}
            <div className="flex items-center gap-2">
              <p className="text-base font-black text-akaza-marron">
                S/ {precioActual.toFixed(2)}{" "}
                <span className="text-xs font-medium text-gray-400">/ {product.unidad_medida}</span>
              </p>

              {/* Badge alza */}
              {precioSubio && variacionPct && (
                <span className="flex items-center gap-0.5 bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                  <TrendingUp size={10} />
                  +{variacionPct}%
                </span>
              )}

              {/* Badge baja */}
              {precioBajo && variacionPct && (
                <span className="flex items-center gap-0.5 bg-green-100 text-green-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                  <TrendingDown size={10} />
                  {variacionPct}%
                </span>
              )}
            </div>

            {/* Precio anterior — visible con label y tachado */}
            {precioAnterior !== null && (
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Anterior:
                </p>
                <p className={`text-[11px] font-bold line-through ${
                  precioSubio ? "text-red-400" : precioBajo ? "text-green-500" : "text-gray-400"
                }`}>
                  S/ {precioAnterior.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Merma estimada ──────────────────────────────────────────────── */}
        {hasMerma && (
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-orange-500">
            <TrendingDown size={14} className="flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-wider">
              Merma {Number(product.merma_min_porcentaje).toFixed(0)}%
              {" – "}
              {Number(product.merma_max_porcentaje).toFixed(0)}%
            </p>
          </div>
        )}

        {/* ── Alerta stock bajo ───────────────────────────────────────────── */}
        {stockBajo && (
          <div className="mt-2 flex items-center gap-1.5 text-red-500">
            <AlertTriangle size={13} />
            <p className="text-[10px] font-black uppercase tracking-wider">
              ¡Stock bajo! Reponer pronto
            </p>
          </div>
        )}
      </div>

      {/* ── Modal de compra (se monta fuera del card) ───────────────────── */}
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
