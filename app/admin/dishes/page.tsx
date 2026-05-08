"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { DishCard } from "@/component/admin/DishCard";
import { Plato } from "@/ts/types";
import { AdminService } from "../../../service/admin.service"; // ← Ruta ajustada

export default function DishesPage() {
  const [dishes, setDishes] = useState<Plato[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Plato | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    img_url: "",
    categoria: "Principal",
  });

  // ── Estados para Filtros y Búsqueda ───────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<string>("");

  // ── 1. Cargar Platos Reales ───────────────────────────────────────────
  useEffect(() => {
    const cargarPlatos = async () => {
      setIsLoading(true);
      try {
        const data = await AdminService.getPlatos();
        
        // Mapeo: Backend usa "precio_venta" e "imagen_url", Frontend usa "precio" e "img_url"
        const platosMapeados = data.map((p: any) => ({
          ...p,
          precio: Number(p.precio_venta) || 0, // Convierte a número: 12.00
          img_url: p.imagen_url || "",
          categoria: p.categoria || "General",
        }));
        setDishes(platosMapeados);
      } catch (error) {
        console.error("Error cargando platos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarPlatos();
  }, []);

  // ── Abrir Modal (Crear/Editar) ─────────────────────────────────────────
  const handleOpenModal = (dish: Plato | null = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        nombre: dish.nombre,
        precio: dish.precio.toString(),
        descripcion: dish.descripcion,
        img_url: dish.img_url,
        categoria: dish.categoria || "",
      });
    } else {
      setEditingDish(null);
      setFormData({
        nombre: "",
        precio: "",
        descripcion: "",
        img_url: "",
        categoria: "",
      });
    }
    setIsModalOpen(true);
  };

  // ─ 2. Guardar Plato (Create/Update) ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mapeo Inverso: Frontend -> Backend
      const payload = {
        nombre: formData.nombre,
        precio_venta: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        imagen_url: formData.img_url,
        categoria: formData.categoria,
        disponible: true,
      };

      if (editingDish) {
        await AdminService.updatePlato(editingDish.id, payload);
      } else {
        await AdminService.createPlato(payload);
      }

      // Recargar lista tras guardar
      const data = await AdminService.getPlatos();
      const platosMapeados = data.map((p: any) => ({
        ...p,
        precio: Number(p.precio_venta) || 0,
        img_url: p.imagen_url || "",
        categoria: p.categoria || "General",
      }));
      setDishes(platosMapeados);

      setIsModalOpen(false);
      setEditingDish(null);
    } catch (error) {
      console.error("Error guardando plato:", error);
      alert("Error al guardar. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── 3. Eliminar Plato (Delete) ─────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este plato?")) {
      try {
        await AdminService.deletePlato(id);
        // Actualizar lista localmente tras borrar
        setDishes(dishes.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error eliminando plato:", error);
        alert("No se pudo eliminar el plato.");
      }
    }
  };

  // ── Lógica de Filtrado y Ordenamiento ─────────────────────────────
  const getFilteredAndSortedDishes = () => {
    let result = [...dishes];

    // 🔍 Filtrar por búsqueda (nombre o descripción)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (dish) =>
          dish.nombre.toLowerCase().includes(term) ||
          dish.descripcion?.toLowerCase().includes(term),
      );
    }

    // 🏷️ Filtrar por categoría
    if (filterCategory !== "all") {
      result = result.filter((dish) => dish.categoria === filterCategory);
    }

    result.sort((a, b) => {
      if (sortBy === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      }
      if (sortBy === "precio") {
        return Number(b.precio) - Number(a.precio); // Mayor a menor
      }
      if (sortBy === "recientes") {
        return b.id - a.id; // Asumiendo que IDs mayores son más recientes
      }
      return 0;
    });

    return result;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">
            Gestión de Platos
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Crea y edita los platos de tu carta digital.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Plato
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar plato por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-akaza-amarillo/50 outline-none font-medium"
          />
        </div>

        <div className="flex gap-2">
          {/* Filtro por Categoría (Diseño de Botón) */}
          {/* Selector con apariencia limpia (Botón + Icono) */}
          <div className="relative group">
            {/* Icono de filtro a la izquierda */}
            <Filter
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-amarillo transition-colors pointer-events-none"
              size={18}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-14 pr-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm border-none outline-none hover:bg-gray-100 transition-colors cursor-pointer appearance-none"
            >
              <option value="all"> Todas las categorías</option>
              <option value="Criollo">Criollo</option>
              <option value="Marino">Marino</option>
              <option value="Internacional">Internacional</option>
              <option value="Entrada">Entrada</option>
              <option value="Postre">Postre</option>
              <option value="Bebida">Bebida</option>
            </select>
          </div>

          {/* Ordenar por (Diseño de Botón) */}
          <div className="relative group">
            {/* Icono a la izquierda */}
            <ArrowUpDown
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-akaza-marron transition-colors pointer-events-none"
              size={18}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-12 pr-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm border-none outline-none hover:bg-gray-100 transition-colors cursor-pointer appearance-none"
            >
              <option value="">Ordenar por...</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio">Precio (Mayor a menor)</option>
              <option value="recientes">Más recientes</option>
            </select>
          </div>
          {/* Flecha decorativa a la derecha */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"></div>
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-akaza-marron mx-auto"></div>
          </div>
        ) : (
          getFilteredAndSortedDishes().map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90dvh] flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-akaza-marron">
                  {editingDish ? "Editar Plato" : "Nuevo Plato"}
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Información Detallada
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
                {/* Columna Izq: Imagen */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                      Imagen del Plato
                    </label>
                    <div className="aspect-square w-full rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 overflow-hidden relative group transition-all hover:border-akaza-amarillo/30">
                      {formData.img_url ? (
                        <img
                          src={formData.img_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder-dish.jpg")
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3">
                          <ImageIcon size={64} strokeWidth={1} />
                          <p className="text-sm font-bold uppercase tracking-wider">
                            Vista previa
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-akaza-marron/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Upload className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                      URL de la Imagen
                    </label>
                    <div className="relative">
                      <ImageIcon
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-akaza-marron/20"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.img_url}
                        onChange={(e) =>
                          setFormData({ ...formData, img_url: e.target.value })
                        }
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-akaza-marron"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Der: Datos */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                      Nombre del Plato
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                      placeholder="Ej. Lomo Saltado"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                        Precio
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.precio}
                        onChange={(e) =>
                          setFormData({ ...formData, precio: e.target.value })
                        }
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                        Categoría
                      </label>
                      <select
                        required
                        value={formData.categoria}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoria: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron appearance-none"
                      >
                        <option value="" disabled hidden>
                          Selecciona una categoría
                        </option>
                        <option value="Criollo">Criollo</option>
                        <option value="Marino">Marino</option>
                        <option value="Internacional">Internacional</option>
                        <option value="Entrada">Entrada</option>
                        <option value="Postre">Postre</option>
                        <option value="Bebida">Bebida</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                      Descripción
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                      placeholder="Describe los ingredientes..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading
                      ? "Guardando..."
                      : editingDish
                        ? "Actualizar Plato"
                        : "Guardar Plato"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
