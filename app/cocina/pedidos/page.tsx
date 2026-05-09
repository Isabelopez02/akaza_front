"use client";

import { useState } from "react";

import CocinaSidebar from "@/component/cocina/CocinaSidebar";

interface Pedido {
  id: number;
  mesa: number;
  cliente: string;
  productos: string[];
  estado: "Pendiente" | "En proceso" | "Listo";
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      mesa: 4,
      cliente: "Carlos",
      productos: [
        "2 Hamburguesas",
        "1 Inka Cola",
      ],
      estado: "Pendiente",
    },
    {
      id: 2,
      mesa: 7,
      cliente: "Andrea",
      productos: [
        "1 Pizza Familiar",
      ],
      estado: "En proceso",
    },
    {
      id: 3,
      mesa: 2,
      cliente: "Luis",
      productos: [
        "1 Lomo Saltado",
      ],
      estado: "Listo",
    },
  ]);

  const cambiarEstado = (
    id: number,
    nuevoEstado: "Pendiente" | "En proceso" | "Listo"
  ) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === id
          ? { ...pedido, estado: nuevoEstado }
          : pedido
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F5F1EC]">
      <CocinaSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-[#4B1E00] mb-8">
          Gestión de Pedidos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-3xl p-6 shadow border border-[#E5D3C5]"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#4B1E00]">
                    Pedido #{pedido.id}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Mesa {pedido.mesa}
                  </p>
                </div>

                {/* ESTADO */}
                {pedido.estado === "Pendiente" && (
                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Pendiente
                  </span>
                )}

                {pedido.estado === "En proceso" && (
                  <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                    En proceso
                  </span>
                )}

                {pedido.estado === "Listo" && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Listo
                  </span>
                )}
              </div>

              {/* CLIENTE */}
              <div className="mb-5">
                <p className="font-semibold text-[#4B1E00]">
                  Cliente
                </p>

                <p className="text-gray-700">
                  {pedido.cliente}
                </p>
              </div>

              {/* PRODUCTOS */}
              <div>
                <p className="font-semibold text-[#4B1E00] mb-3">
                  Productos
                </p>

                <ul className="space-y-2">
                  {pedido.productos.map((producto, index) => (
                    <li
                      key={index}
                      className="bg-[#F9F4EF] p-3 rounded-2xl"
                    >
                      {producto}
                    </li>
                  ))}
                </ul>
              </div>

              {/* BOTONES */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() =>
                    cambiarEstado(
                      pedido.id,
                      "Pendiente"
                    )
                  }
                  className="bg-yellow-400 hover:bg-yellow-500 transition px-4 py-2 rounded-xl font-semibold text-[#4B1E00]"
                >
                  Pendiente
                </button>

                <button
                  onClick={() =>
                    cambiarEstado(
                      pedido.id,
                      "En proceso"
                    )
                  }
                  className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-xl font-semibold text-white"
                >
                  En proceso
                </button>

                <button
                  onClick={() =>
                    cambiarEstado(
                      pedido.id,
                      "Listo"
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl font-semibold text-white"
                >
                  Listo
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}