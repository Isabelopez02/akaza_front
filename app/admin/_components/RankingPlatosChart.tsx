"use client";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

const MARRON = "#3B1F0F";
const AMARILLO = "#F5C518";

const PlatosTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl px-4 py-3">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate max-w-[160px]">{label}</p>
      <p className="text-base font-black text-akaza-marron">{payload[0].value} vendidos</p>
    </div>
  );
};

interface Props {
  data: { nombre: string; ventas: number }[];
  loading?: boolean;
}

export function RankingPlatosChart({ data, loading }: Props) {
  const [asc, setAsc] = useState(false);
  const sorted = [...data].sort((a, b) => asc ? a.ventas - b.ventas : b.ventas - a.ventas);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-black text-akaza-marron text-base">Ranking de Platos</h2>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
            {asc ? "De menos a más popular" : "De más a menos popular"}
          </p>
        </div>
        <button
          onClick={() => setAsc(v => !v)}
          className="flex items-center gap-2 px-3 py-2 bg-akaza-marron/[0.04] hover:bg-akaza-marron/[0.08] text-akaza-marron rounded-xl text-[11px] font-bold transition-all"
        >
          <ArrowUpDown size={13} />
          {asc ? "Más popular primero" : "Menos popular primero"}
        </button>
      </div>

      {loading ? (
        <div className="h-64 w-full rounded-2xl bg-gray-100 animate-pulse" />
      ) : sorted.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12 font-medium">Sin datos de platos vendidos todavía.</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(240, sorted.length * 42)}>
          <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nombre" width={130} tick={{ fontSize: 11, fontWeight: 700, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip content={<PlatosTooltip />} />
            <Bar dataKey="ventas" radius={[0, 8, 8, 0]}>
              {sorted.map((_, i) => (
                <Cell key={i} fill={i === 0 && !asc ? AMARILLO : MARRON} fillOpacity={1 - i * (0.6 / Math.max(sorted.length, 1))} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
