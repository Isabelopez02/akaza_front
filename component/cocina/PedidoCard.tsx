"use client";

import EstadoBadge from "./EstadoBadge";
import { Pedido } from "@/ts/pedido";

interface Props {
  pedido: Pedido;
}

export default function PedidoCard({ pedido }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 border border-[#E5D3C5]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#4B1E00]">
            Pedido #{pedido.id}
          </h2>

          <p className="text-gray-500 text-sm">
            Mesa {pedido.mesa}
          </p>
        </div>

        <EstadoBadge estado={pedido.estado} />
      </div>

      <div className="mb-4">
        <p className="font-semibold text-[#4B1E00]">
          Cliente:
        </p>

        <p>{pedido.cliente}</p>
      </div>

      <div>
        <p className="font-semibold text-[#4B1E00] mb-2">
          Productos:
        </p>

        <ul className="space-y-2">
          {pedido.productos.map((producto, index) => (
            <li
              key={index}
              className="bg-[#F9F4EF] rounded-xl px-3 py-2"
            >
              {producto}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}