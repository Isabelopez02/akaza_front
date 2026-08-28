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
        new Promise((resolve) => setTimeout(resolve, 250))
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
        contrasenia: "",
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
    if (name === "administrador" || name === "admin") {
      return "bg-rose-50 text-rose-700 border border-rose-200/80";
    }
    if (name === "cocinero" || name === "chef") {
      return "bg-sky-50 text-sky-700 border border-sky-200/80";
    }
    if (name === "mesero") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/80";
    }
    if (name === "cliente") {
      return "bg-amber-50 text-amber-800 border border-amber-200/80";
    }
    return "bg-gray-50 text-gray-700 border border-gray-150";
  };

  return (
    <div className="admin-page-container space-y-5 animate-in fade-in duration-300 text-gray-700">
      
      {/* HEADER COMPACTO */}
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra clientes, cocineros, meseros y personal administrativo."
      >
        <Button size="md" icon={<Plus size={14} />} onClick={() => handleOpenModal()}>
          Nuevo Usuario
        </Button>
      </PageHeader>

      <div className="space-y-4">
        
        {/* CONTROLES DE BÚSQUEDA Y FILTROS MINIMALISTAS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-150 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-2xs text-gray-700"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType("all")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                filterType === "all"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Users size={13} />
              <span>Todos</span>
            </button>
            <button
              onClick={() => setFilterType("cliente")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                filterType === "cliente"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <UserCheck size={13} />
              <span>Clientes</span>
            </button>
            <button
              onClick={() => setFilterType("cocinero")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                filterType === "cocinero"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Shield size={13} />
              <span>Cocineros</span>
            </button>
            <button
              onClick={() => setFilterType("personal")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                filterType === "personal"
                  ? "bg-akaza-marron text-white border-akaza-marron"
                  : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Shield size={13} />
              <span>Personal General</span>
            </button>
          </div>
        </div>

        {/* TABLA PRINCIPAL DE USUARIOS COMPACTA */}
        <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-2xs text-left">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-akaza-marron" />
              <h3 className="font-serif text-sm font-bold text-akaza-marron tracking-tight">Usuarios Registrados</h3>
            </div>
            <span className="text-[10px] bg-akaza-crema text-akaza-marron px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider border border-akaza-marron/10">
              {filteredUsers.length} en total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-3.5 py-2.5">Nombre</th>
                  <th className="px-3.5 py-2.5">Correo</th>
                  <th className="px-3.5 py-2.5">Rol / Permisos</th>
                  <th className="px-3.5 py-2.5 text-center">Pedidos</th>
                  <th className="px-3.5 py-2.5">Fecha Registro</th>
                  <th className="px-3.5 py-2.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-3.5 py-2.5">
                        <div className="h-3.5 bg-gray-200 rounded w-28"></div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="h-3.5 bg-gray-100 rounded w-36"></div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <div className="h-3.5 bg-gray-100 rounded w-6 mx-auto"></div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="h-3.5 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <div className="w-6 h-6 bg-gray-100 rounded-md"></div>
                          <div className="w-6 h-6 bg-gray-100 rounded-md"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      <Users size={28} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold text-gray-500">No se encontraron usuarios</p>
                      <p className="text-[10px] mt-0.5 text-gray-400">Intenta cambiar los filtros o el término de búsqueda.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <div className="font-serif text-xs font-bold text-akaza-marron">{user.nombre}</div>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-mono text-gray-600">{user.correo}</div>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider ${getRolStyles(user.rol)}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-center">
                        <span className="text-xs font-mono font-bold text-gray-700">
                          {user.rol.toLowerCase() === "cliente" ? user.pedidos_count || 0 : "—"}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="text-[10px] font-mono text-gray-400">{formatDate(user.fecha_union)}</span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1">
                          {user.rol.toLowerCase() === "administrador" || user.rol.toLowerCase() === "admin" ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200/60 text-[9px] font-mono font-bold px-2 py-0.5 rounded" title="Administrador protegido">
                              <Shield size={10} className="text-rose-500" /> Protegido
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenModal(user)}
                                className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-md transition-all"
                                title="Editar"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
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

      {/* MODAL DE CREAR / EDITAR USUARIO COMPACTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] text-left border border-gray-150">
            
            {/* Header del Modal */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
              <h2 className="font-serif text-sm font-bold text-akaza-marron flex items-center gap-2">
                <Users className="text-akaza-marron" size={16} />
                <span>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</span>
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 text-gray-400 hover:text-akaza-marron hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
              {modalError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {modalError}
                </div>
              )}

              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-150 rounded-lg text-xs font-medium focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    placeholder="ejemplo@restaurante.com"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-150 rounded-lg text-xs font-medium focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  Contraseña {editingUser && "(Opcional si no deseas cambiarla)"}
                </label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <input
                    type="password"
                    name="contrasenia"
                    value={formData.contrasenia}
                    onChange={handleInputChange}
                    required={!editingUser}
                    placeholder="Contraseña del usuario"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-150 rounded-lg text-xs font-medium focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Asignar Rol</label>
                <div className="relative">
                  <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                  <select
                    name="id_rol"
                    value={formData.id_rol}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-150 rounded-lg text-xs font-medium focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all text-gray-700 appearance-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex gap-2 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-2 rounded-lg border border-gray-200 font-mono font-bold text-gray-500 hover:bg-gray-50 transition-all text-[10px] uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-akaza-marron hover:bg-black text-white font-serif text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
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
