"use client";
import { Bot, Users, BarChart2 } from "lucide-react";
import { type PedidoVivo } from "./PedidosTable";

interface Props {
  pedidos: PedidoVivo[];
  loading?: boolean;
  iaPersonas?: number;
  iaPedidos?: number;
  iaPedidosManual?: number;
}

export function IAEficiencia({ 
  pedidos, 
  loading,
  iaPersonas = 0,
  iaPedidos = 0,
  iaPedidosManual = 0
}: Props) {
  
  // ── Cálculo de Canales de Venta ──
  const totalPedidos = iaPedidos + iaPedidosManual;
  const pctIA = totalPedidos > 0 ? Math.round((iaPedidos / totalPedidos) * 100) : 0;
  const pctManual = totalPedidos > 0 ? 100 - pctIA : 0;

  // ── Originales: Conversión, Velocidad, Precisión ──
  const total = pedidos.length;
  const ia = pedidos.filter(p => p.origen === "IA").length;
  const tasaConversion = total > 0 ? Math.round((ia / total) * 100) : 0;
  const velocidad = 75;
  const precision = 95;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col justify-between">
      
      {/* ── HEADER DEL COMPONENTE ── */}
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-50 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-akaza-marron flex items-center justify-center shrink-0 shadow-sm">
          <Bot size={16} className="text-akaza-amarillo" />
        </div>
        <div>
          <h2 className="font-black text-akaza-marron text-xs leading-none">Métricas de la IA</h2>
          <p className="text-[9px] text-gray-400 font-medium mt-1">Eficiencia operativa y canales</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        
        {/* ── GRÁFICO 1: COMPARATIVA DE CANALES DE PEDIDO (IA VS MANUAL) ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BarChart2 size={12} className="text-akaza-marron" />
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-wider">Canal de Pedidos (IA vs Manual)</p>
            </div>
            {loading ? (
              <div className="h-4 w-8 rounded bg-gray-100 animate-pulse" />
            ) : (
              <p className="text-[10px] font-black text-akaza-marron bg-akaza-crema/10 px-2 py-0.5 rounded-full border border-akaza-marron/5 uppercase">
                {totalPedidos} Pedidos
              </p>
            )}
          </div>

          {/* Barra Dividida (Split Bar) */}
          <div className="w-full h-3.5 bg-gray-100 rounded-full flex overflow-hidden border border-gray-50 shadow-inner mt-1">
            {loading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            ) : totalPedidos === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400 bg-gray-50">
                Sin pedidos registrados hoy
              </div>
            ) : (
              <>
                {pctIA > 0 && (
                  <div
                    style={{ width: `${pctIA}%` }}
                    className="bg-akaza-marron h-full flex items-center justify-center text-[8px] font-black text-white transition-all duration-700"
                    title={`IA: ${iaPedidos} pedidos`}
                  >
                    {pctIA >= 15 && `${pctIA}%`}
                  </div>
                )}
                {pctManual > 0 && (
                  <div
                    style={{ width: `${pctManual}%` }}
                    className="bg-akaza-amarillo h-full flex items-center justify-center text-[8px] font-black text-akaza-marron transition-all duration-700"
                    title={`Manual: ${iaPedidosManual} pedidos`}
                  >
                    {pctManual >= 15 && `${pctManual}%`}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Leyenda del Gráfico */}
          <div className="flex items-center justify-between mt-1 text-[9px] font-bold select-none">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-akaza-marron rounded-sm shadow-sm" />
              <span className="text-gray-500">IA:</span>
              <span className="text-akaza-marron">{iaPedidos} u.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-akaza-amarillo rounded-sm shadow-sm" />
              <span className="text-gray-500">Manual:</span>
              <span className="text-akaza-marron">{iaPedidosManual} u.</span>
            </div>
          </div>
        </div>

        {/* ── GRÁFICO 2: INTERACCIONES CON EL CHATBOT (PERSONAS) ── */}
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-akaza-marron dark:text-akaza-amarillo" />
              <p className="text-gray-600 dark:text-gray-400 text-[11px] font-black uppercase tracking-wider">Interacciones con la IA</p>
            </div>
            {loading ? (
              <div className="h-4 w-8 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ) : (
              <p className="text-base font-black text-akaza-marron dark:text-akaza-amarillo tracking-tight">
                {iaPersonas} <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">personas</span>
              </p>
            )}
          </div>

          {/* Barra de Enganche/Volumen */}
          <div className="w-full h-2 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700 mt-1">
            {loading ? (
              <div className="h-full bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ) : (
              <div
                className="h-full bg-akaza-marron dark:bg-akaza-marron rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(15, iaPersonas * 10))}%` }}
              />
            )}
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
            Clientes únicos que han consultado o conversado con Akaza hoy.
          </p>
        </div>

        {/* ── GRÁFICO 3: TASA DE CONVERSIÓN DE DIÁLOGOS A PEDIDOS ── */}
        <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider">Conversión Reciente en Mesa</p>
            <p className="text-sm font-black text-akaza-marron dark:text-akaza-amarillo">{tasaConversion}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-akaza-marron dark:bg-akaza-marron rounded-full transition-all duration-700"
              style={{ width: `${tasaConversion}%` }}
            />
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
            Porcentaje de mesas activas que ordenaron por voz/IA: {ia} de {total}.
          </p>
        </div>

      </div>
    </div>
  );
}
