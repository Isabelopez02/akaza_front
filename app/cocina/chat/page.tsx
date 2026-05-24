"use client";

import CocinaSidebar from "@/app/cocina/_component/CocinaSidebar";

export default function CocinaChatPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F1EC]">
      <CocinaSidebar />

      <main className="flex-1 p-8 flex flex-col">
        <h1 className="text-4xl font-bold text-[#4B1E00] mb-8">
          ChatBot Cocina
        </h1>

        <div className="flex-1 bg-white rounded-3xl shadow border border-[#E5D3C5] p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="bg-[#F9F4EF] p-4 rounded-2xl max-w-md">
              Hola cocinero 👨‍🍳
            </div>

            <div className="bg-[#4B1E00] text-white p-4 rounded-2xl max-w-md ml-auto">
              ¿Qué pedidos están pendientes?
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-[#E5D3C5] rounded-full px-5 py-4 outline-none"
            />

            <button className="bg-yellow-400 hover:bg-yellow-500 transition px-8 rounded-full font-semibold text-[#4B1E00]">
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}