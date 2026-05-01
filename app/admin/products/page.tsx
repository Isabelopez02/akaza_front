"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Package,
  ArrowUpDown,
  X
} from "lucide-react";
import { AdminService } from "@/service/admin.service";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    categoria: "Insumo"
  });

  useEffect(() => {
    // Simular carga o conectar a backend real
    setProducts([
      { id: 1, nombre: "Carne de Res", precio_compra: 15.50, precio_venta: 25.00, stock: 50, categoria: "Carnes" },
      { id: 2, nombre: "Papas Amarillas", precio_compra: 2.50, precio_venta: 5.00, stock: 120, categoria: "Verduras" },
      { id: 3, nombre: "Aceite Vegetal", precio_compra: 8.00, precio_venta: 12.00, stock: 30, categoria: "Abarrotes" },
    ]);
  }, []);

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        precio_compra: product.precio_compra.toString(),
        precio_venta: product.precio_venta.toString(),
        stock: product.stock.toString(),
        categoria: product.categoria
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: "",
        precio_compra: "",
        precio_venta: "",
        stock: "",
        categoria: "Insumo"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular API
    setTimeout(() => {
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData, id: p.id } : p));
      } else {
        setProducts([...products, { ...formData, id: Date.now() }]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">Gestión de Productos</h1>
          <p className="text-gray-500 mt-1">Administra tus insumos, precios y existencias.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar producto por nombre..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-akaza-amarillo/50 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <Filter size={18} /> Filtros
          </button>
          <button className="px-4 py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <ArrowUpDown size={18} /> Ordenar
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-8 py-5 font-black">Producto</th>
                <th className="px-8 py-5 font-black">Categoría</th>
                <th className="px-8 py-5 font-black text-right">Precio Compra</th>
                <th className="px-8 py-5 font-black text-right">Precio Venta</th>
                <th className="px-8 py-5 font-black text-center">Stock</th>
                <th className="px-8 py-5 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-akaza-crema/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-akaza-crema flex items-center justify-center text-akaza-marron group-hover:bg-white transition-colors">
                        <Package size={20} />
                      </div>
                      <span className="font-bold text-akaza-marron text-sm">{product.nombre}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{product.categoria}</td>
                  <td className="px-8 py-5 text-sm font-bold text-akaza-marron text-right">S/ {parseFloat(product.precio_compra).toFixed(2)}</td>
                  <td className="px-8 py-5 text-sm font-bold text-green-600 text-right">S/ {parseFloat(product.precio_venta).toFixed(2)}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                      product.stock < 20 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gray-400 hover:text-akaza-marron hover:bg-white rounded-lg transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-akaza-marron">{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                  placeholder="Ej. Carne de Res"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Precio Compra</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.precio_compra}
                    onChange={(e) => setFormData({...formData, precio_compra: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Precio Venta</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.precio_venta}
                    onChange={(e) => setFormData({...formData, precio_venta: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Stock Inicial</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">Categoría</label>
                  <select 
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron appearance-none"
                  >
                    <option value="Carnes">Carnes</option>
                    <option value="Verduras">Verduras</option>
                    <option value="Abarrotes">Abarrotes</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Lácteos">Lácteos</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-akaza-marron text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : (editingProduct ? "Actualizar Producto" : "Guardar Producto")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
