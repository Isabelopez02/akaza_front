"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Award, 
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3
} from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { RankingPlatosChart } from "../_components/RankingPlatosChart";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data = await AdminService.getDashboardStats();
      setStats(data);
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
    <div className="admin-page-container space-y-5 animate-in fade-in duration-300">
      
      {/* ── HEADER DE REPORTES ── */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-akaza-marron" size={20} />
            <h1 className="font-serif text-lg sm:text-xl font-bold text-akaza-marron tracking-tight">
              Reporte Analítico Exec
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-medium mt-0.5">
            Métricas de preferencia y popularidad gastronómica
          </p>
        </div>

        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-akaza-marron text-white rounded-xl text-xs font-serif font-bold hover:bg-black transition-all disabled:opacity-50 shadow-xs"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* ── FILA 1: TARJETAS MÁS Y MENOS POPULAR COMPACTAS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tarjeta Plato Más Popular */}
        <div className="relative p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-200/40 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] group text-left">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 group-hover:scale-110 transition-transform duration-500 text-amber-600">
            <Award size={100} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700">
                <Award size={15} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-amber-900 uppercase">
                Más Popular
              </span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 shadow-2xs">
              TOP VENTAS
            </span>
          </div>

          <div className="mt-2.5 z-10">
            {loading ? (
              <div className="h-5 w-40 rounded bg-gray-200 animate-pulse mb-1" />
            ) : (
              <h3 className="font-serif text-base font-bold text-akaza-marron tracking-tight truncate">
                {s?.plato_popular || "—"}
              </h3>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp size={13} className="text-emerald-600" strokeWidth={2.5} />
              {loading ? (
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <span className="text-xs text-gray-600 font-semibold">
                  {s?.plato_popular_ventas || 0} unidades vendidas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta Plato Menos Popular */}
        <div className="relative p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-slate-500/10 to-gray-500/5 border border-slate-200/40 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] group text-left">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 group-hover:scale-110 transition-transform duration-500 text-slate-600">
            <AlertTriangle size={100} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-500/15 border border-slate-500/30 flex items-center justify-center text-slate-700">
                <AlertTriangle size={15} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-900 uppercase">
                Menos Popular
              </span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-900 shadow-2xs">
              BAJO FLUJO
            </span>
          </div>

          <div className="mt-2.5 z-10">
            {loading ? (
              <div className="h-5 w-40 rounded bg-gray-200 animate-pulse mb-1" />
            ) : (
              <h3 className="font-serif text-base font-bold text-slate-800 tracking-tight truncate">
                {s?.plato_menos_popular || "—"}
              </h3>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingDown size={13} className="text-amber-600" strokeWidth={2.5} />
              {loading ? (
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <span className="text-xs text-gray-600 font-semibold">
                  {s?.plato_menos_ventas || 0} unidades vendidas
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── FILA 2: ANALÍTICAS COMPACTAS (RANKING Y PREFERENCIAS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Gráfico Ranking de Platos (2/3 de ancho) */}
        <div className="lg:col-span-2">
          <RankingPlatosChart data={s?.ranking_platos ?? []} loading={loading} />
        </div>

        {/* Gráfico de Preferencias (1/3 de ancho) */}
        <div>
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs p-4 flex flex-col justify-between h-full min-h-[280px] text-left">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-lg bg-akaza-marron/5 flex items-center justify-center text-akaza-marron">
                  <PieIcon size={14} />
                </div>
                <h2 className="font-serif font-bold text-akaza-marron text-sm">Preferencia</h2>
              </div>
              <p className="text-[10px] text-gray-400 font-medium ml-8">Proporción Combos vs Platos</p>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center py-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse" />
              </div>
            ) : !s || !s.combos_vs_platos || s.combos_vs_platos.length === 0 ? (
              <p className="text-center text-gray-400 text-xs py-8 font-medium">Sin datos de preferencias.</p>
            ) : (
              <div className="flex flex-col flex-1 justify-center mt-2">
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={s.combos_vs_platos} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={40} 
                        outerRadius={60}
                        paddingAngle={3} 
                        dataKey="value" 
                        strokeWidth={0}
                      >
                        {s.combos_vs_platos.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: any, n: any) => [`${v} und.`, n]}
                        contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 11, fontWeight: 700 }}
                      />
                      <Legend 
                        iconType="circle" 
                        iconSize={7}
                        formatter={(v) => <span className="text-[10px] font-bold text-gray-500">{v}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 mt-1 text-center">
                  {s.combos_vs_platos.map((item, i) => (
                    <div key={item.name}>
                      <div className="w-2 h-2 rounded-full mx-auto mb-0.5" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">{item.name}</p>
                      <p className="font-serif text-xs font-bold text-akaza-marron">{item.value} und.</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
