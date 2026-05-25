"use client";

import { useState, useEffect } from "react";
import { Search, Users, UserCheck, Plus, Edit2, Trash2, Shield, X, Key, Mail, User } from "lucide-react";
import { AdminService } from "../../../service/admin.service";
import { PageHeader } from "@/component/admin/PageHeader";
import { Button } from "@/component/admin/Button";

interface UsuarioFrontend {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  id_rol: number;
  fecha_union: string;
  pedidos_count: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UsuarioFrontend[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "cliente" | "personal" | "cocinero">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioFrontend | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
    id_rol: "",
  });

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [usuariosData, allPedidos, rolesData] = await Promise.all([
        AdminService.getUsuarios().catch((err) => {
          console.error("Error cargando usuarios:", err);
          return [];
        }),
        AdminService.getPedidos().catch((err) => {
          console.error("Error cargando pedidos:", err);
          return [];
        }),
        AdminService.getRoles().catch((err) => {
          console.error("Error cargando roles:", err);
          return [];
        }),
        new Promise((resolve) => setTimeout(resolve, 300)) // Mantener suavidad en carga
      ]);

      setRoles(rolesData || []);

      const mappedUsers = (usuariosData || []).map((u: any) => {
        const pedidosCount = Array.isArray(allPedidos)
          ? allPedidos.filter((p: any) => p.id_usuario === u.id).length
          : 0;
        return {
          id: u.id,
          nombre: u.nombre,
          correo: u.correo,
          rol: u.rol?.nombre || "Sin Rol",
          id_rol: u.id_rol,
          fecha_union: u.creado_en || new Date().toISOString(),
          pedidos_count: pedidosCount,
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error general cargando usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleOpenModal = (user: UsuarioFrontend | null = null) => {
    setModalError(null);
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        contrasenia: "", // Vacío por defecto al editar
        id_rol: user.id_rol?.toString() || (roles[0]?.id?.toString() ?? ""),
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: "",
        correo: "",
        contrasenia: "",
        id_rol: roles[0]?.id?.toString() || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ nombre: "", correo: "", contrasenia: "", id_rol: "" });
    setModalError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!editingUser && !formData.contrasenia) {
      setModalError("La contraseña es obligatoria para nuevos usuarios.");
      return;
    }

    const payload: any = {
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      id_rol: parseInt(formData.id_rol) || undefined
    };

    if (formData.contrasenia) {
      payload.contrasenia = formData.contrasenia;
    }

    try {
      if (editingUser) {
        await AdminService.updateUsuario(editingUser.id, payload);
      } else {
        await AdminService.createUsuario(payload);
      }
      await cargarDatos();
      handleCloseModal();
    } catch (error: any) {
      console.error("Error al guardar usuario:", error);
      const detail = error?.response?.data?.detail;
      let msg = "Error al procesar la solicitud.";
      if (typeof detail === "string") {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d: any) => d.msg).join(" | ");
      }
      setModalError(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario permanentemente?")) return;
    try {
      await AdminService.deleteUsuario(id);
      await cargarDatos();
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error);
      alert(error?.response?.data?.detail || "No se pudo eliminar el usuario.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase());

    const isClient = user.rol.toLowerCase() === "cliente";
    const isCocinero = user.rol.toLowerCase() === "cocinero" || user.rol.toLowerCase() === "chef";

    let matchesFilter = true;
    if (filterType === "cliente") {
      matchesFilter = isClient;
    } else if (filterType === "cocinero") {
      matchesFilter = isCocinero;
    } else if (filterType === "personal") {
      matchesFilter = !isClient;
    }

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRolStyles = (rolName: string) => {
    const name = rolName.toLowerCase();
    if (name === "administrador") {
      return "bg-red-50 text-red-700 border border-red-100 shadow-sm";
    }
    if (name === "cocinero" || name === "chef") {
      return "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm";
    }
    if (name === "mesero") {
      return "bg-green-50 text-green-700 border border-green-100 shadow-sm";
    }
    if (name === "cliente") {
      return "bg-akaza-amarillo/20 text-akaza-marron border border-akaza-amarillo/10 shadow-sm";
    }
    return "bg-gray-50 text-gray-700 border border-gray-150 shadow-sm";
  };

  return (
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra clientes, cocineros, meseros y personal administrativo."
      >
        <Button size="md" icon={<Plus size={14} />} onClick={() => handleOpenModal()}>
          Nuevo Usuario
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Controles de Búsqueda y Filtros */}
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
              onClick={() => setFilterType("cocinero")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                filterType === "cocinero"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Shield size={14} />
              Cocineros
            </button>
            <button
              onClick={() => setFilterType("personal")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                filterType === "personal"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Shield size={14} />
              Personal General
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-akaza-marron opacity-80" />
              <h3 className="text-base font-black text-akaza-marron tracking-tight">Usuarios Registrados</h3>
            </div>
            <span className="text-[10px] bg-akaza-crema text-akaza-marron px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {filteredUsers.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Correo</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rol / Permisos</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedidos Realizados</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unido el</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={index} className="border-b border-gray-50 animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-28"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded w-40"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded w-8"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <Users size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold text-gray-500">No se encontraron usuarios</p>
                      <p className="text-[11px] mt-1 text-gray-400">Prueba con otro término de búsqueda o crea un usuario nuevo.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-akaza-crema/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-black text-akaza-marron">{user.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.correo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${getRolStyles(user.rol)}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-500">
                          {user.rol.toLowerCase() === "cliente" ? user.pedidos_count || 0 : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(user.fecha_union)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-akaza-marron hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Crear / Editar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-black text-akaza-marron flex items-center gap-2">
                <Users className="text-akaza-marron" size={20} />
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {modalError}
                </div>
              )}

              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    placeholder="ejemplo@restaurante.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Contraseña {editingUser && "(Opcional si no deseas cambiarla)"}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="password"
                    name="contrasenia"
                    value={formData.contrasenia}
                    onChange={handleInputChange}
                    required={!editingUser}
                    placeholder="Contraseña robusta"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
                  />
                </div>
                {!editingUser && (
                  <p className="text-[9px] text-gray-400 font-medium">
                    Debe incluir al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                  </p>
                )}
              </div>

              {/* Rol */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asignar Rol</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select
                    name="id_rol"
                    value={formData.id_rol}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700 appearance-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 border border-gray-100 hover:bg-gray-50 text-gray-500 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-akaza-marron hover:bg-akaza-marron/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
