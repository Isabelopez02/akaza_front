"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Minus,
  Trash2
} from "lucide-react";
import { PageHeader } from "@/component/admin/PageHeader";
import { Button } from "@/component/admin/Button";
import { AdminService } from "@/service/admin.service";

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

  return (
    <div className="admin-page-container h-[calc(100vh-80px)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.push("/admin/venta")}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-akaza-marron transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader title="Nuevo Pedido" subtitle="Añade productos y genera el ticket para cocina." />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LADO IZQUIERDO: CATÁLOGO */}
        <div className="flex-[3] bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar platillo o combo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 outline-none"
            >
              <option value="todos">Todos</option>
              <option value="platos">Solo Platos</option>
              <option value="combos">Solo Combos</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
            {isLoading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akaza-marron"></div></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {platosFiltrados.map(p => (
                  <button 
                    key={`p-${p.id}`}
                    onClick={() => agregarAlCarrito('plato', p)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-akaza-marron hover:shadow-md transition-all text-left flex flex-col overflow-hidden group"
                  >
                    <div className="h-28 w-full bg-gray-100 relative">
                      <img src={p.imagen_url || p.img_url || 'https://via.placeholder.com/150'} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-akaza-marron shadow-sm">
                        S/ {Number(p.precio_venta || p.precio || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-gray-900 line-clamp-1">{p.nombre}</p>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{p.descripcion || "Plato a la carta"}</p>
                    </div>
                  </button>
                ))}

                {combosFiltrados.map(c => (
                  <button 
                    key={`c-${c.id}`}
                    onClick={() => agregarAlCarrito('combo', c)}
                    className="bg-white rounded-2xl border border-yellow-200 shadow-sm hover:border-yellow-400 hover:shadow-md transition-all text-left flex flex-col overflow-hidden group"
                  >
                    <div className="h-28 w-full bg-yellow-50 relative">
                      <img src={c.imagen_url || c.img_url || 'https://via.placeholder.com/150'} alt={c.nombre} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-yellow-400 px-2 py-1 rounded-lg text-[10px] font-black text-yellow-900 shadow-sm">
                        S/ {Number(c.precio_venta || c.precio || 0).toFixed(2)}
                      </div>
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-yellow-600 shadow-sm">
                        COMBO
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-gray-900 line-clamp-1">{c.nombre}</p>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{c.incluye || "Combo promocional"}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LADO DERECHO: CARRITO */}
        <div className="flex-[2] bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-w-[320px] max-w-[400px]">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-black text-akaza-marron text-lg flex items-center gap-2">
              <ShoppingCart size={20} /> Tu Pedido
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500">Mesa</label>
              <input 
                type="number" 
                value={nroMesa}
                onChange={(e) => setNroMesa(e.target.value)}
                className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm font-black text-center focus:ring-2 focus:ring-akaza-marron/10 outline-none"
                min="1"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {carrito.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold text-gray-500">Carrito vacío</p>
                <p className="text-xs">Selecciona platillos del catálogo</p>
              </div>
            ) : (
              carrito.map((c, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-sm text-gray-900 leading-tight">{c.item.nombre}</p>
                      <p className="text-[10px] font-black text-akaza-marron mt-0.5">S/ {Number(c.item.precio_venta || c.item.precio || 0).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100">
                      <button onClick={() => actualizarCantidad(idx, -1)} className="p-1.5 text-gray-500 hover:text-akaza-marron transition-colors"><Minus size={14} /></button>
                      <span className="w-6 text-center text-xs font-black">{c.cantidad}</span>
                      <button onClick={() => actualizarCantidad(idx, 1)} className="p-1.5 text-gray-500 hover:text-akaza-marron transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nota (Ej: Sin cebolla, bien cocido...)"
                    value={c.nota}
                    onChange={(e) => actualizarNota(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-akaza-marron/20"
                  />
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-akaza-marron">
                S/ {carrito.reduce((sum, c) => sum + (c.cantidad * Number(c.item.precio_venta || c.item.precio || 0)), 0).toFixed(2)}
              </span>
            </div>
            <Button 
              size="lg" 
              variant="primary" 
              className="w-full justify-center py-4 text-sm"
              onClick={handleCrearPedido}
              disabled={isSubmitting || carrito.length === 0}
              icon={isSubmitting ? undefined : <CheckCircle2 size={18} />}
            >
              {isSubmitting ? "Enviando a cocina..." : "Enviar a Cocina (Generar)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
