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
    <div className="bg-white rounded-[1.2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full">
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={combo.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Package size={32} className="text-gray-400 opacity-50" />
          </div>
        )}
        <div className="absolute text-sm top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-akaza-marron shadow-sm">
          S/ {precio.toFixed(2)}
        </div>
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-akaza-amarillo bg-akaza-marron/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            Combo Promo
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-base font-black text-akaza-marron leading-tight flex-1">
            {combo.nombre}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(combo)}
              className="p-1.5 text-gray-400 hover:text-akaza-marron hover:bg-akaza-crema rounded-lg transition-all"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(combo.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 space-y-1.5 mb-4">
          {incluyeItems.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 text-gray-500 text-xs">
              <CheckCircle2 size={14} className="text-akaza-amarillo mt-0.5 flex-shrink-0" />
              <span className="font-medium leading-tight line-clamp-1">{item}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Precio</p>
            <p className="text-lg font-black text-akaza-marron leading-none tracking-tight">
              S/ {Number(combo.precio_venta || combo.precio || 0).toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
              Ahorras S/ {Number(combo.ahorro_estimado || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
