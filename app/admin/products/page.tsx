"use client";
import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  X
} from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { ProductCard } from "@/component/admin/ProductCard";
import { Producto } from "@/ts/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    categoria: "Insumo"
  });

  useEffect(() => {
    // Simulación de datos
    setProducts([
      { id: 1, nombre: "Carne de Res", precio_compra: 15.50, precio_venta: 25.00, stock: 50, categoria: "Carnes" },
      { id: 2, nombre: "Papas Amarillas", precio_compra: 2.50, precio_venta: 5.00, stock: 120, categoria: "Verduras" },
      { id: 3, nombre: "Aceite Vegetal", precio_compra: 8.00, precio_venta: 12.00, stock: 30, categoria: "Abarrotes" },
    ]);
  }, []);

  const handleOpenModal = (product: Producto | null = null) => {
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
    setTimeout(() => {
      const newProduct: Producto = {
        id: editingProduct ? editingProduct.id : Date.now(),
        nombre: formData.nombre,
        precio_compra: parseFloat(formData.precio_compra),
        precio_venta: parseFloat(formData.precio_venta),
        stock: parseInt(formData.stock),
        categoria: formData.categoria
      };

      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
      } else {
        setProducts([...products, newProduct]);
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
          <p className="text-gray-500 mt-1 font-medium">Administra tus insumos, precios y existencias.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-akaza-marron text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar producto por nombre..." 
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

      {/* Grid of ProductCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onEdit={handleOpenModal} 
            onDelete={handleDelete} 
          />
        ))}
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
                className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
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
