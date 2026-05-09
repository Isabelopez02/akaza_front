"use client";

import { useState } from "react";
import { Flame, CheckCircle2, ChevronRight, Clock, Users } from "lucide-react";

type EstadoPedido = "En proceso" | "Listo";

interface Pedido {
  id: number;
  mesa: number;
  personas?: number;
  productos: string[];
  estado: EstadoPedido;
  hora: string;
}

const INITIAL_PEDIDOS: Pedido[] = [
  { id: 101, mesa: 4, personas: 3, productos: ["2 Lomo Saltado", "1 Arroz con Leche", "1 Chicha Morada"], estado: "En proceso", hora: "12:05" },
  { id: 102, mesa: 7, personas: 2, productos: ["1 Pizza Familiar (Pepperoni)", "2 Inka Cola"],             estado: "En proceso", hora: "12:10" },
  { id: 103, mesa: 2, personas: 1, productos: ["1 Ceviche Mixto", "1 Agua sin gas"],                      estado: "En proceso", hora: "12:18" },
  { id: 104, mesa: 9, personas: 4, productos: ["3 Pollo a la Brasa", "1 Ensalada Mixta", "2 Gaseosa"],    estado: "Listo",      hora: "11:58" },
];

function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  if (estado === "En proceso") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest">
        <Flame size={12} />
        En proceso
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-widest">
      <CheckCircle2 size={12} />
      Listo
    </span>
  );
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(INITIAL_PEDIDOS);
  const [filtro, setFiltro] = useState<"todos" | EstadoPedido>("todos");

  const marcarListo = (id: number) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: "Listo" as EstadoPedido } : p));
  };

  const visible = filtro === "todos" ? pedidos : pedidos.filter(p => p.estado === filtro);

  const countProceso = pedidos.filter(p => p.estado === "En proceso").length;
  const countListo   = pedidos.filter(p => p.estado === "Listo").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-akaza-marron tracking-tight">Pedidos de Cocina</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {countProceso} en proceso · {countListo} listos
          </p>
        </div>

        {/* Filtro rápido */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl self-start sm:self-auto">
          {(["todos", "En proceso", "Listo"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filtro === f
                  ? "bg-akaza-marron text-white shadow-md"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {f === "todos" ? "Todos" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de cards grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visible.map(pedido => {
          const enProceso = pedido.estado === "En proceso";

          return (
            <div
              key={pedido.id}
              className={`bg-white rounded-3xl border shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-lg ${
                enProceso ? "border-orange-100" : "border-emerald-100"
              }`}
            >
              {/* Franja superior de color */}
              <div className={`h-1.5 w-full ${enProceso ? "bg-orange-400" : "bg-emerald-400"}`} />

              <div className="p-7 flex flex-col gap-6 flex-1">

                {/* ─ Menú / Productos ──────────────── PRIMERO Y GRANDE */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-3">Pedido</p>
                  <ul className="space-y-3">
                    {pedido.productos.map((prod, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${enProceso ? "bg-orange-400" : "bg-emerald-400"}`} />
                        <span className="text-lg font-bold text-gray-800 leading-snug">{prod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <hr className="border-gray-100" />

                {/* ─ Meta info (mesa y hora) ────────── AL FINAL */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Mesa — grande y visible */}
                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 ${
                      enProceso ? "border-orange-200 bg-orange-50" : "border-emerald-200 bg-emerald-50"
                    }`}>
                      <p className={`text-2xl font-black leading-none ${enProceso ? "text-orange-600" : "text-emerald-600"}`}>
                        {pedido.mesa}
                      </p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Mesa</p>
                    </div>

                    <div className="space-y-1.5">
                      {pedido.personas && (
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-gray-300" />
                          <span className="text-xs font-bold text-gray-500">{pedido.personas} persona{pedido.personas > 1 ? "s" : ""}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-300" />
                        <span className="text-xs font-bold text-gray-500">{pedido.hora}</span>
                      </div>
                      <EstadoBadge estado={pedido.estado} />
                    </div>
                  </div>

                  {/* CTA */}
                  {enProceso ? (
                    <button
                      onClick={() => marcarListo(pedido.id)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 py-3.5 rounded-2xl text-sm font-black transition-all shadow-md shadow-emerald-200"
                    >
                      <CheckCircle2 size={18} />
                      Listo
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-5 py-3.5 rounded-2xl text-sm font-black">
                      <CheckCircle2 size={18} />
                      Completado
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="col-span-2 bg-white rounded-3xl border border-gray-100 py-20 flex flex-col items-center justify-center gap-3 shadow-sm">
            <CheckCircle2 size={36} className="text-gray-200" />
            <p className="text-base font-bold text-gray-500">Todo en orden</p>
            <p className="text-xs text-gray-400">No hay pedidos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}