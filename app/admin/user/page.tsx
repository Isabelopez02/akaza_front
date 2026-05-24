"use client";

import { useState, useEffect } from "react";
import { Search, Users, UserCheck, Calendar, Plus } from "lucide-react";
import { AdminService } from "../../../service/admin.service";
import { PageHeader } from "@/component/admin/PageHeader";
import { Button } from "@/component/admin/Button";
import type { Usuario } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "cliente" | "personal">("all");

  const cargarUsuarios = async () => {
    setIsLoading(true);
    try {
      const [usuariosData, allPedidos] = await Promise.all([
        AdminService.getUsuarios(),
        AdminService.getPedidos(),
        new Promise((resolve) => setTimeout(resolve, 300)) // Force at least 300ms loading!
      ]);

      const mappedUsers = usuariosData.map((u: any) => {
        const isClient = u.rol?.nombre === "cliente";
        const pedidosCount = allPedidos.filter((p: any) => p.id_usuario === u.id).length;

        return {
          id: u.id,
          nombre: u.nombre,
          correo: u.correo,
          rol: isClient ? "cliente" : "personal",
          fecha_union: u.creado_en || new Date().toISOString(),
          pedidos_count: pedidosCount,
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || user.rol === filterType;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
    <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra clientes y personal del restaurante"
      >
        <Button size="md" icon={<Plus size={14} />} onClick={() => console.log("Abrir modal de crear usuario")}>
          Nuevo Usuario
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={16} />
            <input
              type="text"
              placeholder="Buscar usuario por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-sm text-gray-700"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType("all")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                filterType === "all"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Users size={14} />
              Todos
            </button>
            <button
              onClick={() => setFilterType("cliente")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                filterType === "cliente"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <UserCheck size={14} />
              Clientes
            </button>
            <button
              onClick={() => setFilterType("personal")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                filterType === "personal"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              Personal
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-akaza-marron opacity-80" />
              <h3 className="text-base font-black text-akaza-marron tracking-tight">Usuarios</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Correo</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedidos</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha de Unión</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={index} className="border-b border-gray-50">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                        </td>
                      </tr>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      <Users size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold text-gray-500">No se encontraron usuarios</p>
                      <p className="text-[11px] mt-1 text-gray-400">Prueba con otro término de búsqueda o crea un usuario nuevo.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-akaza-crema/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-akaza-marron">{user.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.correo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.rol === "cliente"
                            ? "bg-akaza-amarillo/20 text-akaza-marron"
                            : "bg-akaza-marron/10 text-akaza-marron"
                        }`}>
                          {user.rol === "cliente" ? "Cliente" : "Personal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.rol === "cliente" ? user.pedidos_count || 0 : "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(user.fecha_union)}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
