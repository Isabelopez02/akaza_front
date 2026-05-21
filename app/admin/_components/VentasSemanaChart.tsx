"use client";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MARRON = "#3B1F0F";
const AMARILLO = "#F5C518";
const GASTO = "#E07856";
const GANANCIA = "#43A047";

const VentasTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl px-3 py-2">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      {payload.map((item: any, idx: number) => (
        <p key={idx} className="text-xs font-black text-gray-700">
          {item.name}: <span className="text-akaza-marron">S/ {Number(item.value).toFixed(0)}</span>
        </p>
      ))}
    </div>
  );
};

interface Props {
  data: { dia: string; fecha: string; total: number; gasto?: number; ganancia?: number }[];
  loading?: boolean;
}

export function VentasSemanaChart({ data, loading }: Props) {
  const chartData = data.map((item) => ({
    ...item,
    gasto: item.gasto || Math.round(item.total * 0.35),
    ganancia: item.ganancia || Math.round(item.total * 0.65)
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-black text-akaza-marron text-base">Ventas de la Semana</h2>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Últimos 7 días (soles)</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-akaza-marron/[0.04] flex items-center justify-center text-akaza-marron">
          <TrendingUp size={16} />
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="flex gap-4 mb-4 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MARRON }} />
          <span className="font-semibold text-gray-600">Ventas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GASTO }} />
          <span className="font-semibold text-gray-600">Gasto</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GANANCIA }} />
          <span className="font-semibold text-gray-600">Ganancia</span>
        </div>
      </div>

      {loading ? (
        <div className="h-52 w-full rounded-2xl bg-gray-100 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={MARRON} stopOpacity={0.18} />
                <stop offset="95%" stopColor={MARRON} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradGasto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GASTO} stopOpacity={0.12} />
                <stop offset="95%" stopColor={GASTO} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradGanancia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GANANCIA} stopOpacity={0.12} />
                <stop offset="95%" stopColor={GANANCIA} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="dia" tick={{ fontSize: 11, fontWeight: 700, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/${v}`} />
            <Tooltip content={<VentasTooltip />} />
            <Area type="monotone" dataKey="total" stroke={MARRON} strokeWidth={2.5} fill="url(#gradVentas)" name="Ventas"
              dot={{ r: 3, fill: MARRON, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: AMARILLO, stroke: MARRON, strokeWidth: 2 }}
            />
            <Area type="monotone" dataKey="gasto" stroke={GASTO} strokeWidth={2.5} fill="url(#gradGasto)" name="Gasto"
              dot={{ r: 3, fill: GASTO, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area type="monotone" dataKey="ganancia" stroke={GANANCIA} strokeWidth={2.5} fill="url(#gradGanancia)" name="Ganancia"
              dot={{ r: 3, fill: GANANCIA, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
