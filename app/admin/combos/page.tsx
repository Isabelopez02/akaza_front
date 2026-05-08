"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  X,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { ComboCard } from "@/component/admin/ComboCard";
import { ComboModal } from "@/component/admin/ComboModal";
import { ComboFormData, DEFAULT_COMBO_FORM } from "@/component/admin/ComboForm";
import { Combo } from "@/ts/types";

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ComboFormData>(DEFAULT_COMBO_FORM);

  useEffect(() => {
    setCombos([
      { id: 1, nombre: "Combo Familiar", precio: 85.00, incluye: "1 Pollo a la brasa + Papas + Ensalada + Gaseosa 1.5L", ahorro_estimado: 15.00, img_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop" },
      { id: 2, nombre: "Dúo Akaza", precio: 45.00, incluye: "2 Hamburguesas + 2 Papas + 2 Bebidas", ahorro_estimado: 8.50, img_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop" },
    ]);
  }, []);

  const handleOpenModal = (combo: Combo | null = null) => {
    if (combo) {
      setEditingCombo(combo);
      setFormData({
        nombre: combo.nombre,
        precio: combo.precio.toString(),
        incluye: combo.incluye,
        ahorro_estimado: combo.ahorro_estimado.toString(),
        img_url: combo.img_url || ""
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

    setTimeout(() => {
      const newCombo: Combo = {
        id: editingCombo ? editingCombo.id : Date.now(),
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        incluye: formData.incluye,
        ahorro_estimado: parseFloat(formData.ahorro_estimado),
        img_url: formData.img_url
      };

      if (editingCombo) {
        setCombos(combos.map((c) => (c.id === editingCombo.id ? newCombo : c)));
      } else {
        setCombos([...combos, newCombo]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este combo?")) {
      setCombos(combos.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">Gestión de Combos</h1>
          <p className="text-gray-500 mt-1 font-medium">Crea paquetes especiales y promociones exclusivas.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Combo
        </button>
      </div>

      {/* Grid of ComboCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {combos.map((combo) => (
          <ComboCard 
            key={combo.id} 
            combo={combo} 
            onEdit={handleOpenModal} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      {/* Modal Form */}
      <ComboModal
        isOpen={isModalOpen}
        editingCombo={editingCombo}
        formData={formData}
        isLoading={isLoading}
        error={modalError}
        onChange={(field, value) => setFormData({ ...formData, [field]: value })}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </div>
  );
}
