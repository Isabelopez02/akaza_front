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
import { PageHeader } from "@/component/admin/PageHeader";
import { Button } from "@/component/admin/Button";
import { AdminService } from "@/service/admin.service";

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
  const [isLoading, setIsLoading] = useState(false);
  
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
      const ps = await AdminService.getPlatos();
      const cs = await AdminService.getCombos();
      setPlatos(ps);
      setCombos(cs);

      const data = await AdminService.getPedidos();
      
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
          subtotal: d.total / 1.18,
          igv: d.total - (d.total / 1.18),
          total: d.total,
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
      await AdminService.pagarPedido(pedidoAPagar.id_bd, payload);
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
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-100">
            <Clock size={12} strokeWidth={3} />
            Pendiente
          </span>
        );
      case "pagado":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
            <CheckCircle2 size={12} strokeWidth={3} />
            Pagado
          </span>
        );
      case "anulado":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
            <XCircle size={12} strokeWidth={3} />
            Anulado
          </span>
        );
    }
  };

  return (
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-akaza-marron to-black p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-white/60 text-[11px] font-black uppercase tracking-widest mb-1">Total Recaudado Hoy</p>
            <p className="text-3xl font-black text-white tracking-tight">S/ {Number(totalVentasDia || 0).toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Pedidos Pagados</p>
            <p className="text-3xl font-black text-akaza-marron tracking-tight">{cantidadPedidosPagados}</p>
          </div>
          <div className="w-12 h-12 bg-akaza-marron/5 rounded-2xl flex items-center justify-center text-akaza-marron border border-akaza-marron/10">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
          <div>
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Tickets Pendientes</p>
            <p className="text-3xl font-black text-yellow-600 tracking-tight">
              {pedidosFiltrados.filter(p => p.estado === "pendiente").length}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 border border-yellow-100">
            <Clock size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative group flex-1 max-w-xs">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative group min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as any)}
              className="w-full pl-9 pr-8 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-akaza-marron/10"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="pagado">Pagados</option>
              <option value="anulado">Anulados</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akaza-marron"></div>
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl">
          <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-sm font-bold text-gray-900">No hay pedidos</h3>
          <p className="text-xs text-gray-500 mt-1">No se encontraron ventas para esta fecha.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pedidosFiltrados.map((pedido) => (
            <div 
              key={pedido.id_bd} 
              className={`bg-white rounded-2xl border ${pedido.estado === 'pagado' ? 'border-green-100' : 'border-gray-200'} shadow-sm overflow-hidden relative group`}
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-akaza-marron">{pedido.id}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{pedido.fecha} • {pedido.hora}</p>
                  </div>
                  {getEstadoBadge(pedido.estado)}
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-gray-700">{pedido.mesa}</p>
                  <p className="text-[11px] text-gray-500">{pedido.cliente}</p>
                </div>
              </div>

              <div className="p-4 bg-white min-h-[120px]">
                <ul className="space-y-3">
                  {pedido.productos.map((prod, idx) => (
                    <li key={idx} className="flex flex-col text-xs">
                      <div className="flex justify-between w-full">
                        <div className="flex gap-2">
                          <span className="font-bold text-gray-400">{prod.cantidad}x</span>
                          <span className="font-medium text-gray-700">{prod.nombre}</span>
                        </div>
                        <span className="font-bold text-gray-900">S/ {(prod.cantidad * prod.precio_unitario).toFixed(2)}</span>
                      </div>
                      {prod.nota && (
                        <p className="text-[10px] text-gray-400 italic mt-1 ml-6 bg-gray-50 px-2 py-1 rounded">
                          Nota: {prod.nota}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border-t border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">Total</span>
                  <span className="text-xl font-black text-akaza-marron">S/{(parseFloat(pedido.total) || 0).toFixed(2)}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  {pedido.estado === "pendiente" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="primary" 
                        className="flex-1 justify-center py-2.5"
                        onClick={() => setPedidoAPagar(pedido)}
                        icon={<DollarSign size={14} />}
                      >
                        Cobrar
                      </Button>
                      <button 
                        onClick={() => handleAnular(pedido.id_bd)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                        title="Anular"
                      >
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                  {pedido.estado === "pagado" && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="w-full justify-center py-2.5"
                      onClick={() => setBoletaActiva(pedido)}
                      icon={<Receipt size={14} />}
                    >
                      Ver Boleta
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="absolute -left-2 top-[76px] w-4 h-4 bg-[#f8f9fa] rounded-full border-r border-gray-200"></div>
              <div className="absolute -right-2 top-[76px] w-4 h-4 bg-[#f8f9fa] rounded-full border-l border-gray-200"></div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Pago */}
      {pedidoAPagar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Wallet className="text-akaza-marron" size={20} />
                Confirmar Pago
              </h2>
              <button 
                onClick={() => setPedidoAPagar(null)}
                className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-8">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Monto a Cobrar</p>
                <p className="text-4xl font-black text-akaza-marron">S/ {Number(pedidoAPagar?.total || 0).toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-2">{pedidoAPagar.id} • {pedidoAPagar.mesa}</p>
              </div>

              <p className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Método de Pago</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button 
                  onClick={() => setMetodoPago("EFECTIVO")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${metodoPago === 'EFECTIVO' ? 'border-akaza-marron bg-akaza-marron/5 text-akaza-marron' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <Banknote size={20} />
                  <span className="text-[10px] font-black uppercase">Efectivo</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("YAPE")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${metodoPago === 'YAPE' ? 'border-[#742384] bg-[#742384]/5 text-[#742384]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <CreditCard size={20} />
                  <span className="text-[10px] font-black uppercase">Yape/Plin</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("TARJETA")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${metodoPago === 'TARJETA' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <CreditCard size={20} />
                  <span className="text-[10px] font-black uppercase">Tarjeta</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("MIXTO")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${metodoPago === 'MIXTO' ? 'border-gray-800 bg-gray-50 text-gray-800' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <Wallet size={20} />
                  <span className="text-[10px] font-black uppercase">Mixto</span>
                </button>
              </div>

              {metodoPago === "MIXTO" && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 space-y-3">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Distribuir Pago</p>
                  <div className="flex items-center gap-3">
                    <label className="w-20 text-xs font-bold text-gray-700">Efectivo S/</label>
                    <input 
                      type="number" 
                      value={montoEfectivo} 
                      onChange={(e) => setMontoEfectivo(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-black outline-none focus:ring-2 focus:ring-akaza-marron/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-20 text-xs font-bold text-[#742384]">Yape S/</label>
                    <input 
                      type="number" 
                      value={montoYape} 
                      onChange={(e) => setMontoYape(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-black outline-none focus:ring-2 focus:ring-akaza-marron/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-20 text-xs font-bold text-blue-600">Tarjeta S/</label>
                    <input 
                      type="number" 
                      value={montoTarjeta} 
                      onChange={(e) => setMontoTarjeta(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-black outline-none focus:ring-2 focus:ring-akaza-marron/20"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <Button 
                size="lg" 
                variant="primary" 
                className="w-full justify-center py-4 text-sm"
                onClick={confirmarPago}
                disabled={isSubmittingPago}
                icon={isSubmittingPago ? undefined : <CheckCircle2 size={18} />}
              >
                {isSubmittingPago ? "Procesando..." : "Confirmar y Generar Boleta"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Boleta */}
      {boletaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setBoletaActiva(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X size={16} />
            </button>
            
            <div className="p-8 pt-10 text-center border-b border-dashed border-gray-300 relative">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-1">¡Pago Exitoso!</h2>
              <p className="text-xs text-gray-500">Se ha generado el comprobante</p>
            </div>

            <div className="p-8 bg-[#fdfbf7] font-mono text-sm relative">
              <div className="text-center mb-6">
                <p className="font-bold text-lg mb-1">AKAZA RESTAURANT</p>
                <p className="text-xs text-gray-500">Av. Principal 123, Ciudad</p>
                <p className="text-xs text-gray-500">RUC: 20123456789</p>
              </div>
              
              <div className="border-t border-b border-dashed border-gray-300 py-3 mb-4 space-y-1 text-xs">
                <p className="flex justify-between"><span>Boleta:</span> <strong>B001-{boletaActiva.id.split('-')[1] || boletaActiva.id_bd}</strong></p>
                <p className="flex justify-between"><span>Fecha:</span> <span>{boletaActiva.fecha} {boletaActiva.hora}</span></p>
                <p className="flex justify-between"><span>Cliente:</span> <span>{boletaActiva.cliente}</span></p>
              </div>

              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-normal">CANT</th>
                    <th className="text-left py-2 font-normal">DESC</th>
                    <th className="text-right py-2 font-normal">IMPORTE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-gray-200">
                  {boletaActiva.productos.map((prod, idx) => (
                    <tr key={idx}>
                      <td className="py-2 align-top">{prod.cantidad}</td>
                      <td className="py-2 pr-2">
                        {prod.nombre}
                        {prod.nota && <span className="block text-[10px] text-gray-500 mt-0.5">({prod.nota})</span>}
                      </td>
                      <td className="py-2 text-right align-top">{(prod.cantidad * prod.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-xs text-right">
                <p className="flex justify-end gap-4"><span className="text-gray-500">OP. GRAVADA:</span> <span>S/ {boletaActiva.subtotal.toFixed(2)}</span></p>
                <p className="flex justify-end gap-4"><span className="text-gray-500">IGV (18%):</span> <span>S/ {boletaActiva.igv.toFixed(2)}</span></p>
                <p className="flex justify-end gap-4 text-base font-bold mt-2"><span className="text-gray-900">TOTAL:</span> <span>S/ {boletaActiva.total.toFixed(2)}</span></p>
              </div>

              <div className="text-center mt-8 text-[10px] text-gray-400">
                <p>¡Gracias por su preferencia!</p>
                <p>Vuelva pronto</p>
              </div>
            </div>

            <div className="p-4 bg-white flex gap-3 border-t border-gray-100">
              <Button 
                variant="secondary" 
                className="flex-1 justify-center"
                onClick={() => setBoletaActiva(null)}
              >
                Cerrar
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 justify-center"
                icon={<Printer size={16} />}
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
