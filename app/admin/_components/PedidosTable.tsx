"use client";

import { useState, useEffect } from "react";
import { Mic, ShoppingBag, ChefHat, Circle, Utensils } from "lucide-react";

function tiempoTranscurrido(fechaStr: string): string {
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

const ESTADO_BADGE: Record<string, string> = {
  ESPERA: "bg-amber-50 text-amber-700 border border-amber-200",
  PREPARANDO: "bg-blue-50 text-blue-700 border border-blue-200",
  LISTO: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  ENTREGADO: "bg-gray-100 text-gray-500 border border-gray-200",
  CANCELADO: "bg-rose-50 text-rose-600 border border-rose-200",
};

const ESTADO_LABEL: Record<string, string> = {
  ESPERA: "En Espera",
  PREPARANDO: "En Cocina",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
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
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden flex flex-col h-full text-left">
      {/* Cabecera de la Sección */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="relative w-2 h-2">
            <Circle size={8} className="text-emerald-500 fill-emerald-500" />
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          </div>
          <div>
            <h2 className="font-serif text-xs sm:text-sm font-bold text-akaza-marron leading-none">
              Pedidos en Curso
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Monitoreo en tiempo real</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {pedidos.length} activos
        </span>
      </div>

      {/* Contenido: Tarjetas Horizontales Compactas */}
      {loading ? (
        <div className="p-3 space-y-2 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <ChefHat size={28} className="text-gray-300 mb-2" />
          <p className="text-gray-400 text-xs font-medium">Sin pedidos activos en este momento</p>
        </div>
      ) : (
        <div className="p-3 flex-1 overflow-y-auto max-h-[360px] custom-scrollbar space-y-2.5">
          {pedidos.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-150 hover:border-akaza-marron/30 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-1.5 group"
            >
              {/* Fila 1: Mesa, Ticket y Origen */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xs font-bold text-akaza-marron">
                    Mesa {p.nro_mesa}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {p.ticket || `#${p.id}`}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                    p.origen === "IA"
                      ? "bg-akaza-marron/10 text-akaza-marron border border-akaza-marron/20"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p.origen === "IA" ? <Mic size={9} /> : <ShoppingBag size={9} />}
                  <span>{p.origen === "IA" ? "Akaza IA" : "Manual"}</span>
                </div>
              </div>

              {/* Fila 2: Estado, Tiempo y Monto Total */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      ESTADO_BADGE[p.estado_cocina] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ESTADO_LABEL[p.estado_cocina] ?? p.estado_cocina}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 font-medium">
                    {p.fecha_venta ? tiempoTranscurrido(p.fecha_venta) : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Utensils size={11} className="text-akaza-marron/40" />
                  <span className="font-serif text-xs font-black text-akaza-marron">
                    S/ {Number(p.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
