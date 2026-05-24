"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  X, Search, RefreshCw, AlertTriangle, Plus, 
  ShoppingBag, Calculator, Check, ArrowRight, Info 
} from "lucide-react";
import { Producto } from "@/types";

type CompraModalProps = {
  isOpen: boolean;
  productos: Producto[];
  isLoading: boolean;
  error: string | null;
  onSubmitExistente: (id_producto: number, cantidad: number, unidad: string, precio_total: number) => void;
  onSubmitNuevo: (nombre: string, cantidad: number, unidad: string, precio_total: number) => void;
  onClose: () => void;
};

const UNIDADES = ["kg", "litro", "unidad", "gramo", "ml", "paquete", "caja"];

export function CompraModal({
  isOpen,
  productos,
  isLoading,
  error,
  onSubmitExistente,
  onSubmitNuevo,
  onClose,
}: CompraModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const [cantidad, setCantidad] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("kg");
  const [precioTotal, setPrecioTotal] = useState("");

  const precioUnitario = useMemo(() => {
    const total = parseFloat(precioTotal);
    const cant = parseFloat(cantidad);
    return total > 0 && cant > 0 ? total / cant : 0;
  }, [precioTotal, cantidad]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedProduct(null);
      setIsCreatingNew(false);
      setCantidad("");
      setUnidadMedida("kg");
      setPrecioTotal("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const exactMatch = productos.find(p => p.nombre.toLowerCase() === searchTerm.toLowerCase().trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cant = parseFloat(cantidad);
    const precio = parseFloat(precioTotal);
    if (isNaN(cant) || cant <= 0 || isNaN(precio) || precio <= 0) return;

    if (isCreatingNew) {
      onSubmitNuevo(searchTerm.trim(), cant, unidadMedida, precio);
    } else if (selectedProduct) {
      onSubmitExistente(selectedProduct.id, cant, unidadMedida, precio);
    }
  };

  // Clases unificadas con DishForm
  const inputClass = "w-full bg-white border border-gray-200 focus:border-akaza-marron focus:ring-4 focus:ring-akaza-marron/5 rounded-xl py-3 px-4 outline-none transition-all text-sm text-gray-700 shadow-sm";
  const labelClass = "text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-2";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-0 animate-in fade-in duration-300">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-akaza-marron/10 rounded-lg flex items-center justify-center text-akaza-marron">
              <ShoppingBag size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-800 leading-none">Registrar Compra</h2>
              <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Actualiza tu stock</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex flex-col gap-6">
          <div className="max-w-xl mx-auto w-full space-y-6">
            
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 shadow-sm text-[10px] font-bold">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <p className="leading-tight">{error}</p>
              </div>
            )}

            {/* SECCIÓN 1: SELECCIÓN DE PRODUCTO */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                Insumo o Producto
              </h3>

              {!selectedProduct && !isCreatingNew ? (
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all"
                    placeholder="Buscar en el inventario..."
                    autoFocus
                  />
                  
                  {searchTerm.trim() && (
                    <div className="absolute z-30 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setSelectedProduct(p); setUnidadMedida(p.unidad_medida); }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors group"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{p.nombre}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-tighter">{p.unidad_medida}</span>
                          </div>
                          <Plus size={14} className="text-akaza-marron opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      {!exactMatch && (
                        <button
                          type="button"
                          onClick={() => setIsCreatingNew(true)}
                          className="w-full flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                        >
                          <Plus size={14} />
                          <span className="font-bold text-[10px] uppercase tracking-widest">Crear nuevo: "{searchTerm}"</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-3 rounded-xl animate-in zoom-in-95">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-akaza-marron flex items-center justify-center shadow-sm font-bold text-[10px]">
                      {isCreatingNew ? <Plus size={14}/> : <Check size={14} className="text-green-500"/>}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800 leading-none">
                        {isCreatingNew ? searchTerm : selectedProduct?.nombre}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5 uppercase font-bold tracking-widest">
                        {isCreatingNew ? "Nuevo Registro" : `Stock: ${selectedProduct?.stock_actual} ${selectedProduct?.unidad_medida}`}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setSelectedProduct(null); setIsCreatingNew(false); setSearchTerm(""); }} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <X size={16} />
                  </button>
                </div>
              )}
            </section>

            {/* SECCIÓN 2: DETALLES DE COMPRA */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                Detalles de Ingreso
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className={labelClass}>Cantidad</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className={labelClass}>Unidad</label>
                  {isCreatingNew ? (
                    <select
                      value={unidadMedida}
                      onChange={(e) => setUnidadMedida(e.target.value)}
                      className={inputClass + " cursor-pointer appearance-none"}
                    >
                      {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  ) : (
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold text-gray-400">
                      {selectedProduct?.unidad_medida || "---"}
                    </div>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-2 space-y-1">
                  <label className={labelClass}>Inversión Total (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precioTotal}
                    onChange={(e) => setPrecioTotal(e.target.value)}
                    className={inputClass + " font-black text-akaza-marron"}
                    placeholder="S/ 0.00"
                  />
                </div>
              </div>

              {/* Card informativa (Estilo compacto) */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-akaza-marron shadow-sm">
                    <Calculator size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Costo Unitario</p>
                    <p className="text-sm font-black text-akaza-marron">S/ {precioUnitario.toFixed(2)}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-white text-gray-400 border border-gray-100 px-2 py-1 rounded-md uppercase">
                  x {unidadMedida}
                </span>
              </div>
            </section>
          </div>
        </form>

        {/* Footer Fijo */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest"
          >
            Descartar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || (!selectedProduct && !isCreatingNew) || !cantidad || !precioTotal}
            className="flex-1 max-w-[200px] py-2.5 rounded-xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-akaza-marron/20 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={14} />
                Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}