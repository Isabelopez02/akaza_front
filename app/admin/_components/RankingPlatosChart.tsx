"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

const MARRON = "#3B1F0F";
const AMARILLO = "#F5C518";

const PlatosTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md px-3 py-2">
      <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-0.5 truncate max-w-[150px]">
        {label}
      </p>
      <p className="font-serif text-xs font-bold text-akaza-marron">
        {payload[0].value} vendidos
      </p>
    </div>
  );
};

interface Props {
  data: { nombre: string; ventas: number }[];
  loading?: boolean;
}

export function RankingPlatosChart({ data, loading }: Props) {
  const [asc, setAsc] = useState(false);
  const sorted = [...data].sort((a, b) => (asc ? a.ventas - b.ventas : b.ventas - a.ventas));

  return (
    <div className="bg-white rounded-xl border border-gray-150 shadow-2xs p-4 text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-sm sm:text-base font-bold text-akaza-marron">
            Ranking de Platos
          </h2>
          <p className="text-[10px] text-gray-400 font-medium">
            {asc ? "De menos a más popular" : "De más a menos popular"}
          </p>
        </div>

        <button
          onClick={() => setAsc((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-akaza-marron/5 hover:bg-akaza-marron/10 text-akaza-marron rounded-lg text-[10px] font-bold transition-all"
        >
          <ArrowUpDown size={12} />
          <span>{asc ? "Más popular" : "Menos popular"}</span>
        </button>
      </div>

      {loading ? (
        <div className="h-48 w-full rounded-xl bg-gray-100 animate-pulse" />
      ) : sorted.length === 0 ? (
        <p className="text-center text-gray-400 text-xs py-8 font-medium">
          Sin datos de platos vendidos todavía.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(180, sorted.length * 32)}>
          <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 15, left: 0, bottom: 0 }} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nombre" width={115} tick={{ fontSize: 10, fontWeight: 600, fill: "#4b5563" }} axisLine={false} tickLine={false} />
            <Tooltip content={<PlatosTooltip />} />
            <Bar dataKey="ventas" radius={[0, 6, 6, 0]}>
              {sorted.map((_, i) => (
                <Cell key={i} fill={i === 0 && !asc ? AMARILLO : MARRON} fillOpacity={1 - i * (0.55 / Math.max(sorted.length, 1))} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
