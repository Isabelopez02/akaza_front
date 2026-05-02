"use client";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Producto } from "@/ts/types";

type ProductCardProps = {
  product: Producto;
  onEdit: (product: Producto) => void;
  onDelete: (id: number) => void;
};

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-akaza-crema rounded-2xl flex items-center justify-center text-akaza-marron group-hover:bg-akaza-amarillo transition-colors">
          <Package size={24} />
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-akaza-marron hover:bg-gray-50 rounded-xl transition-all"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full mb-2 inline-block">
          {product.categoria}
        </span>
        <h3 className="text-lg font-black text-akaza-marron leading-tight">{product.nombre}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio Venta</p>
          <p className="text-xl font-black text-akaza-marron">S/ {product.precio_venta.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock</p>
          <p className={`text-xl font-black ${product.stock < 10 ? "text-red-500" : "text-green-600"}`}>
            {product.stock}
          </p>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
          Costo Compra: S/ {product.precio_compra.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
