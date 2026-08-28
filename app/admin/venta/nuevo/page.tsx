"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  Trash2,
  Utensils,
  Package
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/admin/Button";
import { AdminService } from "@/services/admin.service";

export default function NuevoPedidoPage() {
  const router = useRouter();
  const [platos, setPlatos] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"todos"|"platos"|"combos">("todos");

  const [nroMesa, setNroMesa] = useState<string>("1");
  const [carrito, setCarrito] = useState<{tipo: 'plato'|'combo', item: any, cantidad: number, nota: string}[]>([]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setIsLoading(true);
      try {
        const ps = await AdminService.getPlatos();
        const cs = await AdminService.getCombos();
        setPlatos(ps);
        setCombos(cs);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarCatalogos();
  }, []);

  const agregarAlCarrito = (tipo: 'plato'|'combo', item: any) => {
    setCarrito(prev => {
      const existe = prev.find(c => c.tipo === tipo && c.item.id === item.id);
      if (existe) {
        return prev.map(c => 
          c.tipo === tipo && c.item.id === item.id 
          ? { ...c, cantidad: c.cantidad + 1 } 
          : c
        );
      }
      return [...prev, { tipo, item, cantidad: 1, nota: "" }];
    });
  };

  const actualizarCantidad = (index: number, delta: number) => {
    setCarrito(prev => {
      const newCarrito = [...prev];
      const item = newCarrito[index];
      if (item.cantidad + delta <= 0) {
        newCarrito.splice(index, 1);
      } else {
        item.cantidad += delta;
      }
      return newCarrito;
    });
  };

  const actualizarNota = (index: number, nota: string) => {
    setCarrito(prev => {
      const newCarrito = [...prev];
      newCarrito[index].nota = nota;
      return newCarrito;
    });
  };

  const handleCrearPedido = async () => {
    if (carrito.length === 0) return alert("Agrega productos al pedido.");
    setIsSubmitting(true);
    try {
      const payload = {
        nro_mesa: parseInt(nroMesa),
        detalles: carrito.map(c => {
          const detail: any = { cantidad: c.cantidad };
          if (c.nota) detail.nota_personalizacion = c.nota;
          
          if (c.tipo === 'plato') {
            detail.plato_ref = c.item.id;
          } else {
            detail.combo_ref = c.item.id;
          }
          return detail;
        })
      };
      await AdminService.crearPedido(payload);
      alert("Pedido generado en Cocina.");
      router.push("/admin/venta");
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Hubo un error al generar el pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterItems = (items: any[], type: 'plato'|'combo') => {
    if (filterType !== "todos" && filterType !== type + "s") return [];
    return items.filter(i => i.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const platosFiltrados = filterItems(platos, 'plato');
  const combosFiltrados = filterItems(combos, 'combo');

  const totalCalculado = carrito.reduce((sum, c) => sum + (c.cantidad * Number(c.item.precio_venta || c.item.precio || 0)), 0);
  const subtotalCalculado = totalCalculado / 1.18;
  const igvCalculado = totalCalculado - subtotalCalculado;

  return (
    <div className="admin-page-container h-[calc(100vh-80px)] flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* HEADER COMPACTO CON BOTÓN DE REGRESO */}
      <div className="flex items-center gap-3 mb-3">
        <button 
          onClick={() => router.push("/admin/venta")}
          className="w-9 h-9 rounded-xl bg-white border border-gray-150 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-akaza-marron transition-colors shadow-2xs shrink-0"
          title="Regresar a Ventas"
        >
          <ArrowLeft size={18} />
        </button>
        <PageHeader title="Nuevo Pedido" subtitle="Añade productos y genera la comanda para cocina." />
      </div>

      <div className="flex-1 flex gap-5 overflow-hidden">
        
        {/* ── LADO IZQUIERDO: CATÁLOGO DE SELECCIÓN COMPACTO ── */}
        <div className="flex-[3] bg-white rounded-xl border border-gray-150 shadow-2xs flex flex-col overflow-hidden text-left">
          <div className="p-3 border-b border-gray-100 flex gap-2.5 bg-gray-50/50">
            <div className="relative group flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Buscar platillo o combo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-150 rounded-lg text-xs outline-none focus:ring-2 focus:ring-akaza-marron/10 transition-all text-gray-700 shadow-2xs"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-150 rounded-lg text-xs font-bold text-gray-600 outline-none shadow-2xs cursor-pointer"
            >
              <option value="todos">Todos los ítems</option>
              <option value="platos">Solo Platos</option>
              <option value="combos">Solo Combos</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 bg-gray-50/30 custom-scrollbar">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden flex flex-col h-[150px] animate-pulse">
                    <div className="h-24 w-full bg-gray-200" />
                    <div className="p-2.5 space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {platosFiltrados.map(p => (
                  <button 
                    key={`p-${p.id}`}
                    onClick={() => agregarAlCarrito('plato', p)}
                    className="bg-white rounded-xl border border-gray-150 hover:border-akaza-marron shadow-2xs hover:shadow-xs transition-all text-left flex flex-col overflow-hidden group"
                  >
                    <div className="h-24 w-full bg-gray-100 relative shrink-0">
                      <img src={p.imagen_url || p.img_url || '/plato3.jpg'} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full font-serif text-[10px] font-black text-akaza-marron shadow-2xs">
                        S/ {Number(p.precio_venta || p.precio || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <p className="font-serif font-bold text-xs text-akaza-marron line-clamp-1">{p.nombre}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1 font-medium mt-0.5">{p.descripcion || "Plato a la carta"}</p>
                    </div>
                  </button>
                ))}

                {combosFiltrados.map(c => (
                  <button 
                    key={`c-${c.id}`}
                    onClick={() => agregarAlCarrito('combo', c)}
                    className="bg-white rounded-xl border border-amber-200/80 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col overflow-hidden group"
                  >
                    <div className="h-24 w-full bg-amber-50 relative shrink-0">
                      <img src={c.imagen_url || c.img_url || '/plato3.jpg'} alt={c.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-amber-400 px-2 py-0.5 rounded-full font-serif text-[10px] font-black text-amber-950 shadow-2xs">
                        S/ {Number(c.precio_venta || c.precio || 0).toFixed(2)}
                      </div>
                      <div className="absolute top-2 left-2 bg-akaza-marron/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-akaza-amarillo shadow-2xs">
                        COMBO
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <p className="font-serif font-bold text-xs text-akaza-marron line-clamp-1">{c.nombre}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1 font-medium mt-0.5">{c.incluye || "Combo promocional"}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── LADO DERECHO: PANEL "TU PEDIDO" REDISEÑADO ── */}
        <div className="flex-[2] bg-white rounded-xl border border-gray-150 shadow-2xs flex flex-col overflow-hidden min-w-[300px] max-w-[380px] text-left">
          
          {/* Cabecera del Panel */}
          <div className="p-3.5 border-b border-gray-100 bg-gray-50/70 flex justify-between items-center">
            <h2 className="font-serif font-bold text-akaza-marron text-sm flex items-center gap-2">
              <ShoppingCart size={17} className="text-akaza-marron" />
              <span>Tu Pedido</span>
            </h2>

            <div className="flex items-center gap-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase">Mesa</label>
              <input 
                type="number" 
                value={nroMesa}
                onChange={(e) => setNroMesa(e.target.value)}
                className="w-14 px-2 py-1 bg-white border border-gray-200 rounded-lg font-serif text-xs font-bold text-akaza-marron text-center focus:ring-2 focus:ring-akaza-marron/10 outline-none shadow-2xs"
                min="1"
              />
            </div>
          </div>

          {/* Lista de Consumo en el Carrito */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {carrito.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                <ShoppingCart size={36} className="mb-2 opacity-25" />
                <p className="text-xs font-bold text-gray-500 font-serif">Carrito vacío</p>
                <p className="text-[10px] text-gray-400">Selecciona ítems del catálogo</p>
              </div>
            ) : (
              carrito.map((c, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-xl p-2.5 shadow-2xs flex flex-col gap-1.5 group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2 truncate">
                      <p className="font-serif font-bold text-xs text-akaza-marron truncate">{c.item.nombre}</p>
                      <p className="font-serif text-xs font-black text-akaza-marron mt-0.5">
                        S/ {Number(c.item.precio_venta || c.item.precio || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200/80 p-0.5">
                      <button 
                        onClick={() => actualizarCantidad(idx, -1)} 
                        className="p-1 text-gray-500 hover:text-akaza-marron transition-colors"
                        title="Restar"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center font-serif text-xs font-black text-akaza-marron">{c.cantidad}</span>
                      <button 
                        onClick={() => actualizarCantidad(idx, 1)} 
                        className="p-1 text-gray-500 hover:text-akaza-marron transition-colors"
                        title="Sumar"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <input 
                    type="text" 
                    placeholder="Nota (Ej: Sin cebolla, poco picante...)"
                    value={c.nota}
                    onChange={(e) => actualizarNota(idx, e.target.value)}
                    className="w-full px-2.5 py-1 bg-gray-50 border border-gray-150 rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-akaza-marron/20 text-gray-700"
                  />
                </div>
              ))
            )}
          </div>

          {/* Desglose de Totales & Botón Enviar */}
          <div className="p-3.5 bg-gray-50/80 border-t border-gray-150 space-y-2.5">
            <div className="space-y-1 text-[10px] font-mono text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>S/ {subtotalCalculado.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18%):</span>
                <span>S/ {igvCalculado.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Total Pedido</span>
              <span className="font-serif text-lg font-black text-akaza-marron">
                S/ {totalCalculado.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCrearPedido}
              disabled={isSubmitting || carrito.length === 0}
              className="w-full py-2.5 rounded-lg bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Enviar a Cocina (Generar)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
