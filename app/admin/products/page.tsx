"use client";
import { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, AlertTriangle, Package } from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { ProductCard } from "@/component/admin/ProductCard";
import {
  ProductModal,
  ProductFormData,
  DEFAULT_PRODUCT_FORM,
} from "@/component/admin/ProductModal";
import { Producto } from "@/ts/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_PRODUCT_FORM);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setIsFetching(true);
    setGlobalError(null);
    try {
      const data = await AdminService.getProductos();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail || err?.message || "Error al cargar productos.";
      setGlobalError(msg);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  // ── Búsqueda local ──────────────────────────────────────────────────────────
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

  // ── Modal helpers ───────────────────────────────────────────────────────────
  const handleOpenModal = (product: Producto | null = null) => {
    setModalError(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        unidad_medida: product.unidad_medida,
        stock_actual: product.stock_actual.toString(),
        stock_minimo_alerta: product.stock_minimo_alerta.toString(),
        precio_compra: product.precio_compra?.toString() ?? "",
        merma_min_porcentaje: product.merma_min_porcentaje?.toString() ?? "",
        merma_max_porcentaje: product.merma_max_porcentaje?.toString() ?? "",
      });
    } else {
      setEditingProduct(null);
      setFormData(DEFAULT_PRODUCT_FORM);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleFormChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Submit (crear / editar) ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setModalError(null);

    // Payload que acepta el backend (POST /api/inventario/ → ProductoCreate)
    const backendPayload: Record<string, unknown> = {
      nombre: formData.nombre.trim(),
      unidad_medida: formData.unidad_medida,
      stock_actual: parseFloat(formData.stock_actual) || 0,
      stock_minimo_alerta: parseFloat(formData.stock_minimo_alerta) || 0,
    };

    // Agregar mermas solo si se han ingresado valores válidos
    const mermaMin = parseFloat(formData.merma_min_porcentaje);
    const mermaMax = parseFloat(formData.merma_max_porcentaje);
    if (!isNaN(mermaMin) && !isNaN(mermaMax)) {
      backendPayload.merma_min_porcentaje = mermaMin;
      backendPayload.merma_max_porcentaje = mermaMax;
    }

    try {
      if (editingProduct) {
        // Calcula el delta y lo envía como query param al endpoint mover-stock
        const delta =
          (parseFloat(formData.stock_actual) || 0) - Number(editingProduct.stock_actual);
        await AdminService.updateProductoStock(editingProduct.id, delta);
      } else {
        await AdminService.createProducto(backendPayload);
      }

      // Refresca la lista y cierra el modal
      await fetchProducts();
      setIsModalOpen(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setModalError(detail.map((d: any) => d.msg || JSON.stringify(d)).join(" | "));
      } else {
        setModalError(
          typeof detail === "string" ? detail : err?.message || "Error al guardar."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Actualización inline de producto (tras una compra) ─────────────────────
  const handleProductoActualizado = (productoActualizado: Producto) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productoActualizado.id ? productoActualizado : p))
    );
  };

  // ── Eliminar ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await AdminService.deleteProducto(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setGlobalError(err?.response?.data?.detail || "Error al eliminar el producto.");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-akaza-marron tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Administra insumos, precios de compra, stock y merma estimada.
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
      {globalError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p className="text-sm font-medium">{globalError}</p>
        </div>
      )}

      {/* Búsqueda */}
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

      {/* Grid de tarjetas */}
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[2rem] border border-gray-100 h-60 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-4 opacity-40" />
          <p className="font-bold text-lg">No hay productos registrados</p>
          <p className="text-sm mt-1">
            Haz clic en &quot;Nuevo Producto&quot; para agregar uno.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onProductoActualizado={handleProductoActualizado}
            />
          ))}
        </div>
      )}

      {/* Modal extraído en ProductModal.tsx */}
      <ProductModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        formData={formData}
        isLoading={isLoading}
        error={modalError}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </div>
  );
}
