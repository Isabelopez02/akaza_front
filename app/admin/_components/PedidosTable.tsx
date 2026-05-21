"use client";
import { useState, useEffect } from "react";
import { Mic, ShoppingBag, ChefHat, Circle } from "lucide-react";

function tiempoTranscurrido(fechaStr: string): string {
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

const ESTADO_BADGE: Record<string, string> = {
  ESPERA:     "bg-yellow-50 text-yellow-700 border border-yellow-200",
  PREPARANDO: "bg-blue-50 text-blue-700 border border-blue-200",
  LISTO:      "bg-green-50 text-green-700 border border-green-200",
  ENTREGADO:  "bg-gray-100 text-gray-500 border border-gray-200",
  CANCELADO:  "bg-red-50 text-red-500 border border-red-200",
};

const ESTADO_LABEL: Record<string, string> = {
  ESPERA: "En Espera", PREPARANDO: "En Cocina",
  LISTO: "Listo", ENTREGADO: "Entregado", CANCELADO: "Cancelado",
};

export interface PedidoVivo {
  id: number;
  ticket: string;
  nro_mesa: number;
  estado_cocina: string;
  estado_pago: string;
  total: number;
  fecha_venta: string;
  origen: "IA" | "Manual";
}

interface Props {
  pedidos: PedidoVivo[];
  loading?: boolean;
}

export function PedidosTable({ pedidos, loading }: Props) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-2 h-2">
            <Circle size={8} className="text-green-500 fill-green-500" />
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
          </div>
          <div>
            <h2 className="font-black text-akaza-marron text-base leading-none">Pedidos en Curso</h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Monitoreo en tiempo real</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-gray-400">{pedidos.length} activos</span>
      </div>

      {loading ? (
        <div className="p-5 space-y-3 flex-1">
          {[1, 2, 3].map(i => <div key={i} className="h-12 w-full rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <ChefHat size={32} className="text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm font-medium">Sin pedidos activos en este momento</p>
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-50">
                {["Pedido", "Mesa", "Origen", "Estado", "Total", "Tiempo"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-black text-akaza-marron">{p.ticket ?? `#${p.id}`}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-gray-600">Mesa {p.nro_mesa}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.origen === "IA" ? "bg-akaza-marron/5 text-akaza-marron border border-akaza-marron/10" : "bg-gray-100 text-gray-500"}`}>
                      {p.origen === "IA" ? <Mic size={10} /> : <ShoppingBag size={10} />}
                      {p.origen === "IA" ? "Akaza IA" : "Manual"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ESTADO_BADGE[p.estado_cocina] ?? "bg-gray-100 text-gray-400"}`}>
                      {ESTADO_LABEL[p.estado_cocina] ?? p.estado_cocina}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-black text-akaza-marron">S/ {Number(p.total).toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-bold text-gray-400">
                      {p.fecha_venta ? tiempoTranscurrido(p.fecha_venta) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
