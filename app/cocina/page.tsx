"use client";

import CocinaSidebar from "@/component/cocina/CocinaSidebar";

export default function CocinaPage() {
  return (
    <div className="flex bg-[#F5F1EC] min-h-screen">
      <CocinaSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-[#4B1E00] mb-8">
          Dashboard Cocina
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pendientes */}
          <div className="bg-white rounded-3xl p-6 shadow border border-[#E5D3C5]">
            <h2 className="text-xl font-bold text-yellow-600">
              Pendientes
            </h2>

            <p className="text-5xl font-bold mt-4 text-[#4B1E00]">
              5
            </p>
          </div>

          {/* En proceso */}
          <div className="bg-white rounded-3xl p-6 shadow border border-[#E5D3C5]">
            <h2 className="text-xl font-bold text-orange-600">
              En Proceso
            </h2>

            <p className="text-5xl font-bold mt-4 text-[#4B1E00]">
              3
            </p>
          </div>

          {/* Listos */}
          <div className="bg-white rounded-3xl p-6 shadow border border-[#E5D3C5]">
            <h2 className="text-xl font-bold text-green-600">
              Listos
            </h2>

            <p className="text-5xl font-bold mt-4 text-[#4B1E00]">
              8
            </p>
          </div>
        </div>

        {/* TABLA PEDIDOS */}
        <div className="mt-10 bg-white rounded-3xl shadow border border-[#E5D3C5] p-6">
          <h2 className="text-2xl font-bold text-[#4B1E00] mb-6">
            Pedidos recientes
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#F9F4EF] p-4 rounded-2xl">
              <div>
                <p className="font-semibold">
                  Mesa 4
                </p>

                <p className="text-sm text-gray-500">
                  Hamburguesa + Inka Cola
                </p>
              </div>

              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm">
                Pendiente
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#F9F4EF] p-4 rounded-2xl">
              <div>
                <p className="font-semibold">
                  Mesa 7
                </p>

                <p className="text-sm text-gray-500">
                  Pizza Familiar
                </p>
              </div>

              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">
                En proceso
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#F9F4EF] p-4 rounded-2xl">
              <div>
                <p className="font-semibold">
                  Mesa 2
                </p>

                <p className="text-sm text-gray-500">
                  Lomo Saltado
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                Listo
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}