"use client";

import { useMemo, useState } from "react";
import { Clock, Flame, CheckCircle2, AlertCircle, ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";

type EstadoPedido = "Pendiente" | "En proceso" | "Listo";

const MOCK_PEDIDOS = [
  { id: 1, mesa: 4, cliente: "Carlos", productos: ["2 Hamburguesas", "1 Inka Cola"], estado: "Pendiente" as EstadoPedido, hora: "12:05" },
  { id: 2, mesa: 7, cliente: "Andrea", productos: ["1 Pizza Familiar"], estado: "En proceso" as EstadoPedido, hora: "12:10" },
  { id: 3, mesa: 2, cliente: "Luis", productos: ["1 Lomo Saltado"], estado: "Listo" as EstadoPedido, hora: "12:00" },
];

const KPI_CONFIG = [
  { label: "Pendientes",  valor: 0, key: "Pendiente",   icon: AlertCircle,  color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-100" },
  { label: "En Proceso",  valor: 0, key: "En proceso",  icon: Flame,        color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-100" },
  { label: "Listos",      valor: 0, key: "Listo",       icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-100" },
];

export default function CocinaPage() {
  const [pedidos] = useState(MOCK_PEDIDOS);

  const kpis = useMemo(() => KPI_CONFIG.map(k => ({
    ...k,
    valor: pedidos.filter(p => p.estado === k.key).length,
  })), [pedidos]);

  const recientes = pedidos.slice(0, 3);

  return (
    <div className="admin-page-container space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-akaza-marron tracking-tight">Dashboard Cocina</h1>
        <p className="text-xs text-gray-400 font-medium mt-1">Resumen del estado de producción actual.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map(({ label, valor, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} shadow-sm p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-2xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-black text-akaza-marron leading-none">{valor}</p>
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
            <h2 className="text-base font-black text-akaza-marron tracking-tight">Pedidos Recientes</h2>
          </div>
          <Link href="/cocina/pedidos" className="flex items-center gap-1 text-[10px] font-bold text-akaza-marron/60 hover:text-akaza-marron transition-colors uppercase tracking-widest">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {recientes.map(pedido => {
            const estado = pedido.estado;
            const color = estado === "Pendiente" ? "text-amber-600" : estado === "En proceso" ? "text-orange-600" : "text-emerald-600";
            const bg = estado === "Pendiente" ? "bg-amber-50 border-amber-100" : estado === "En proceso" ? "bg-orange-50 border-orange-100" : "bg-emerald-50 border-emerald-100";
            const Icon = estado === "Pendiente" ? AlertCircle : estado === "En proceso" ? Flame : CheckCircle2;

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
      </div>
    </div>
  );
}