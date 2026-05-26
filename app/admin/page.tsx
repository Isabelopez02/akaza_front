"use client";
import { useState, useEffect, useCallback } from "react";
import { DollarSign, ShoppingBag, ReceiptText, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { KpiCard } from "./_components/KpiCard";
import { VentasSemanaChart } from "./_components/VentasSemanaChart";
import { RankingPlatosChart } from "./_components/RankingPlatosChart";
import { PreferenciasPanel } from "./_components/PreferenciasPanel";
import { PedidosTable, type PedidoVivo } from "./_components/PedidosTable";
import { IAEficiencia } from "./_components/IAEficiencia";

// ─── Types ────────────────────────────────────────────────────────────────────
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
  ia_personas_interactuaron?: number;
  ia_pedidos?: number;
  ia_pedidos_manual?: number;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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
        new Promise((resolve) => setTimeout(resolve, 300)) // Force at least 300ms loading!
      ]);
      setStats(data);
      const enriched = (pedidosData as any[]).map((p: any) => ({
        ...p,
        origen: p.ticket?.startsWith("IA") ? "IA" : "Manual",
      })) as PedidoVivo[];
      setPedidos(enriched.filter(p => p.estado_cocina !== "CANCELADO").slice(-20).reverse());
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
    <div className="admin-page-container space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-akaza-marron tracking-tight">Panel de Control</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-akaza-marron text-white rounded-xl text-xs font-bold hover:bg-akaza-marron/90 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {/* ── Fila 1: KPIs ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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
          badgeClass="bg-red-50 text-red-500"
          iconClass="bg-red-50 border-red-100 text-red-500"
          loading={loading}
        />
        {/* Ganancia Neta — fondo dinámico */}
        <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between min-h-[128px] ${gananciaPos ? "bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-100" : "bg-gradient-to-br from-red-50 to-rose-50/50 border-red-100"}`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${gananciaPos ? "bg-green-100 border-green-200 text-green-700" : "bg-red-100 border-red-200 text-red-600"}`}>
              {gananciaPos ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownRight size={18} strokeWidth={2.5} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${gananciaPos ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {gananciaPos ? "POSITIVO" : "NEGATIVO"}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Ganancia Neta</p>
            {loading
              ? <div className="h-6 w-28 rounded-lg bg-gray-200 animate-pulse mt-1" />
              : <p className={`text-[1.15rem] font-black tracking-tight ${gananciaPos ? "text-green-700" : "text-red-600"}`}>S/ {gananciaNeta.toFixed(2)}</p>
            }
            <p className="text-[11px] text-gray-400 font-medium mt-1">Ventas − Gastos del día</p>
          </div>
        </div>
      </div>

      {/* ── Fila 2: Operaciones en tiempo real ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: 340 }}>
        <div className="lg:col-span-2">
          <VentasSemanaChart data={s?.ventas_semana ?? []} loading={loading} />
        </div>
        <IAEficiencia 
          pedidos={pedidos} 
          loading={loading} 
          iaPersonas={s?.ia_personas_interactuaron}
          iaPedidos={s?.ia_pedidos}
          iaPedidosManual={s?.ia_pedidos_manual}
        />
      </div>
    </div>
  );
}
