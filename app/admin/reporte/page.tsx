"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Award, 
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3,
  ClipboardList
} from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { RankingPlatosChart } from "../_components/RankingPlatosChart";
import { PedidosTable, type PedidoVivo } from "../_components/PedidosTable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
}

const PIE_COLORS = ["#3B1F0F", "#F5C518"];

export default function ReportePage() {
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
      ]);
      setStats(data);
      const enriched = (pedidosData as any[]).map((p: any) => ({
        ...p,
        origen: p.ticket?.startsWith("IA") ? "IA" : "Manual",
      })) as PedidoVivo[];
      setPedidos(enriched.filter(p => p.estado_cocina !== "CANCELADO").slice(-20).reverse());
    } catch (err) {
      console.error("Error cargando reportes:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const s = stats;

  return (
    <div className="admin-page-container space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-akaza-marron" size={24} />
            <h1 className="text-xl font-black text-akaza-marron tracking-tight">Reporte Analítico</h1>
          </div>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            Métricas de popularidad, preferencia y operaciones en tiempo real
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

      {/* ── Fila 1: Tarjetas Más y Menos Popular ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta Plato Más Popular */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-200/30 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px] group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-amber-600">
            <Award size={140} />
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <Award size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black tracking-widest text-amber-800 uppercase">
                MÁS POPULAR
              </span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 shadow-sm">
              TOP VENTAS
            </span>
          </div>

          <div className="mt-4 z-10">
            {loading ? (
              <div className="h-6 w-48 rounded bg-gray-200 animate-pulse mb-1" />
            ) : (
              <h3 className="text-lg font-black text-akaza-marron tracking-tight truncate max-w-full">
                {s?.plato_popular || "—"}
              </h3>
            )}
            <div className="flex items-center gap-1.5 mt-1.5">
              <TrendingUp size={14} className="text-emerald-500" strokeWidth={2.5} />
              {loading ? (
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse mt-0.5" />
              ) : (
                <span className="text-xs text-gray-500 font-bold">
                  {s?.plato_popular_ventas || 0} unidades vendidas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta Plato Menos Popular */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-500/10 to-gray-500/5 border border-slate-200/30 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px] group">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-slate-600">
            <AlertTriangle size={140} />
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-600">
                <AlertTriangle size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black tracking-widest text-slate-800 uppercase">
                MENOS POPULAR
              </span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-900 shadow-sm">
              BAJO FLUJO
            </span>
          </div>

          <div className="mt-4 z-10">
            {loading ? (
              <div className="h-6 w-48 rounded bg-gray-200 animate-pulse mb-1" />
            ) : (
              <h3 className="text-lg font-black text-slate-700 tracking-tight truncate max-w-full">
                {s?.plato_menos_popular || "—"}
              </h3>
            )}
            <div className="flex items-center gap-1.5 mt-1.5">
              <TrendingDown size={14} className="text-amber-500" strokeWidth={2.5} />
              {loading ? (
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse mt-0.5" />
              ) : (
                <span className="text-xs text-gray-500 font-bold">
                  {s?.plato_menos_ventas || 0} unidades vendidas
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── Fila 2: Analíticas (Ranking y Preferencias) ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Ranking de Platos (2/3 de ancho) */}
        <div className="lg:col-span-2">
          <RankingPlatosChart data={s?.ranking_platos ?? []} loading={loading} />
        </div>

        {/* Gráfico de Preferencias (1/3 de ancho) */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between h-full min-h-[340px]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-akaza-marron/5 flex items-center justify-center text-akaza-marron">
                  <PieIcon size={15} />
                </div>
                <h2 className="font-black text-akaza-marron text-base">Preferencia</h2>
              </div>
              <p className="text-[11px] text-gray-400 font-medium ml-9">Proporción de Combos vs Platos individuales</p>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center py-8">
                <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse" />
              </div>
            ) : !s || !s.combos_vs_platos || s.combos_vs_platos.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12 font-medium">Sin datos de preferencias.</p>
            ) : (
              <div className="flex flex-col flex-1 justify-center mt-4">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={s.combos_vs_platos} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={50} 
                        outerRadius={75}
                        paddingAngle={4} 
                        dataKey="value" 
                        strokeWidth={0}
                      >
                        {s.combos_vs_platos.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: any, n: any) => [`${v} und.`, n]}
                        contentStyle={{ borderRadius: 14, border: "1px solid #f0f0f0", fontSize: 12, fontWeight: 700 }}
                      />
                      <Legend 
                        iconType="circle" 
                        iconSize={8}
                        formatter={(v) => <span className="text-[11px] font-bold text-gray-500">{v}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Sección Totales */}
                <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4 mt-2">
                  {s.combos_vs_platos.map((item, i) => (
                    <div key={item.name} className="text-center">
                      <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</p>
                      <p className="text-sm font-black text-akaza-marron">{item.value} und.</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Fila 3: Pedidos en Curso ──────────────────────────────────────── */}
      <div className="w-full">
        <div className="min-h-[280px]">
          <PedidosTable pedidos={pedidos} loading={loading} />
        </div>
      </div>

    </div>
  );
}
