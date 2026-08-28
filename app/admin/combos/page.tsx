"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { ComboCard } from "@/app/admin/combos/_components/ComboCard";
import { ComboModal } from "@/app/admin/combos/_components/ComboModal";
import { ComboFormData, DEFAULT_COMBO_FORM } from "@/app/admin/combos/_components/ComboForm";
import { Combo, Plato } from "@/types";
import { AdminService } from "@/services/admin.service";
import { Button } from "@/components/admin/Button";
import { PageHeader } from "@/components/admin/PageHeader";

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [platoOptions, setPlatoOptions] = useState<Plato[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ComboFormData>(DEFAULT_COMBO_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    loadCombos();
  }, []);

  const loadCombos = async () => {
    setIsFetching(true);
    try {
      const [combosData, platosData] = await Promise.all([
        AdminService.getCombos(),
        AdminService.getPlatos(),
        new Promise((resolve) => setTimeout(resolve, 300)) // Force at least 300ms loading!
      ]);
      setCombos(combosData);
      setPlatoOptions(platosData);
    } catch (error) {
      console.error("Error cargando combos:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const getFilteredAndSortedCombos = () => {
    let result = [...combos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (combo) =>
          combo.nombre.toLowerCase().includes(term) ||
          combo.incluye?.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      if (sortBy === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      }
      if (sortBy === "precio") {
        const pa = Number(a.precio || a.precio_venta || 0);
        const pb = Number(b.precio || b.precio_venta || 0);
        return pb - pa;
      }
      if (sortBy === "ahorro") {
        return (b.ahorro_estimado || 0) - (a.ahorro_estimado || 0);
      }
      if (sortBy === "mas_vendidos") {
        // Mocked por id hasta que haya data de ventas reales
        return b.id - a.id; 
      }
      if (sortBy === "menos_vendidos") {
        return a.id - b.id;
      }
      return 0;
    });

    return result;
  };

  const handleOpenModal = (combo: Combo | null = null) => {
    if (combo) {
      setEditingCombo(combo);
      setFormData({
        nombre: combo.nombre,
        precio: (combo.precio || combo.precio_venta || 0).toString(),
        incluye: combo.incluye,
        ahorro_estimado: combo.ahorro_estimado.toString(),
        img_url: combo.img_url || combo.imagen_url || "",
        platos_seleccionados: combo.platos ? combo.platos.map((p) => p.id) : [],
      });
    } else {
      setEditingCombo(null);
      setFormData(DEFAULT_COMBO_FORM);
    }
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setModalError(null);

    const selectedPlatos = platoOptions.filter((plato) =>
      formData.platos_seleccionados.includes(plato.id),
    );
    const incluye =
      selectedPlatos.length > 0
        ? selectedPlatos.map((plato) => plato.nombre).join(" + ")
        : formData.incluye;

    try {
      const payload = {
        nombre: formData.nombre,
        precio_venta: parseFloat(formData.precio),
        incluye: incluye,
        ahorro_estimado: parseFloat(formData.ahorro_estimado) || 0,
        imagen_url: formData.img_url || "",
        activo: true,
        platos_ref: formData.platos_seleccionados,
      };

      if (editingCombo) {
        await AdminService.updateCombo(editingCombo.id, payload);
      } else {
        await AdminService.createCombo(payload);
      }

      await loadCombos();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error al guardar combo:", error);
      setModalError(error?.response?.data?.detail || "Error al guardar el combo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este combo?")) {
      try {
        await AdminService.deleteCombo(id);
        setCombos(combos.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Error eliminando combo:", error);
      }
    }
  };

  return (
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Gestión de Combos"
        subtitle="Crea paquetes especiales y promociones exclusivas."
      >
        <Button
          size="md"
          icon={<Plus size={14} />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Combo
        </Button>
      </PageHeader>

      {/* Controles de Filtrado Minimalistas */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Buscar combo o productos incluidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-sm text-gray-700"
          />
        </div>

        <div className="relative group min-w-[140px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-akaza-marron/10"
          >
            <option value="">Todos</option>
            <option value="mas_vendidos">Más vendidos</option>
            <option value="menos_vendidos">Menos vendidos</option>
            <option value="nombre">Nombre (A-Z)</option>
            <option value="precio">Mayor precio</option>
            <option value="ahorro">Mayor ahorro</option>
          </select>
        </div>
      </div>

      {/* Grid of ComboCards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {isFetching ? (
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
        ) : getFilteredAndSortedCombos().length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white border border-gray-100 rounded-3xl">
            <Plus className="mx-auto h-12 w-12 text-gray-300 mb-3 opacity-20" />
            <h3 className="text-sm font-bold text-gray-900">No hay combos</h3>
            <p className="text-xs text-gray-500 mt-1">No se encontraron combos creados.</p>
          </div>
        ) : (
          getFilteredAndSortedCombos().map((combo) => (
            <ComboCard 
              key={combo.id} 
              combo={combo} 
              onEdit={handleOpenModal} 
              onDelete={handleDelete} 
            />
          ))
        )}
      </div>

      {/* Modal Form */}
      <ComboModal
        isOpen={isModalOpen}
        editingCombo={editingCombo}
        formData={formData}
        platoOptions={platoOptions}
        isLoading={isLoading}
        error={modalError}
        onChange={(field, value) =>
          setFormData((prev) => ({ ...prev, [field]: value } as ComboFormData))
        }
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </div>
  );
}
