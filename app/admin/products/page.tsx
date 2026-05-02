"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  X,
  AlertTriangle,
  Package,
} from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { ProductCard } from "@/component/admin/ProductCard";
import { Producto } from "@/ts/types";

const UNIDADES = ["kg", "litro", "unidad", "gramo", "ml", "paquete", "caja"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    unidad_medida: "kg",
    stock_actual: "",
    stock_minimo_alerta: "",
  });

  const fetchProducts = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const data = await AdminService.getProductos();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Error al cargar productos.";
      setError(msg);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, products]);

  const handleOpenModal = (product: Producto | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        unidad_medida: product.unidad_medida,
        stock_actual: product.stock_actual.toString(),
        stock_minimo_alerta: product.stock_minimo_alerta.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: "",
        unidad_medida: "kg",
        stock_actual: "",
        stock_minimo_alerta: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      nombre: formData.nombre.trim(),
      unidad_medida: formData.unidad_medida,
      stock_actual: parseFloat(formData.stock_actual) || 0,
      stock_minimo_alerta: parseFloat(formData.stock_minimo_alerta) || 0,
    };

    try {
      if (editingProduct) {
        // El backend solo tiene mover-stock para updates, así que refrescamos
        await AdminService.updateProducto(editingProduct.id, { cantidad: payload.stock_actual });
      } else {
        await AdminService.createProducto(payload);
      }
      await fetchProducts();
      setIsModalOpen(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg || JSON.stringify(d)).join(" | "));
      } else {
        setError(typeof detail === "string" ? detail : err?.message || "Error al guardar.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await AdminService.deleteProducto(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Error al eliminar.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">Gestión de Productos</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Administra tus insumos, stock y alertas de reposición.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            disabled={isFetching}
            className="p-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Recargar"
          >
            <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-akaza-marron text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Error global */}
      {error && !isModalOpen && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-akaza-amarillo/50 outline-none font-medium"
          />
        </div>
      </div>

      {/* Grid */}
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 h-52 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-4 opacity-40" />
          <p className="font-bold text-lg">No hay productos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Producto" para agregar uno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-akaza-marron">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); setError(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-medium">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                  Nombre del Insumo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                  placeholder="Ej. Carne de Res"
                  disabled={isLoading}
                />
              </div>

              {/* Unidad y Stock actual */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={formData.unidad_medida}
                    onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron appearance-none"
                    disabled={isLoading}
                  >
                    {UNIDADES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.stock_actual}
                    onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Stock mínimo */}
              <div className="space-y-2">
                <label className="text-xs font-black text-akaza-marron/50 uppercase tracking-widest ml-1">
                  Stock Mínimo de Alerta
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.stock_minimo_alerta}
                  onChange={(e) => setFormData({ ...formData, stock_minimo_alerta: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-4 px-6 outline-none transition-all font-bold text-akaza-marron"
                  placeholder="Ej. 5.00"
                  disabled={isLoading}
                />
                <p className="text-[10px] text-gray-400 ml-1">
                  Se mostrará alerta cuando el stock baje de este valor.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-akaza-marron text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingProduct ? "Actualizar Producto" : "Guardar Producto"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
