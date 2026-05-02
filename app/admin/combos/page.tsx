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
import { Combo } from "@/ts/types";

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    incluye: "",
    ahorro_estimado: "",
    img_url: ""
  });

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
      setFormData({
        nombre: "",
        precio: "",
        incluye: "",
        ahorro_estimado: "",
        img_url: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
        setCombos(combos.map(c => c.id === editingCombo.id ? newCombo : c));
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90dvh] flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-black text-akaza-marron">{editingCombo ? "Editar Combo" : "Nuevo Combo"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Imagen del Combo</label>
                    <div className="aspect-square w-full rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 overflow-hidden relative group">
                      {formData.img_url ? (
                        <img src={formData.img_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/placeholder-dish.jpg")} />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3">
                          <ImageIcon size={64} strokeWidth={1} />
                          <p className="text-sm font-bold tracking-wider">VISTA PREVIA</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-akaza-marron/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={formData.img_url}
                    onChange={(e) => setFormData({...formData, img_url: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="URL de la Imagen"
                  />
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Nombre del Combo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                      placeholder="Ej. Combo Parrillero"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Contenido (separar con '+')</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.incluye}
                      onChange={(e) => setFormData({...formData, incluye: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                      placeholder="Ej. 1 Pollo + Papas + Ensalada"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Precio Combo</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Ahorro S/</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formData.ahorro_estimado}
                        onChange={(e) => setFormData({...formData, ahorro_estimado: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all">
                    {isLoading ? "Guardando..." : (editingCombo ? "Actualizar Combo" : "Guardar Combo")}
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
