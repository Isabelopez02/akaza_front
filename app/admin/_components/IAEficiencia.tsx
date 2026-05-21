"use client";
import { Bot } from "lucide-react";
import { type PedidoVivo } from "./PedidosTable";

interface Props {
  pedidos: PedidoVivo[];
  loading?: boolean;
}

interface Metrica {
  label: string;
  valor: number;
  color: string;
  desc: string;
}

export function IAEficiencia({ pedidos, loading }: Props) {
  const total = pedidos.length;
  const ia = pedidos.filter(p => p.origen === "IA").length;
  const tasaConversion = total > 0 ? Math.round((ia / total) * 100) : 0;
  const velocidad = 75;
  const precision = 92;

  const metricas: Metrica[] = [
    {
      label: "Conversión de Voz",
      valor: tasaConversion,
      color: "bg-akaza-marron",
      desc: `${ia} de ${total} pedidos`
    },
    {
      label: "Velocidad",
      valor: velocidad,
      color: "bg-akaza-amarillo",
      desc: "45s vs 3min manual"
    },
    {
      label: "Precisión",
      valor: precision,
      color: "bg-akaza-marron",
      desc: "Precisión en datos"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-akaza-marron flex items-center justify-center shrink-0">
          <Bot size={13} className="text-akaza-amarillo" />
        </div>
        <div>
          <h2 className="font-black text-akaza-marron text-sm">Akaza IA</h2>
          <p className="text-[10px] text-gray-400 font-medium">Eficiencia del asistente</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="flex flex-col gap-5 flex-1">
        {metricas.map((metrica, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-[11px] font-black uppercase tracking-wide">{metrica.label}</p>
              {loading ? (
                <div className="h-5 w-10 rounded bg-gray-200 animate-pulse" />
              ) : (
                <p className="text-base font-black text-akaza-marron">{metrica.valor}%</p>
              )}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              {loading ? (
                <div className="h-full bg-gray-200 animate-pulse" />
              ) : (
                <div
                  className={`h-full ${metrica.color} rounded-full transition-all duration-700`}
                  style={{ width: `${metrica.valor}%` }}
                />
              )}
            </div>
            <p className="text-[9px] text-gray-400 font-medium">{metrica.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
