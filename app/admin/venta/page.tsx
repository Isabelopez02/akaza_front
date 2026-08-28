"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  Calendar,
  Receipt,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  X,
  Plus,
  Banknote,
  CreditCard,
  Wallet
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/admin/Button";
import { AdminService } from "@/services/admin.service";

type EstadoPedido = "pendiente" | "pagado" | "anulado";

interface ProductoPedido {
  id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  nota?: string;
}

interface PedidoVenta {
  id_bd: number;
  id: string;
  mesa: string;
  cliente: string;
  fecha: string;
  hora: string;
  estado: EstadoPedido;
  productos: ProductoPedido[];
  subtotal: number;
  igv: number;
  total: number;
}

export default function VentasPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [platos, setPlatos] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split("T")[0]);
  const [estadoFiltro, setEstadoFiltro] = useState<"todos" | EstadoPedido>("todos");
  
  const [boletaActiva, setBoletaActiva] = useState<PedidoVenta | null>(null);

  // Modal Pago
  const [pedidoAPagar, setPedidoAPagar] = useState<PedidoVenta | null>(null);
  const [metodoPago, setMetodoPago] = useState<"EFECTIVO" | "YAPE" | "TARJETA" | "MIXTO">("EFECTIVO");
  const [montoEfectivo, setMontoEfectivo] = useState("");
  const [montoYape, setMontoYape] = useState("");
  const [montoTarjeta, setMontoTarjeta] = useState("");
  const [isSubmittingPago, setIsSubmittingPago] = useState(false);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [ps, cs, data] = await Promise.all([
        AdminService.getPlatos(),
        AdminService.getCombos(),
        AdminService.getPedidos(),
        new Promise((resolve) => setTimeout(resolve, 250))
      ]);
      
      setPlatos(ps);
      setCombos(cs);
      
      const formated = data.map((d: any) => {
        const productosMapeados = (d.detalles || []).map((det: any) => {
          let nombre = "Item Desconocido";
          let precio = 0;
          if (det.id_plato) {
            const p = ps.find((x: any) => x.id === det.id_plato);
            if (p) { nombre = p.nombre; precio = p.precio_venta || p.precio; }
          } else if (det.id_combo) {
            const c = cs.find((x: any) => x.id === det.id_combo);
            if (c) { nombre = c.nombre; precio = c.precio_venta || c.precio; }
          }
          return {
            id: det.id_plato || det.id_combo || 0,
            nombre,
            cantidad: det.cantidad,
            precio_unitario: Number(precio || 0),
            nota: det.nota_personalizacion
          };
        });

        let fechaFormat = new Date().toISOString().split("T")[0];
        let horaFormat = "00:00";
        if(d.fecha_venta) {
            const dateObj = new Date(d.fecha_venta);
            fechaFormat = dateObj.toLocaleDateString('en-CA');
            horaFormat = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id_bd: d.id,
          id: d.ticket || `ORD-${d.id}`,
          mesa: `Mesa ${d.nro_mesa < 10 ? '0'+d.nro_mesa : d.nro_mesa}`,
          cliente: d.id_usuario ? `Cliente #${d.id_usuario}` : "Clientes Varios",
          fecha: fechaFormat,
          hora: horaFormat,
          estado: d.estado_pago === "PAGADO" ? "pagado" : (d.estado_pago === "ANULADO" ? "anulado" : "pendiente"),
          productos: productosMapeados,
          subtotal: Number(d.total || 0) / 1.18,
          igv: Number(d.total || 0) - (Number(d.total || 0) / 1.18),
          total: Number(d.total || 0),
        };
      });
      
      formated.sort((a: any, b: any) => b.id_bd - a.id_bd);
      setPedidos(formated);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const confirmarPago = async () => {
    if (!pedidoAPagar) return;
    
    const payload: any = { metodo_pago: metodoPago };
    if (metodoPago === "MIXTO") {
      const e = parseFloat(montoEfectivo) || 0;
      const y = parseFloat(montoYape) || 0;
      const t = parseFloat(montoTarjeta) || 0;
      const suma = e + y + t;
      if (Math.abs(suma - pedidoAPagar.total) > 0.01) {
        return alert(`La suma de los montos (S/ ${suma.toFixed(2)}) no coincide con el total (S/ ${pedidoAPagar.total.toFixed(2)}).`);
      }
      payload.monto_efectivo = e;
      payload.monto_yape = y;
      payload.monto_tarjeta = t;
    } else if (metodoPago === "EFECTIVO") {
      payload.monto_efectivo = pedidoAPagar.total;
    } else if (metodoPago === "YAPE") {
      payload.monto_yape = pedidoAPagar.total;
    } else if (metodoPago === "TARJETA") {
      payload.monto_tarjeta = pedidoAPagar.total;
    }

    setIsSubmittingPago(true);
    try {
      await Promise.all([
        AdminService.pagarPedido(pedidoAPagar.id_bd, payload),
        new Promise((resolve) => setTimeout(resolve, 300))
      ]);
      await cargarDatos();
      
      const pedidoActualizado = { ...pedidoAPagar, estado: "pagado" as EstadoPedido };
      setPedidoAPagar(null);
      setBoletaActiva(pedidoActualizado);
      setMontoEfectivo("");
      setMontoYape("");
      setMontoTarjeta("");
    } catch (error) {
      console.error("Error al pagar:", error);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setIsSubmittingPago(false);
    }
  };

  const handleAnular = async (id_bd: number) => {
    if(confirm("¿Estás seguro de anular este pedido?")) {
      try {
        await AdminService.anularPedido(id_bd);
        await cargarDatos();
      } catch (error) {
        console.error("Error al anular:", error);
        alert("Error al anular el pedido.");
      }
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const coincideFecha = p.fecha === fechaFiltro;
    const coincideEstado = estadoFiltro === "todos" || p.estado === estadoFiltro;
    return coincideFecha && coincideEstado;
  });

  const totalVentasDia = pedidosFiltrados
    .filter(p => p.estado === "pagado")
    .reduce((sum, p) => sum + p.total, 0);
  
  const cantidadPedidosPagados = pedidosFiltrados.filter(p => p.estado === "pagado").length;

  const getEstadoBadge = (estado: EstadoPedido) => {
    switch (estado) {
      case "pendiente":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-amber-200">
            <Clock size={10} strokeWidth={2.5} />
            Pendiente
          </span>
        );
      case "pagado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 size={10} strokeWidth={2.5} />
            Pagado
          </span>
        );
      case "anulado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-rose-200">
            <XCircle size={10} strokeWidth={2.5} />
            Anulado
          </span>
        );
    }
  };

  return (
    <div className="admin-page-container space-y-5 animate-in fade-in duration-300">
      
      {/* HEADER COMPACTO */}
      <PageHeader
        title="Punto de Venta"
        subtitle="Gestiona los pedidos, cobra a los clientes y emite comprobantes."
      >
        <Button
          size="md"
          icon={<Plus size={14} />}
          onClick={() => router.push("/admin/venta/nuevo")}
        >
          Nuevo Pedido
        </Button>
      </PageHeader>

      {/* CARDS DE RESUMEN KPI ESTILO DASHBOARD /ADMIN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1 - Recaudado Hoy */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-gray-150 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 text-green-700 flex items-center justify-center">
              <DollarSign size={16} strokeWidth={2.2} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              VENTAS HOY
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Total Recaudado Hoy
            </p>
            {isLoading ? (
              <div className="h-5 w-24 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className="font-serif text-base sm:text-lg font-black tracking-tight text-akaza-marron leading-tight">
                S/ {Number(totalVentasDia || 0).toFixed(2)}
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Monto cobrado en caja</p>
          </div>
        </div>

        {/* Card 2 - Pedidos Pagados */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-gray-150 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={16} strokeWidth={2.2} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              PAGADOS
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Pedidos Concluidos
            </p>
            {isLoading ? (
              <div className="h-5 w-16 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className="font-serif text-base sm:text-lg font-black tracking-tight text-akaza-marron leading-tight">
                {cantidadPedidosPagados} <span className="text-xs font-sans text-gray-500 font-medium">tickets</span>
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Órdenes cobradas</p>
          </div>
        </div>

        {/* Card 3 - Tickets Pendientes */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-gray-150 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center">
              <Clock size={16} strokeWidth={2.2} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              PENDIENTES
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Tickets Pendientes
            </p>
            {isLoading ? (
              <div className="h-5 w-16 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className="font-serif text-base sm:text-lg font-black tracking-tight text-amber-700 leading-tight">
                {pedidosFiltrados.filter(p => p.estado === "pendiente").length} <span className="text-xs font-sans text-gray-500 font-medium">por cobrar</span>
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Por procesar en caja</p>
          </div>
        </div>

      </div>

      {/* CONTROLES DE FILTRADO MINIMALISTAS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative group flex-1 max-w-xs">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-150 rounded-xl text-xs font-mono font-bold text-gray-700 focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-2xs"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative group min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as any)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-150 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-2xs cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-akaza-marron/10"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="pagado">Pagados</option>
              <option value="anulado">Anulados</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRILLA DE TICKETS DE VENTA COMPACTOS */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-150 shadow-2xs p-3.5 animate-pulse space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="space-y-1 py-2">
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-150 rounded-xl">
          <Receipt className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <h3 className="text-xs font-bold text-gray-800">No hay pedidos</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">No se encontraron ventas para la fecha seleccionada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pedidosFiltrados.map((pedido) => (
            <div 
              key={pedido.id_bd} 
              className={`bg-white rounded-xl border ${
                pedido.estado === 'pagado' ? 'border-emerald-200/80' : 'border-gray-150'
              } shadow-2xs hover:shadow-xs transition-all overflow-hidden relative flex flex-col justify-between text-left`}
            >
              {/* Header del Ticket */}
              <div className="p-3 bg-gray-50/70 border-b border-gray-100">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-serif text-xs font-bold text-akaza-marron">{pedido.id}</h3>
                    <p className="text-[9px] font-mono text-gray-400 uppercase">{pedido.fecha} • {pedido.hora}</p>
                  </div>
                  {getEstadoBadge(pedido.estado)}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{pedido.mesa}</span>
                  <span className="text-[10px] text-gray-400 font-medium truncate max-w-[110px]">{pedido.cliente}</span>
                </div>
              </div>

              {/* Detalle de Productos */}
              <div className="p-3 bg-white min-h-[95px] flex-1">
                <ul className="space-y-1.5">
                  {pedido.productos.map((prod, idx) => (
                    <li key={idx} className="flex flex-col text-[11px]">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex gap-1.5 truncate pr-2">
                          <span className="font-bold font-mono text-gray-400 shrink-0">{prod.cantidad}x</span>
                          <span className="font-medium text-gray-700 truncate">{prod.nombre}</span>
                        </div>
                        <span className="font-bold font-mono text-gray-800 shrink-0">
                          S/ {(prod.cantidad * prod.precio_unitario).toFixed(2)}
                        </span>
                      </div>
                      {prod.nota && (
                        <p className="text-[9px] text-gray-400 italic ml-4 bg-gray-50 px-1.5 py-0.5 rounded truncate">
                          Nota: {prod.nota}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer del Ticket */}
              <div className="p-3 border-t border-dashed border-gray-200 bg-gray-50/40">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Total</span>
                  <span className="font-serif text-sm font-black text-akaza-marron">
                    S/ {Number(pedido.total || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {pedido.estado === "pendiente" && (
                    <>
                      <button
                        onClick={() => setPedidoAPagar(pedido)}
                        className="flex-1 py-1.5 bg-akaza-marron hover:bg-black text-white rounded-lg font-serif text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <DollarSign size={12} />
                        <span>Cobrar</span>
                      </button>
                      <button 
                        onClick={() => handleAnular(pedido.id_bd)}
                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200/60"
                        title="Anular pedido"
                      >
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                  {pedido.estado === "pagado" && (
                    <button
                      onClick={() => setBoletaActiva(pedido)}
                      className="w-full py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-akaza-marron hover:border-akaza-marron rounded-lg font-serif text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Receipt size={12} />
                      <span>Ver Boleta</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Pago */}
      {pedidoAPagar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col text-left border border-gray-150">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
                <Wallet className="text-akaza-marron" size={18} />
                Confirmar Pago
              </h2>
              <button 
                onClick={() => setPedidoAPagar(null)}
                className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 sm:p-5">
              <div className="text-center mb-5">
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-0.5">Monto a Cobrar</p>
                <p className="font-serif text-2xl sm:text-3xl font-black text-akaza-marron">S/ {Number(pedidoAPagar?.total || 0).toFixed(2)}</p>
                <p className="text-[10px] font-mono text-gray-400 mt-1">{pedidoAPagar.id} • {pedidoAPagar.mesa}</p>
              </div>

              <p className="text-[10px] font-mono font-bold text-gray-500 mb-2 uppercase tracking-wider">Método de Pago</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => setMetodoPago("EFECTIVO")}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${metodoPago === 'EFECTIVO' ? 'border-akaza-marron bg-akaza-marron/5 text-akaza-marron font-bold' : 'border-gray-150 bg-white text-gray-500'}`}
                >
                  <Banknote size={18} />
                  <span className="text-[10px] uppercase font-mono">Efectivo</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("YAPE")}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${metodoPago === 'YAPE' ? 'border-[#742384] bg-[#742384]/5 text-[#742384] font-bold' : 'border-gray-150 bg-white text-gray-500'}`}
                >
                  <CreditCard size={18} />
                  <span className="text-[10px] uppercase font-mono">Yape/Plin</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("TARJETA")}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${metodoPago === 'TARJETA' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-gray-150 bg-white text-gray-500'}`}
                >
                  <CreditCard size={18} />
                  <span className="text-[10px] uppercase font-mono">Tarjeta</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("MIXTO")}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${metodoPago === 'MIXTO' ? 'border-gray-800 bg-gray-50 text-gray-800 font-bold' : 'border-gray-150 bg-white text-gray-500'}`}
                >
                  <Wallet size={18} />
                  <span className="text-[10px] uppercase font-mono">Mixto</span>
                </button>
              </div>

              {metodoPago === "MIXTO" && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 mb-4 space-y-2 text-left">
                  <p className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Distribuir Pago</p>
                  <div className="flex items-center gap-2">
                    <label className="w-16 text-[10px] font-bold text-gray-700">Efectivo S/</label>
                    <input 
                      type="number" 
                      value={montoEfectivo} 
                      onChange={(e) => setMontoEfectivo(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-16 text-[10px] font-bold text-[#742384]">Yape S/</label>
                    <input 
                      type="number" 
                      value={montoYape} 
                      onChange={(e) => setMontoYape(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-16 text-[10px] font-bold text-blue-600">Tarjeta S/</label>
                    <input 
                      type="number" 
                      value={montoTarjeta} 
                      onChange={(e) => setMontoTarjeta(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <Button 
                size="lg" 
                variant="primary" 
                className="w-full justify-center py-2.5 font-serif text-xs font-bold uppercase tracking-wider"
                onClick={confirmarPago}
                disabled={isSubmittingPago}
                icon={isSubmittingPago ? undefined : <CheckCircle2 size={16} />}
              >
                {isSubmittingPago ? "Procesando..." : "Confirmar y Generar Boleta"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Boleta */}
      {boletaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-150">
            <button 
              onClick={() => setBoletaActiva(null)}
              className="absolute top-3 right-3 p-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X size={16} />
            </button>
            
            <div className="p-5 text-center border-b border-dashed border-gray-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <h2 className="font-serif text-base font-bold text-gray-900 mb-0.5">¡Pago Exitoso!</h2>
              <p className="text-[10px] text-gray-400 font-mono">Comprobante electrónico generado</p>
            </div>

            <div className="p-5 bg-[#FDFCF9] font-mono text-xs text-left">
              <div className="text-center mb-4">
                <p className="font-serif font-bold text-sm text-akaza-marron mb-0.5">AKAZA RESTAURANT</p>
                <p className="text-[9px] text-gray-500">Av. Principal 123, Ciudad</p>
                <p className="text-[9px] text-gray-500">RUC: 20123456789</p>
              </div>
              
              <div className="border-t border-b border-dashed border-gray-300 py-2 mb-3 space-y-0.5 text-[10px]">
                <p className="flex justify-between"><span>Boleta:</span> <strong>B001-{boletaActiva.id.split('-')[1] || boletaActiva.id_bd}</strong></p>
                <p className="flex justify-between"><span>Fecha:</span> <span>{boletaActiva.fecha} {boletaActiva.hora}</span></p>
                <p className="flex justify-between"><span>Cliente:</span> <span>{boletaActiva.cliente}</span></p>
              </div>

              <table className="w-full text-[10px] mb-3">
                <thead>
                  <tr className="border-b border-gray-200 font-bold">
                    <th className="text-left py-1">CANT</th>
                    <th className="text-left py-1">DESC</th>
                    <th className="text-right py-1">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-gray-200">
                  {boletaActiva.productos.map((prod, idx) => (
                    <tr key={idx}>
                      <td className="py-1 align-top font-bold">{prod.cantidad}</td>
                      <td className="py-1 pr-1">
                        {prod.nombre}
                        {prod.nota && <span className="block text-[8px] text-gray-400">({prod.nota})</span>}
                      </td>
                      <td className="py-1 text-right align-top font-bold">{(prod.cantidad * prod.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-0.5 text-[10px] text-right pt-2 border-t border-gray-200">
                <p className="flex justify-end gap-3"><span className="text-gray-400">OP. GRAVADA:</span> <span>S/ {boletaActiva.subtotal.toFixed(2)}</span></p>
                <p className="flex justify-end gap-3"><span className="text-gray-400">IGV (18%):</span> <span>S/ {boletaActiva.igv.toFixed(2)}</span></p>
                <p className="flex justify-end gap-3 font-bold text-xs mt-1 text-akaza-marron"><span className="text-gray-900">TOTAL:</span> <span>S/ {boletaActiva.total.toFixed(2)}</span></p>
              </div>
            </div>

            <div className="p-3 bg-white flex gap-2 border-t border-gray-100">
              <Button 
                variant="secondary" 
                className="flex-1 justify-center py-2 text-xs"
                onClick={() => setBoletaActiva(null)}
              >
                Cerrar
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 justify-center py-2 text-xs"
                icon={<Printer size={14} />}
                onClick={() => {
                  alert("Imprimiendo ticket...");
                  setBoletaActiva(null);
                }}
              >
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
