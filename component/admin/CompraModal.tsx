"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  X, Search, RefreshCw, AlertTriangle, Plus, 
  ShoppingBag, Calculator, Check, ArrowRight, Info 
} from "lucide-react";
import { Producto } from "@/ts/types";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 font-sans">
        
        {/* Header (Estilo DishForm) */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-akaza-marron rounded-2xl flex items-center justify-center text-white shadow-lg shadow-akaza-marron/20">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 leading-none">Registrar Compra</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Actualiza tu stock de inventario</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <div className="max-w-xl mx-auto space-y-10">
            
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 shadow-sm animate-in shake-1">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}

            {/* SECCIÓN 1: SELECCIÓN DE PRODUCTO */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">01</span>
                Insumo o Producto
              </h3>

              {!selectedProduct && !isCreatingNew ? (
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-akaza-marron/10 outline-none transition-all"
                    placeholder="Buscar en el inventario..."
                    autoFocus
                  />
                  
                  {searchTerm.trim() && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      {filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setSelectedProduct(p); setUnidadMedida(p.unidad_medida); }}
                          className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{p.nombre}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{p.unidad_medida}</span>
                          </div>
                          <Plus size={16} className="text-akaza-marron opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      {!exactMatch && (
                        <button
                          type="button"
                          onClick={() => setIsCreatingNew(true)}
                          className="w-full flex items-center gap-3 px-5 py-4 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                        >
                          <Plus size={18} />
                          <span className="font-bold text-sm">Crear nuevo: "{searchTerm}"</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-2xl animate-in zoom-in-95">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-akaza-marron flex items-center justify-center shadow-sm font-bold text-xs">
                      {isCreatingNew ? <Plus size={20}/> : <Check size={20} className="text-green-500"/>}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 leading-none">
                        {isCreatingNew ? searchTerm : selectedProduct?.nombre}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                        {isCreatingNew ? "Nuevo Registro" : `Stock: ${selectedProduct?.stock_actual} ${selectedProduct?.unidad_medida}`}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setSelectedProduct(null); setIsCreatingNew(false); setSearchTerm(""); }} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <X size={18} />
                  </button>
                </div>
              )}
            </section>

            {/* SECCIÓN 2: DETALLES DE COMPRA */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">02</span>
                Detalles de Ingreso
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <label className={labelClass}>Unidad</label>
                  {isCreatingNew ? (
                    <select
                      value={unidadMedida}
                      onChange={(e) => setUnidadMedida(e.target.value)}
                      className={inputClass + " cursor-pointer font-medium"}
                    >
                      {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  ) : (
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-400">
                      {selectedProduct?.unidad_medida || "---"}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className={labelClass}>Inversión Total (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precioTotal}
                    onChange={(e) => setPrecioTotal(e.target.value)}
                    className={inputClass + " py-4 text-lg font-black text-akaza-marron"}
                    placeholder="S/ 0.00"
                  />
                </div>
              </div>

              {/* Card informativa (Estilo DishForm) */}
              <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-akaza-marron shadow-sm">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Costo Unitario</p>
                    <p className="text-lg font-black text-akaza-marron">S/ {precioUnitario.toFixed(2)}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-white text-gray-400 border border-gray-100 px-3 py-1.5 rounded-lg uppercase">
                  x {unidadMedida}
                </span>
              </div>
            </section>
          </div>
        </form>

        {/* Footer (Estilo DishForm) */}
        <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
          >
            Descartar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || (!selectedProduct && !isCreatingNew) || !cantidad || !precioTotal}
            className="flex-1 max-w-[280px] py-3.5 rounded-2xl bg-akaza-marron text-white font-black hover:bg-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-akaza-marron/20 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <>
                <Check size={18} />
                Confirmar Ingreso
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}