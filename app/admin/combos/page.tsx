"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2,
  Layers,
  X,
  CheckCircle2
} from "lucide-react";

export default function CombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    incluye: "",
    ahorro_estimado: ""
  });

  useEffect(() => {
    setCombos([
      { id: 1, nombre: "Combo Familiar", precio: 85.00, incluye: "1 Pollo a la brasa + Papas + Ensalada + Gaseosa 1.5L", ahorro_estimado: 15.00 },
      { id: 2, nombre: "Dúo Akaza", precio: 45.00, incluye: "2 Hamburguesas + 2 Papas + 2 Bebidas", ahorro_estimado: 8.50 },
    ]);
  }, []);

  const handleOpenModal = (combo: any = null) => {
    if (combo) {
      setEditingCombo(combo);
      setFormData({
        nombre: combo.nombre,
        precio: combo.precio.toString(),
        incluye: combo.incluye,
        ahorro_estimado: combo.ahorro_estimado.toString()
      });
    } else {
      setEditingCombo(null);
      setFormData({
        nombre: "",
        precio: "",
        incluye: "",
        ahorro_estimado: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (editingCombo) {
        setCombos(combos.map(c => c.id === editingCombo.id ? { ...c, ...formData, id: c.id, precio: parseFloat(formData.precio) } : c));
      } else {
        setCombos([...combos, { ...formData, id: Date.now(), precio: parseFloat(formData.precio) }]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">Gestión de Combos</h1>
          <p className="text-gray-500 mt-1">Crea paquetes especiales y promociones.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Combo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {combos.map((combo) => (
          <div key={combo.id} className="bg-white rounded-[3rem] border-2 border-dashed border-akaza-amarillo p-8 relative hover:border-solid hover:shadow-2xl transition-all group overflow-hidden">
            {/* Discount Badge */}
            <div className="absolute -right-12 top-8 bg-akaza-amarillo text-akaza-marron px-14 py-2 rotate-45 font-black text-xs uppercase tracking-widest shadow-sm">
              Oferta
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-akaza-crema rounded-[2rem] text-akaza-marron group-hover:bg-akaza-amarillo transition-colors">
                <Layers size={32} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(combo)} className="p-3 bg-gray-50 text-gray-400 hover:text-akaza-marron hover:bg-white rounded-2xl transition-all shadow-sm">
                  <Pencil size={20} />
                </button>
                <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-black text-akaza-marron mb-4">{combo.nombre}</h3>
            
            <div className="space-y-3 mb-8">
              {combo.incluye.split(" + ").map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                  <CheckCircle2 size={18} className="text-akaza-amarillo" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between pt-6 border-t border-gray-50">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Ahorras</p>
                <p className="text-lg font-black text-green-600">S/ {parseFloat(combo.ahorro_estimado).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Precio Combo</p>
                <p className="text-4xl font-black text-akaza-marron leading-none">S/ {parseFloat(combo.precio).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-akaza-marron">{editingCombo ? "Editar Combo" : "Nuevo Combo"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">¿Qué incluye? (Usa '+' para separar)</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.incluye}
                  onChange={(e) => setFormData({...formData, incluye: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron resize-none"
                  placeholder="Ej. 1 Pollo + Papas + Ensalada"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Precio Promo</label>
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
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Ahorro Estimado</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.ahorro_estimado}
                    onChange={(e) => setFormData({...formData, ahorro_estimado: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-akaza-marron text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : (editingCombo ? "Actualizar Combo" : "Guardar Combo")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
