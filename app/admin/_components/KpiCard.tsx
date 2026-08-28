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
  icon: Icon,
  label,
  value,
  sub,
  loading,
  pct,
  positive,
  emptyState,
  badgeText,
  badgeClass,
  iconClass = "bg-akaza-marron/5 border-akaza-marron/10 text-akaza-marron",
  valueClass = "text-akaza-marron",
  wrapperClass = "bg-white border-gray-150 shadow-2xs hover:shadow-sm hover:border-gray-300",
}: KpiCardProps) {
  const hasPct = pct !== undefined && pct !== null;

  return (
    <div className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[105px] ${wrapperClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${iconClass}`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>

        {badgeText && (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass ?? "bg-gray-100 text-gray-500"}`}>
            {badgeText}
          </span>
        )}

        {hasPct && !badgeText && (
          emptyState ? (
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              Sin datos
            </span>
          ) : (
            <div className={`flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${positive ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {pct! > 0 ? "+" : ""}{pct}%
              {positive ? <ArrowUpRight size={11} strokeWidth={2.5} /> : <ArrowDownRight size={11} strokeWidth={2.5} />}
            </div>
          )
        )}
      </div>

      <div className="text-left">
        <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
          {label}
        </p>

        {loading ? (
          <div className="h-5 w-24 rounded bg-gray-200 animate-pulse my-1" />
        ) : (
          <p className={`font-serif text-base sm:text-lg font-black tracking-tight leading-tight ${valueClass}`}>
            {value}
          </p>
        )}

        {sub && <p className="text-[10px] text-gray-500 font-medium mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}
