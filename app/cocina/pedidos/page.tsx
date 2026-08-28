"use client";

import { useState, useEffect } from "react";
import { Flame, CheckCircle2, ChevronRight, Clock, ChefHat } from "lucide-react";
import { AdminService } from "@/services/admin.service";
import { CocinaService } from "@/services/cocina.service";

type EstadoPedido = "En proceso" | "Listo";

interface Pedido {
  id: number;
  mesa: number;
  personas?: number;
  productos: string[];
  estado: EstadoPedido;
  estadoRaw: string;
  hora: string;
  cliente: string;
}

function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  if (estado === "En proceso") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest animate-pulse">
        <Flame size={12} className="animate-bounce" />
        En proceso
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-widest">
      <CheckCircle2 size={12} />
      Listo
    </span>
  );
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | EstadoPedido>("todos");

  const cargarPedidos = async () => {
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

        // Consolidar todos los estados no listos en "En proceso"
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

      // Omitir cancelados y entregados de la cocina
      const activos = mapped.filter((p: any) => p.estadoRaw !== "CANCELADO" && p.estadoRaw !== "ENTREGADO");
      setPedidos(activos.reverse());
    } catch (error) {
      console.error("Error cargando pedidos en tablero de cocina:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 10_000); // Polling cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const marcarListo = async (id: number) => {
    try {
      await CocinaService.listoPedido(id);
      await cargarPedidos();
    } catch (error) {
      console.error("Error al marcar pedido como listo:", error);
    }
  };

  const visible = filtro === "todos" ? pedidos : pedidos.filter(p => p.estado === filtro);

  const countProceso   = pedidos.filter(p => p.estado === "En proceso").length;
  const countListo     = pedidos.filter(p => p.estado === "Listo").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-akaza-marron tracking-tight">Tablero de Cocina</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {countProceso} en preparación · {countListo} completados hoy.
          </p>
        </div>

        {/* Filtro rápido */}
        <div className="flex items-center gap-2 bg-gray-150 p-1 rounded-2xl self-start sm:self-auto select-none">
          {(["todos", "En proceso", "Listo"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filtro === f
                  ? "bg-akaza-marron text-white shadow-md shadow-akaza-marron/10"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {f === "todos" ? "Todos" : f}
            </button>
          ))}
        </div>
      </div>

      {loading && pedidos.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 w-full rounded-[2rem] bg-white border border-gray-100 p-7 animate-pulse space-y-6">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-150 rounded w-3/4" />
                <div className="h-3 bg-gray-150 rounded w-1/2" />
              </div>
              <hr className="border-gray-50" />
              <div className="h-12 bg-gray-100 rounded-2xl w-full" />
            </div>
          ))}
        </div>
      ) : (
        /* Grid de cards grandes */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {visible.map(pedido => {
            const enProceso = pedido.estado === "En proceso";

            return (
              <div
                key={pedido.id}
                className={`bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-lg ${
                  enProceso ? "border-orange-100" : "border-emerald-100"
                }`}
              >
                {/* Franja superior de color */}
                <div className={`h-1.5 w-full ${enProceso ? "bg-orange-400" : "bg-emerald-400"}`} />

                <div className="p-7 flex flex-col gap-6 flex-1 justify-between">

                  {/* ─ Menú / Productos ──────────────── PRIMARY */}
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Productos a Preparar</p>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-150 shadow-sm Monospace">
                        Ticket: #{pedido.id}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {pedido.productos.map((prod, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            enProceso ? "bg-orange-400 animate-pulse" : "bg-emerald-400"
                          }`} />
                          <span className="text-lg font-black text-gray-800 leading-snug">{prod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-100" />

                  {/* ─ Meta info (mesa y hora) ────────── AL FINAL */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Mesa — grande y visible */}
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 shrink-0 ${
                        enProceso ? "border-orange-200 bg-orange-50" : "border-emerald-200 bg-emerald-50"
                      }`}>
                        <p className={`text-2xl font-black leading-none ${
                          enProceso ? "text-orange-600" : "text-emerald-600"
                        }`}>
                          {pedido.mesa}
                        </p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Mesa</p>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <p className="text-xs font-black text-gray-700 truncate max-w-[150px]">
                          {pedido.cliente}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-300" />
                          <span className="text-xs font-bold text-gray-400">{pedido.hora}</span>
                        </div>
                        <EstadoBadge estado={pedido.estado} />
                      </div>
                    </div>

                    {/* CTA de Cocinero: Un solo botón de Listo */}
                    {enProceso ? (
                      <button
                        onClick={() => marcarListo(pedido.id)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 py-3.5 rounded-2xl text-sm font-black transition-all shadow-md shadow-emerald-200"
                      >
                        <CheckCircle2 size={16} />
                        Listo
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-5 py-3.5 rounded-2xl text-sm font-black select-none">
                        <CheckCircle2 size={16} />
                        Completado
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {visible.length === 0 && (
            <div className="col-span-1 lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 py-20 flex flex-col items-center justify-center gap-3 shadow-sm select-none">
              <ChefHat size={40} className="text-gray-200 animate-bounce" />
              <p className="text-sm font-black text-akaza-marron uppercase tracking-widest">¡Todo al día chef!</p>
              <p className="text-[11px] text-gray-400 font-bold">No hay pedidos en la categoría: {filtro === "todos" ? "Todos" : filtro}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}