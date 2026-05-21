"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PIE_COLORS = ["#3B1F0F", "#F5C518"];

interface Props {
  combosVsPlatos: { name: string; value: number }[];
  platoPopular: string;
  platoPopularVentas: number;
  platoMenosPopular: string;
  platoMenosVentas: number;
  loading?: boolean;
}

export function PreferenciasPanel({
  combosVsPlatos, platoPopular, platoPopularVentas,
  platoMenosPopular, platoMenosVentas, loading,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 h-full">
      <div>
        <h2 className="font-black text-akaza-marron text-base">Preferencias</h2>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">Combos vs Platos</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={combosVsPlatos} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={4} dataKey="value" strokeWidth={0}>
                {combosVsPlatos.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, n: string) => [`${v} und.`, n]}
                contentStyle={{ borderRadius: 14, border: "1px solid #f0f0f0", fontSize: 12, fontWeight: 700 }}
              />
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span className="text-[11px] font-bold text-gray-500">{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Totales */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4">
            {combosVsPlatos.map((item, i) => (
              <div key={item.name} className="text-center">
                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: PIE_COLORS[i] }} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</p>
                <p className="text-base font-black text-akaza-marron">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Platos populares */}
          <div className="space-y-2 border-t border-gray-50 pt-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-akaza-amarillo/5 border border-akaza-amarillo/20">
              <div className="w-8 h-8 rounded-lg bg-akaza-amarillo/15 flex items-center justify-center text-akaza-marron shrink-0">
                <TrendingUp size={15} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Más popular</p>
                <p className="text-sm font-black text-akaza-marron truncate">{platoPopular}</p>
                <p className="text-[10px] text-gray-400">{platoPopularVentas} ventas</p>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-akaza-amarillo/20 text-akaza-marron ml-auto shrink-0">TOP</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <TrendingDown size={15} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Menos popular</p>
                <p className="text-sm font-black text-gray-600 truncate">{platoMenosPopular}</p>
                <p className="text-[10px] text-gray-400">{platoMenosVentas} ventas</p>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500 ml-auto shrink-0">BAJO</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
