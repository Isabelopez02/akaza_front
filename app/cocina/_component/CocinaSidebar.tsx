"use client";

import Link from "next/link";
import {
  ChefHat,
  LayoutDashboard,
  MessageCircle,
  ClipboardList,
} from "lucide-react";

export default function CocinaSidebar() {
  return (
    <aside className="w-[280px] min-h-screen bg-[#4B1E00] text-white p-6">
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Akaza <span className="text-yellow-400">Cocina</span>
        </h1>

        <p className="text-gray-300 mt-2 text-sm">
          Panel del cocinero
        </p>
      </div>

      {/* PERFIL */}
      <div className="bg-[#5C2B08] rounded-2xl p-4 border border-yellow-500 mb-8">
        <div className="flex items-center gap-3">
          <ChefHat className="text-yellow-400" />

          <div>
            <h3 className="font-semibold">
              Cocinero en línea
            </h3>

            <p className="text-xs text-gray-300">
              Gestión de pedidos
            </p>
          </div>
        </div>
      </div>

      {/* MENÚ */}
      <nav className="flex flex-col gap-4">
        <Link
          href="/cocina"
          className="flex items-center gap-3 bg-[#5C2B08] hover:bg-[#6d350d] transition p-4 rounded-2xl"
        >
          <LayoutDashboard />
          Dashboard
        </Link>

        <Link
          href="/cocina/pedidos"
          className="flex items-center gap-3 hover:bg-[#5C2B08] transition p-4 rounded-2xl"
        >
          <ClipboardList />
          Pedidos
        </Link>

        <Link
          href="/cocina/chat"
          className="flex items-center gap-3 hover:bg-[#5C2B08] transition p-4 rounded-2xl"
        >
          <MessageCircle />
          ChatBot Cocina
        </Link>
      </nav>
    </aside>
  );
}