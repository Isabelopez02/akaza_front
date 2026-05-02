"use client";
import { Layers, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Combo } from "@/ts/types";

type ComboCardProps = {
  combo: Combo;
  onEdit: (combo: Combo) => void;
  onDelete: (id: number) => void;
};

export function ComboCard({ combo, onEdit, onDelete }: ComboCardProps) {
  return (
    <div className="bg-white rounded-[3rem] border-2 border-dashed border-akaza-amarillo p-8 relative hover:border-solid hover:shadow-2xl transition-all group overflow-hidden flex flex-col h-full">
      {/* Discount Badge */}
      <div className="absolute -right-12 top-8 bg-akaza-amarillo text-akaza-marron px-14 py-2 rotate-45 font-black text-[10px] uppercase tracking-widest shadow-sm z-10">
        Oferta
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-akaza-crema rounded-[2rem] text-akaza-marron group-hover:bg-akaza-amarillo transition-colors">
          <Layers size={32} />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(combo)} 
            className="p-3 bg-gray-50 text-gray-400 hover:text-akaza-marron hover:bg-white rounded-2xl transition-all shadow-sm"
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={() => onDelete(combo.id)}
            className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-black text-akaza-marron mb-4 leading-tight">{combo.nombre}</h3>
        
        <div className="space-y-3 mb-8">
          {combo.incluye.split(" + ").map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-gray-600 font-medium text-sm">
              <CheckCircle2 size={16} className="text-akaza-amarillo mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between pt-6 border-t border-gray-50 mt-auto">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ahorras</p>
          <p className="text-lg font-black text-green-600">S/ {combo.ahorro_estimado.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio Combo</p>
          <p className="text-4xl font-black text-akaza-marron leading-none">S/ {combo.precio.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
