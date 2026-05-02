"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  X,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { DishCard } from "@/component/admin/DishCard";
import { Plato } from "@/ts/types";

export default function DishesPage() {
  const [dishes, setDishes] = useState<Plato[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Plato | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    img_url: "",
    categoria: "Principal"
  });

  useEffect(() => {
    setDishes([
      { id: 1, nombre: "Tacos Al Pastor", precio: 18.00, descripcion: "Tacos tradicionales con piña y salsa.", img_url: "https://images.unsplash.com/photo-1593504049359-74330189a345?w=400&h=400&fit=crop", categoria: "Mexicana" },
      { id: 2, nombre: "Ceviche Clásico", precio: 32.00, descripcion: "Pescado fresco marinado en limón.", img_url: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&h=400&fit=crop", categoria: "Marina" },
    ]);
  }, []);

  const handleOpenModal = (dish: Plato | null = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        nombre: dish.nombre,
        precio: dish.precio.toString(),
        descripcion: dish.descripcion,
        img_url: dish.img_url,
        categoria: dish.categoria
      });
    } else {
      setEditingDish(null);
      setFormData({
        nombre: "",
        precio: "",
        descripcion: "",
        img_url: "",
        categoria: "Principal"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const newDish: Plato = {
        id: editingDish ? editingDish.id : Date.now(),
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        img_url: formData.img_url,
        categoria: formData.categoria
      };

      if (editingDish) {
        setDishes(dishes.map(d => d.id === editingDish.id ? newDish : d));
      } else {
        setDishes([...dishes, newDish]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este plato?")) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">Gestión de Platos</h1>
          <p className="text-gray-500 mt-1 font-medium">Crea y edita los platos de tu carta digital.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Plato
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar plato por nombre..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-akaza-amarillo/50 outline-none font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Filter size={18} /> Filtros
          </button>
          <button className="px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <ArrowUpDown size={18} /> Ordenar
          </button>
        </div>
      </div>

      {/* Grid of DishCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <DishCard 
            key={dish.id} 
            dish={dish} 
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
              <div>
                <h2 className="text-2xl font-black text-akaza-marron">{editingDish ? "Editar Plato" : "Nuevo Plato"}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Información Detallada</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Imagen del Plato</label>
                    <div className="aspect-square w-full rounded-[2.5rem] bg-gray-50 border-4 border-dashed border-gray-100 overflow-hidden relative group transition-all hover:border-akaza-amarillo/30">
                      {formData.img_url ? (
                        <img src={formData.img_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/placeholder-dish.jpg")} />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-3">
                          <ImageIcon size={64} strokeWidth={1} />
                          <p className="text-sm font-bold uppercase tracking-wider">Vista previa</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-akaza-marron/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Upload className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">URL de la Imagen</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-akaza-marron/20" size={18} />
                      <input 
                        type="text" 
                        value={formData.img_url}
                        onChange={(e) => setFormData({...formData, img_url: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-akaza-marron"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Nombre del Plato</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                      placeholder="Ej. Lomo Saltado"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Precio</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Categoría</label>
                      <input 
                        type="text" 
                        required
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                        placeholder="Ej. Criollo"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                      placeholder="Describe los ingredientes..."
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50">
                    {isLoading ? "Guardando..." : (editingDish ? "Actualizar Plato" : "Guardar Plato")}
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
