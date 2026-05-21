"use client";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
  pct?: number | null;
  positive?: boolean;
  emptyState?: boolean;
  badgeText?: string;
  badgeClass?: string;
  iconClass?: string;
  valueClass?: string;
  wrapperClass?: string;
}

export function KpiCard({
  icon: Icon, label, value, sub, loading,
  pct, positive, emptyState,
  badgeText, badgeClass,
  iconClass = "bg-akaza-marron/[0.04] border-gray-100 text-akaza-marron",
  valueClass = "text-akaza-marron",
  wrapperClass = "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200",
}: KpiCardProps) {
  const hasPct = pct !== undefined && pct !== null;
  return (
    <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between min-h-[128px] ${wrapperClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconClass}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        {badgeText && (
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${badgeClass ?? "bg-gray-100 text-gray-400"}`}>
            {badgeText}
          </span>
        )}
        {hasPct && !badgeText && (
          emptyState
            ? <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-gray-100 text-gray-400">Sin datos</span>
            : <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {pct! > 0 ? "+" : ""}{pct}%
                {positive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
              </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        {loading
          ? <div className="h-6 w-28 rounded-lg bg-gray-100 animate-pulse mt-1" />
          : <p className={`text-[1.15rem] font-black tracking-tight leading-tight ${valueClass}`}>{value}</p>
        }
        {sub && <p className="text-[11px] text-gray-400 font-medium mt-1">{sub}</p>}
      </div>
    </div>
  );
}
