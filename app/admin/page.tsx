"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, ShoppingBag, ReceiptText, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { KpiCard } from "./_components/KpiCard";
import { VentasSemanaChart } from "./_components/VentasSemanaChart";
import { PedidosTable, type PedidoVivo } from "./_components/PedidosTable";

interface DashboardStats {
  ventas_hoy: number;
  ventas_ayer: number;
  diferencia_ventas_pct: number;
  pedidos_hoy: number;
  pedidos_ayer: number;
  diferencia_pedidos_pct: number;
  plato_popular: string;
  plato_popular_ventas: number;
  plato_menos_popular: string;
  plato_menos_ventas: number;
  ventas_semana: { dia: string; fecha: string; total: number }[];
  ranking_platos: { nombre: string; ventas: number }[];
  gastos_hoy: number;
  total_platos_hoy: number;
  ganancia_neta: number;
  combos_vs_platos: { name: string; value: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pedidos, setPedidos] = useState<PedidoVivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [data, pedidosData] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getPedidos(),
        new Promise((resolve) => setTimeout(resolve, 250))
      ]);
      setStats(data);
      const hoyString = new Date().toDateString();
      const enriched = (pedidosData as any[]).map((p: any) => ({
        ...p,
        origen: p.ticket?.startsWith("IA") ? "IA" : "Manual",
      })) as PedidoVivo[];

      const pedidosHoy = enriched.filter((p) => {
        if (p.estado_cocina === "CANCELADO") return false;
        if (!p.fecha_venta) return false;
        const fechaPedido = new Date(p.fecha_venta).toDateString();
        return fechaPedido === hoyString;
      });

      setPedidos(pedidosHoy.slice(-20).reverse());
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const s = stats;
  const ventasEmpty = !s || (s.ventas_hoy === 0 && s.ventas_ayer === 0);
  const pedidosEmpty = !s || (s.pedidos_hoy === 0 && s.pedidos_ayer === 0);
  const gananciaNeta = s?.ganancia_neta ?? 0;
  const gananciaPos = gananciaNeta >= 0;

  return (
    <div className="admin-page-container space-y-5 animate-in fade-in duration-300">

      {/* ── HEADER DE DASHBOARD ── */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="font-serif text-lg sm:text-xl font-bold text-akaza-marron tracking-tight">
            Panel de Control Executive
          </h1>
          <p className="text-gray-400 text-xs font-medium mt-0.5">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-akaza-marron text-white rounded-xl text-xs font-serif font-bold hover:bg-black transition-all disabled:opacity-50 shadow-xs"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* ── FILA 1: TARJETAS KPI COMPACTAS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={DollarSign}
          label="Ventas Totales"
          value={`S/ ${(s?.ventas_hoy ?? 0).toFixed(2)}`}
          sub={`Ayer: S/ ${(s?.ventas_ayer ?? 0).toFixed(2)}`}
          pct={s?.diferencia_ventas_pct ?? 0}
          positive={(s?.diferencia_ventas_pct ?? 0) >= 0}
          emptyState={ventasEmpty}
          loading={loading}
        />
        <KpiCard
          icon={ShoppingBag}
          label="Pedidos Hoy"
          value={`${s?.pedidos_hoy ?? 0}`}
          sub={`Ayer: ${s?.pedidos_ayer ?? 0} pedidos`}
          pct={s?.diferencia_pedidos_pct ?? 0}
          positive={(s?.diferencia_pedidos_pct ?? 0) >= 0}
          emptyState={pedidosEmpty}
          loading={loading}
        />
        <KpiCard
          icon={ReceiptText}
          label="Gastos del Día"
          value={`S/ ${(s?.gastos_hoy ?? 0).toFixed(2)}`}
          sub={`${s?.total_platos_hoy ?? 0} platos despachados`}
          badgeText="HOY"
          badgeClass="bg-red-50 text-red-600 border border-red-200"
          iconClass="bg-red-50 border-red-100 text-red-500"
          loading={loading}
        />

        {/* Ganancia Neta Compacta */}
        <div className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[105px] ${gananciaPos ? "bg-emerald-50/40 border-emerald-200" : "bg-rose-50/40 border-rose-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${gananciaPos ? "bg-green-100 border-green-200 text-green-700" : "bg-red-100 border-red-200 text-red-600"}`}>
              {gananciaPos ? <ArrowUpRight size={16} strokeWidth={2.5} /> : <ArrowDownRight size={16} strokeWidth={2.5} />}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${gananciaPos ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {gananciaPos ? "POSITIVO" : "NEGATIVO"}
            </span>
          </div>

          <div className="text-left">
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Ganancia Neta
            </p>
            {loading ? (
              <div className="h-5 w-24 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className={`font-serif text-base sm:text-lg font-black tracking-tight leading-tight ${gananciaPos ? "text-green-700" : "text-red-600"}`}>
                S/ {gananciaNeta.toFixed(2)}
              </p>
            )}
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Ventas − Gastos</p>
          </div>
        </div>
      </div>

      {/* ── FILA 2: GRÁFICO DE VENTAS Y TABLA DE PEDIDOS EN CURSO EN VIVO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-6">
          <VentasSemanaChart data={s?.ventas_semana ?? []} loading={loading} />
        </div>
        <div className="lg:col-span-6">
          <PedidosTable pedidos={pedidos} loading={loading} />
        </div>
      </div>

    </div>
  );
}
