"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Search, RefreshCw, AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { ProductTabla } from "@/component/admin/ProductTabla";
import {
  ProductModal,
  ProductFormData,
  DEFAULT_PRODUCT_FORM,
} from "@/component/admin/ProductModal";
import { Producto } from "@/ts/types";
import { Button } from "@/component/admin/Button";
import { PageHeader } from "@/component/admin/PageHeader";

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

    const precioCompra = parseFloat(formData.precio_compra);
    if (!isNaN(precioCompra) && precioCompra > 0) {
      backendPayload.precio_compra = precioCompra;
    }

    const mermaMin = parseFloat(formData.merma_min_porcentaje);
    const mermaMax = parseFloat(formData.merma_max_porcentaje);
    if (!isNaN(mermaMin)) {
      backendPayload.merma_min_porcentaje = mermaMin;
    }
    if (!isNaN(mermaMax)) {
      backendPayload.merma_max_porcentaje = mermaMax;
    }

    try {
      if (editingProduct) {
        const newStock = parseFloat(formData.stock_actual) || 0;
        const delta = newStock - Number(editingProduct.stock_actual);
        await AdminService.updateProducto(editingProduct.id, backendPayload);
        if (delta !== 0) {
          await AdminService.updateProductoStock(editingProduct.id, delta);
        }
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

  const topExpensiveProducts = useMemo(() => {
    return [...products]
      .map((product) => {
        const current = product.precio_compra ?? 0;
        const previous = product.precio_compra_anterior ?? 0;
        const diff = current - previous;
        const diffPercent = previous > 0 ? (diff / previous) * 100 : null;
        return {
          ...product,
          diff,
          diffPercent,
          importance: previous > 0 ? diff : current,
        };
      })
      .sort((a, b) => {
        if (b.diff !== a.diff) {
          return b.diff - a.diff;
        }
        return (b.precio_compra ?? 0) - (a.precio_compra ?? 0);
      })
      .slice(0, 5);
  }, [products]);

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
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title="Gestión de Productos"
        subtitle="Administra insumos, precios de compra, stock y merma estimada."
      >
        <button
          onClick={fetchProducts}
          disabled={isFetching}
          className="p-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Recargar"
        >
          <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
        </button>
        <Button
          size="md"
          icon={<Plus size={14} />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Producto
        </Button>
      </PageHeader>

      {/* Error global */}
      {globalError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p className="text-sm font-medium">{globalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[70%_30%] gap-6">
        <div className="space-y-6">
          {/* Búsqueda */}
          <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm">
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

          {/* Tabla completa */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">P. Anterior</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">P. Actual</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Variación</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Merma</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                // Skeletons
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">No hay productos registrados</p>
                    <p className="text-sm mt-1">Haz clic en "Nuevo Producto" para agregar uno.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <ProductTabla
                    key={product.id}
                    product={product}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onProductoActualizado={handleProductoActualizado}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Subidas de precio</p>
                <h2 className="text-lg font-black text-akaza-marron">Insumos: precio elevado</h2>
              </div>
            </div>
            <div className="space-y-2"> {/* Reducimos espacio entre cards */}
              {topExpensiveProducts.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-4 text-center text-xs text-gray-500">
                  No hay datos suficientes.
                </div>
              ) : (
                topExpensiveProducts.map((product) => {
                  const current = product.precio_compra ?? 0;
                  const previous = product.precio_compra_anterior ?? 0;
                  const diff = product.diff;
                  const diffPercent = product.diffPercent;
                  const increased = diff > 0;

                  return (
                    <div key={product.id} className="rounded-2xl border border-gray-100 p-3 bg-white shadow-sm hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        
                        {/* Izquierda: Info del Producto */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{product.nombre}</p>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            {product.unidad_medida}
                          </p>
                        </div>

                        {/* Centro: Variación (Badge pequeño) */}
                        <div className="flex flex-col items-end min-w-[70px]">
                          <span className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                            increased ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                          }`}>
                            {increased ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {diffPercent !== null ? `${Math.abs(diffPercent).toFixed(1)}%` : "0%"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {increased ? "+" : ""}S/ {Math.abs(diff).toFixed(2)}
                          </span>
                        </div>

                        {/* Derecha: Precios */}
                        <div className="text-right min-w-[80px]">
                          <p className="text-[10px] text-gray-400 line-through leading-none">
                            {Number(previous) > 0 ? `S/ ${Number(previous).toFixed(2)}` : "—"}
                          </p>
                          <p className="text-sm font-black text-akaza-marron mt-0.5">
                            S/ {Number(current).toFixed(2)}
                          </p>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>

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
