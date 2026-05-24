"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, ArrowUpDown, UtensilsCrossed } from "lucide-react";
import { DishCard } from "@/app/admin/dishes/_components/DishCard";
import { DishModal } from "@/app/admin/dishes/_components/DishModal";
import { DishDetailsModal } from "@/app/admin/dishes/_components/DishDetailsModal";
import { DishFormData, DEFAULT_DISH_FORM } from "@/app/admin/dishes/_components/DishForm";
import type { Plato, Producto } from "@/types";
import { AdminService } from "../../../service/admin.service";
import { Button } from "@/component/admin/Button";
import { PageHeader } from "@/component/admin/PageHeader";

export default function DishesPage() {
  const [dishes, setDishes] = useState<Plato[]>([]);
  const [productosOptions, setProductosOptions] = useState<Producto[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Plato | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Plato | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<DishFormData>(DEFAULT_DISH_FORM);
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<string>("");

  // Cargar datos iniciales
  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [platosData, productosData] = await Promise.all([
        AdminService.getPlatos(),
        AdminService.getProductos(),
        new Promise((resolve) => setTimeout(resolve, 300)) // Force at least 300ms loading!
      ]);

      const platosMapeados = platosData.map((p: any) => ({
        ...p,
        precio: Number(p.precio_venta) || 0,
        img_url: p.imagen_url || "",
        categoria: p.categoria || "General",
      }));
      
      setDishes(platosMapeados);
      setProductosOptions(productosData);
    } catch (error) {
      console.error("Error inicializando página:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleViewDetails = (dish: Plato) => {
    setSelectedDish(dish);
    setIsDetailsModalOpen(true);
  };

  const handleOpenModal = (dish: Plato | null = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        nombre: dish.nombre,
        precio: dish.precio.toString(),
        descripcion: dish.descripcion,
        img_url: dish.img_url,
        categoria: dish.categoria || "",
        // IMPORTANTE: Si el backend devuelve ingredientes, mapearlos aquí
        productos_seleccionados: dish.recetas?.map((r: any) => r.id_producto) || [],
      });
    } else {
      setEditingDish(null);
      setFormData(DEFAULT_DISH_FORM);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isLoading) return;

  setIsLoading(true);
  try {
    // 1. Mapeamos los IDs seleccionados al formato "RecetaCreate" que espera tu Python
    const recetasMapeadas = formData.productos_seleccionados.map((id) => ({
      producto_ref: id,        // Tu repo usa _resolver_id_producto con esto
      cantidad_estimada: 1,    // Valor por defecto, luego podrías añadir un input para esto
      unidad_medida: "unid",   // Valor por defecto
      es_opcional: false
    }));

    // 2. Construimos el payload exacto para MenuRepository.crear_plato
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio_venta: parseFloat(formData.precio),
      imagen_url: formData.img_url, // Opcional según tu Repo, pero bueno tenerlo
      categoria: formData.categoria,
      recetas: recetasMapeadas // <--- AQUÍ ESTÁ LA MAGIA
    };

    if (editingDish) {
      await AdminService.updatePlato(editingDish.id, payload);
    } else {
      // Esto llamará a tu MenuRepository.crear_plato(data)
      await AdminService.createPlato(payload);
    }

    // 3. Limpieza y recarga
    await cargarDatos();
    setIsModalOpen(false);
    setEditingDish(null);
    setFormData(DEFAULT_DISH_FORM);
    
    alert("¡Plato y Receta guardados correctamente!");
  } catch (error: any) {
    console.error("Error al guardar:", error);
    const backendError = error?.response?.data?.detail;
    const errorMsg = Array.isArray(backendError) ? JSON.stringify(backendError) : backendError;
    alert(`Error al guardar: ${errorMsg || error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  // ... (handleDelete y getFilteredAndSortedDishes se mantienen igual)
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este plato?")) {
      try {
        await AdminService.deletePlato(id);
        setDishes(dishes.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error eliminando plato:", error);
      }
    }
  };

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
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title="Gestión de Platos"
        subtitle="Crea y edita los platos de tu carta digital."
      >
        <Button
          size="md"
          icon={<Plus size={14} />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Plato
        </Button>
      </PageHeader>

      {/* Controles de Filtrado Minimalistas */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Buscar plato por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-sm text-gray-700"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative group min-w-[140px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-akaza-marron/10"
            >
              <option value="all">Todas</option>
              <option value="Criollo">Criollo</option>
              <option value="Marino">Marino</option>
              <option value="Internacional">Internacional</option>
              <option value="Entrada">Entrada</option>
              <option value="Postre">Postre</option>
              <option value="Bebida">Bebida</option>
            </select>
          </div>

          <div className="relative group min-w-[140px]">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-akaza-marron/10"
            >
              <option value="">Ordenar...</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio">Mayor precio</option>
              <option value="recientes">Recientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Platos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse p-4 flex flex-col justify-between h-[340px]">
              <div className="space-y-4 flex-1">
                <div className="h-44 bg-gray-200 rounded-2xl w-full"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-9 bg-gray-200 rounded-xl w-24"></div>
              </div>
            </div>
          ))
        ) : getFilteredAndSortedDishes().length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white border border-gray-100 rounded-3xl">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-sm font-bold text-gray-900">No hay platos</h3>
            <p className="text-xs text-gray-500 mt-1">No se encontraron platos para mostrar.</p>
          </div>
        ) : (
          getFilteredAndSortedDishes().map((dish) => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onEdit={handleOpenModal} 
              onDelete={handleDelete}
              onView={handleViewDetails}
            />
          ))
        )}
      </div>

      {/* MODAL / DRAWER */}
      <DishModal
        isOpen={isModalOpen}
        editingDish={editingDish}
        formData={formData}
        productOptions={productosOptions}
        isLoading={isLoading}
        // Esta es la clave: el cambio del form debe subir aquí
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
        onSubmit={handleSubmit}
        onClose={() => setIsModalOpen(false)}
      />

      {/* MODAL DE DETALLES */}
      <DishDetailsModal
        isOpen={isDetailsModalOpen}
        dish={selectedDish}
        productOptions={productosOptions}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}