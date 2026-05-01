"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2,
  UtensilsCrossed,
  ArrowUpDown,
  X,
  Image as ImageIcon
} from "lucide-react";

export default function DishesPage() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
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
      { id: 1, nombre: "Tacos Al Pastor", precio: 18.00, descripcion: "Tacos tradicionales con piña y salsa.", img_url: "https://images.unsplash.com/photo-1593504049359-74330189a345?w=100&h=100&fit=crop", categoria: "Mexicana" },
      { id: 2, nombre: "Ceviche Clásico", precio: 32.00, descripcion: "Pescado fresco marinado en limón.", img_url: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=100&h=100&fit=crop", categoria: "Marina" },
    ]);
  }, []);

  const handleOpenModal = (dish: any = null) => {
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
      if (editingDish) {
        setDishes(dishes.map(d => d.id === editingDish.id ? { ...d, ...formData, id: d.id, precio: parseFloat(formData.precio) } : d));
      } else {
        setDishes([...dishes, { ...formData, id: Date.now(), precio: parseFloat(formData.precio) }]);
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
          <p className="text-gray-500 mt-1">Crea y edita los platos de tu carta digital.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Plato
        </button>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
            <div className="h-48 relative overflow-hidden">
              <img src={dish.img_url || "/placeholder-dish.jpg"} alt={dish.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-akaza-marron shadow-sm">
                S/ {parseFloat(dish.precio).toFixed(2)}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-akaza-amarillo bg-akaza-marron px-3 py-1 rounded-full">
                  {dish.categoria}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(dish)} className="p-2 text-gray-400 hover:text-akaza-marron transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(dish.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-akaza-marron mb-2">{dish.nombre}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{dish.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-akaza-marron">{editingDish ? "Editar Plato" : "Nuevo Plato"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Precio de Venta</label>
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
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                  placeholder="Describe los ingredientes y preparación..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">URL de Imagen</label>
                <div className="relative">
                  <ImageIcon className="absolute left-5 top-5 text-akaza-marron/20" size={18} />
                  <input 
                    type="text" 
                    value={formData.img_url}
                    onChange={(e) => setFormData({...formData, img_url: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 pl-14 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-akaza-marron text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : (editingDish ? "Actualizar Plato" : "Guardar Plato")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
