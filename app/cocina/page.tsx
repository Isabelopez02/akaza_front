"use client";

import { useMemo, useState, useEffect } from "react";
import { Clock, Flame, CheckCircle2, ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AdminService } from "@/services/admin.service";

type EstadoPedido = "En proceso" | "Listo";

const KPI_CONFIG = [
  { label: "En Proceso",  valor: 0, key: "En proceso",  icon: Flame,        color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-100" },
  { label: "Listos",      valor: 0, key: "Listo",       icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-100" },
];

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      const [pedidosData, platosData, combosData] = await Promise.all([
        AdminService.getPedidos(),
        AdminService.getPlatos(),
        AdminService.getCombos(),
      ]);

      const mapped = (pedidosData || []).map((p: any) => {
        const productosList = (p.detalles || []).map((det: any) => {
          let name = "Plato";
          if (det.id_plato) {
            const matched = platosData.find((x: any) => x.id === det.id_plato);
            if (matched) name = matched.nombre;
          } else if (det.id_combo) {
            const matched = combosData.find((x: any) => x.id === det.id_combo);
            if (matched) name = matched.nombre;
          }
          return `${det.cantidad}x ${name}`;
        });

        // Agrupar todo pedido no completado ("ESPERA", "PREPARANDO", etc.) en "En proceso"
        let estadoText: EstadoPedido = "En proceso";
        if (p.estado_cocina === "LISTO" || p.estado_cocina === "Listo") {
          estadoText = "Listo";
        }

        const horaStr = p.fecha_venta
          ? new Date(p.fecha_venta).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
          : "—";

        return {
          id: p.id,
          mesa: p.nro_mesa,
          cliente: p.usuario?.nombre || p.usuario?.correo || "Cliente Casual",
          productos: productosList,
          estado: estadoText,
          estadoRaw: p.estado_cocina,
          hora: horaStr,
        };
      });

      // Filtrar sólo pedidos que estén activos en cocina (ESPERA, PREPARANDO, LISTO)
      // Excluimos cancelados y entregados
      const activos = mapped.filter((p: any) => p.estadoRaw !== "CANCELADO" && p.estadoRaw !== "ENTREGADO");
      setPedidos(activos.reverse());
    } catch (error) {
      console.error("Error al cargar pedidos de cocina:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 10_000); // Polling cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const kpis = useMemo(() => KPI_CONFIG.map(k => ({
    ...k,
    valor: pedidos.filter(p => p.estado === k.key).length,
  })), [pedidos]);

  const recientes = pedidos.slice(0, 5);

  return (
    <div className="admin-page-container space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-akaza-marron tracking-tight">Dashboard Cocina</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Resumen del estado de producción actual (2 Estados: En Proceso / Listo).</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {kpis.map(({ label, valor, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} shadow-sm p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-2xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              {loading ? (
                <div className="h-6 w-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-black text-akaza-marron leading-none">{valor}</p>
              )}
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${color}`}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pedidos Recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-akaza-marron opacity-80" />
            <h2 className="text-base font-black text-akaza-marron tracking-tight">Pedidos Activos en Curso</h2>
          </div>
          <Link href="/cocina/pedidos" className="flex items-center gap-1 text-[10px] font-bold text-akaza-marron/60 hover:text-akaza-marron transition-colors uppercase tracking-widest">
            Ir al Tablero <ChevronRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 w-full rounded-xl bg-gray-50 animate-pulse" />)}
          </div>
        ) : recientes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs font-semibold">
            No hay pedidos activos en este momento.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recientes.map(pedido => {
              const estado = pedido.estado;
              const color = estado === "En proceso" ? "text-orange-600" : "text-emerald-600";
              const bg = estado === "En proceso" ? "bg-orange-50 border-orange-100" : "bg-emerald-50 border-emerald-100";
              const Icon = estado === "En proceso" ? Flame : CheckCircle2;

              return (
                <div key={pedido.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-akaza-crema border border-akaza-marron/10 flex items-center justify-center text-sm font-black text-akaza-marron">
                      {pedido.mesa}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Mesa {pedido.mesa} — {pedido.cliente}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{pedido.productos.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pedido.hora && (
                      <div className="hidden sm:flex items-center gap-1">
                        <Clock size={10} className="text-gray-300" />
                        <span className="text-[9px] text-gray-400 font-bold">{pedido.hora}</span>
                      </div>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${bg} ${color}`}>
                      <Icon size={11} />{estado}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}