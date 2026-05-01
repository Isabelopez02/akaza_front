"use client";
import { useEffect, useState } from "react";
import { CocinaService } from "@/service/cocina.service";

type Pedido = {
  id: number;
  nro_mesa: number;
  estado: string;
  descripcion?: string;
  [key: string]: any;
};

export default function CocinaPage() {
  const [nroMesa, setNroMesa] = useState<number>(1);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const loadPedidos = async (mesa: number) => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const data = await CocinaService.getPedidosPorMesa(mesa);
      // El backend devuelve una lista de pedidos o un objeto con lista
      const lista = Array.isArray(data) ? data : data?.pedidos ?? [];
      setPedidos(lista);
    } catch (error) {
      setErrorStatus("Error sincronizando pedidos. ¿Está la mesa correcta?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos(nroMesa);
  }, [nroMesa]);

  const handleConfirmarPedido = async (id: number) => {
    try {
      await CocinaService.confirmarPedido(id);
      // Refrescar lista tras confirmar
      await loadPedidos(nroMesa);
    } catch (error) {
      alert("Hubo un error confirmando este pedido.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-akaza-crema font-sans">
      <h1 className="text-3xl font-black text-akaza-marron mb-6">Centro de Cocina Akaza</h1>

      {/* Selector de Mesa */}
      <div className="flex items-center gap-4 mb-8">
        <label className="font-bold text-akaza-marron">Ver pedidos de Mesa:</label>
        <input
          type="number"
          min={1}
          value={nroMesa}
          onChange={(e) => setNroMesa(Number(e.target.value))}
          className="border border-akaza-marron/20 rounded-xl px-4 py-2 w-24 font-bold text-akaza-marron outline-none"
        />
        <button
          onClick={() => loadPedidos(nroMesa)}
          className="bg-akaza-marron text-white px-5 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all"
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p className="text-akaza-marron font-semibold">Cargando pedidos...</p>
      ) : errorStatus ? (
        <p className="text-red-500 font-bold">{errorStatus}</p>
      ) : pedidos.length === 0 ? (
        <p className="text-akaza-marron/60 font-medium">No hay pedidos pendientes para la mesa {nroMesa}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white p-6 rounded-2xl shadow-md border border-akaza-marron/10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-akaza-marron">Pedido #{pedido.id}</h2>
                <span className="bg-akaza-amarillo text-xs font-bold px-3 py-1 rounded-full text-akaza-marron">
                  Mesa {pedido.nro_mesa ?? nroMesa}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Estado: <span className="font-bold uppercase">{pedido.estado ?? "PENDIENTE"}</span>
              </p>
              {pedido.descripcion && (
                <p className="text-sm text-gray-500 mb-4">{pedido.descripcion}</p>
              )}
              <button
                onClick={() => handleConfirmarPedido(pedido.id)}
                className="w-full bg-akaza-marron text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
              >
                Confirmar Pedido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
