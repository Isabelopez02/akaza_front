"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, Search, RefreshCw, AlertTriangle, Package, TrendingUp, TrendingDown, LayoutList, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AdminService } from "@/service/admin.service";
import { ProductTabla } from "@/component/admin/ProductTabla";
import {
  ProductModal,
  ProductFormData,
  DEFAULT_PRODUCT_FORM,
} from "@/component/admin/ProductModal";
import { Producto } from "@/types";
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
  const [priceTrend, setPriceTrend] = useState<"up" | "down">("up");
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setIsFetching(true);
    setGlobalError(null);
    try {
      const [data] = await Promise.all([
        AdminService.getProductos(),
        new Promise((resolve) => setTimeout(resolve, 250))
      ]);
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

  // ── Búsqueda y Filtros ──────────────────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");

  useEffect(() => {
    let result = products;
    if (searchTerm.trim()) {
      result = result.filter((p) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortOrder === "asc") {
      result = [...result].sort((a, b) => (Number(a.precio_compra) || 0) - (Number(b.precio_compra) || 0));
    } else if (sortOrder === "desc") {
      result = [...result].sort((a, b) => (Number(b.precio_compra) || 0) - (Number(a.precio_compra) || 0));
    }
    setFilteredProducts(result);
  }, [searchTerm, sortOrder, products]);

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

  const handleProductoActualizado = (productoActualizado: Producto) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productoActualizado.id ? productoActualizado : p))
    );
  };

  const topTrendProducts = useMemo(() => {
    const withDiffs = [...products]
      .map((product) => {
        const current = Number(product.precio_compra) || 0;
        const previous = Number(product.precio_compra_anterior) || 0;
        const diff = current - previous;
        const diffPercent = previous > 0 ? (diff / previous) * 100 : null;
        return {
          ...product,
          diff,
          diffPercent,
        };
      });

    if (priceTrend === "up") {
      return withDiffs
        .filter(p => p.diff > 0)
        .sort((a, b) => b.diff - a.diff)
        .slice(0, 5);
    } else {
      return withDiffs
        .filter(p => p.diff < 0)
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 5);
    }
  }, [products, priceTrend]);

  const mockChartData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }));
    }

    const relevantProducts = priceTrend === "up" 
      ? products.filter(p => (Number(p.precio_compra) || 0) - (Number(p.precio_compra_anterior) || 0) > 0)
      : products.filter(p => (Number(p.precio_compra) || 0) - (Number(p.precio_compra_anterior) || 0) < 0);

    const data = days.map((day, idx) => {
      const obj: any = { name: day };
      relevantProducts.forEach(p => {
        const current = Number(p.precio_compra) || 0;
        const previous = Number(p.precio_compra_anterior) || current;
        const progress = idx / 14;
        const val = previous + (current - previous) * progress;
        obj[p.nombre] = Number(val.toFixed(2));
      });
      return obj;
    });
    
    return { data, lines: relevantProducts };
  }, [products, priceTrend]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await AdminService.deleteProducto(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setGlobalError(err?.response?.data?.detail || "Error al eliminar el producto.");
    }
  };

  return (
    <div className="admin-page-container space-y-5 animate-in fade-in duration-300">
      
      {/* Header */}
      <PageHeader
        title="Gestión de Insumos"
        subtitle="Administra stock, precios de compra y variación de mercado."
      >
        <Button
          size="md"
          icon={<Plus size={14} />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Insumo
        </Button>
      </PageHeader>

      {/* Error global */}
      {globalError && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3.5 text-xs font-medium">
          <AlertTriangle size={16} className="shrink-0" />
          <p>{globalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-5">
        <div className="space-y-4">
          {/* Controles de Filtrado Minimalistas */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={15} />
              <input
                type="text"
                placeholder="Buscar insumo por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-150 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-2xs text-gray-700"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "desc" ? "default" : "desc")}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                  sortOrder === "desc" 
                    ? "bg-akaza-marron text-white border-akaza-marron" 
                    : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <TrendingUp size={13} />
                Mayor Precio
              </button>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "default" : "asc")}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                  sortOrder === "asc" 
                    ? "bg-akaza-marron text-white border-akaza-marron" 
                    : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <TrendingDown size={13} />
                Menor Precio
              </button>
            </div>
          </div>

          {/* Tabla completa sin la columna Merma */}
          <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-2xs text-left">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2"> 
                <Package size={15} className="text-akaza-marron" />
                <h3 className="font-serif text-sm font-bold text-akaza-marron tracking-tight">Inventario de Insumos</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-150">
                  <button onClick={() => setViewMode("table")} className={`p-1 rounded transition-colors ${viewMode === "table" ? "bg-white shadow-2xs text-akaza-marron font-bold" : "text-gray-400 hover:text-gray-600"}`} title="Vista de Tabla">
                    <LayoutList size={15} />
                  </button>
                  <button onClick={() => setViewMode("graph")} className={`p-1 rounded transition-colors ${viewMode === "graph" ? "bg-white shadow-2xs text-akaza-marron font-bold" : "text-gray-400 hover:text-gray-600"}`} title="Vista de Gráfico">
                    <LineChartIcon size={15} />
                  </button>
                </div>
                <button onClick={fetchProducts} disabled={isFetching} className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-akaza-marron transition-colors disabled:opacity-50 border border-gray-150">
                  <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
            
            {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-3.5 py-2.5 text-left">Producto</th>
                    <th className="px-3.5 py-2.5 text-left">P. Anterior</th>
                    <th className="px-3.5 py-2.5 text-left">P. Actual</th>
                    <th className="px-3.5 py-2.5 text-left">Variación</th>
                    <th className="px-3.5 py-2.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isFetching ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-1 flex-1">
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                              <div className="h-2 bg-gray-100 rounded w-12"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <div className="h-3 bg-gray-100 rounded w-14"></div>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <div className="h-3 bg-gray-200 rounded w-14"></div>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <div className="h-4 bg-gray-100 rounded-md w-10"></div>
                        </td>
                        <td className="px-3.5 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <div className="w-6 h-6 bg-gray-100 rounded"></div>
                            <div className="w-6 h-6 bg-gray-100 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        <Package size={28} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs font-bold text-gray-500">No se encontraron insumos</p>
                        <p className="text-[10px] mt-0.5 text-gray-400">Prueba con otro término de búsqueda o registra un nuevo producto.</p>
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
            ) : (
              <div className="p-4 h-[350px] w-full bg-white flex flex-col justify-between">
                {isFetching ? (
                  <div className="w-full h-full flex flex-col justify-between animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="flex-1 bg-gray-50 rounded-xl my-4"></div>
                  </div>
                ) : mockChartData.lines.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <LineChartIcon size={30} className="mb-2 opacity-20" />
                    <p className="text-xs font-bold text-gray-500">No hay datos para graficar</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{fontSize: 9, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 9, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(val) => `S/${val}`} />
                      <Tooltip 
                        contentStyle={{borderRadius: '10px', border: '1px solid #f0f0f0', fontSize: '11px', fontWeight: 700}}
                      />
                      {mockChartData.lines.map((p, i) => {
                        const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
                        const color = colors[i % colors.length];
                        const isHovered = hoveredProductId === p.id;
                        const isFaded = hoveredProductId !== null && hoveredProductId !== p.id;
                        return (
                          <Line 
                            key={p.id} 
                            type="monotone" 
                            dataKey={p.nombre} 
                            stroke={color} 
                            strokeWidth={isHovered ? 2.5 : 1.5}
                            opacity={isFaded ? 0.2 : 1}
                            dot={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden text-left">
            <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center gap-2">
              {priceTrend === "up" ? (
                <TrendingUp size={15} className="text-akaza-marron opacity-80" />
              ) : (
                <TrendingDown size={15} className="text-akaza-marron opacity-80" />
              )}
              <h3 className="font-serif text-sm font-bold text-akaza-marron tracking-tight">Monitor de Mercado</h3>
            </div>

            <div className="p-3 flex flex-col gap-2.5">
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-150">
                <button
                  onClick={() => setPriceTrend("up")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all rounded-lg ${
                    priceTrend === "up" 
                      ? "bg-white text-rose-600 shadow-2xs font-bold" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <TrendingUp size={11} /> Subidas
                </button>
                <button
                  onClick={() => setPriceTrend("down")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all rounded-lg ${
                    priceTrend === "down" 
                      ? "bg-white text-emerald-700 shadow-2xs font-bold" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <TrendingDown size={11} /> Bajadas
                </button>
              </div>

              <div className="space-y-2">
                {isFetching ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg border border-gray-100 p-2 bg-white flex items-center justify-between gap-2 animate-pulse">
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))
                ) : (() => {
                  if (topTrendProducts.length === 0) {
                    return (
                      <div className="rounded-xl bg-gray-50 p-4 flex flex-col items-center justify-center text-center gap-1 border border-dashed border-gray-200">
                        <Package size={18} className="text-gray-300" />
                        <p className="text-xs font-medium text-gray-500">
                          No se registran {priceTrend === "up" ? "aumentos" : "rebajas"} recientes.
                        </p>
                      </div>
                    );
                  }

                  return topTrendProducts.map((product) => {
                    const current = product.precio_compra ?? 0;
                    const previous = product.precio_compra_anterior ?? 0;
                    const diff = product.diff;
                    const diffPercent = product.diffPercent;
                    const isIncreased = diff > 0;

                    return (
                      <div 
                        key={product.id} 
                        className={`rounded-lg border p-2 bg-white transition-all cursor-pointer ${hoveredProductId === product.id ? 'border-akaza-marron shadow-xs' : 'border-gray-150 shadow-2xs hover:border-gray-300'}`}
                        onMouseEnter={() => setHoveredProductId(product.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-bold text-akaza-marron text-xs truncate">{product.nombre}</p>
                            <p className="text-[9px] uppercase font-mono text-gray-400">
                              {product.unidad_medida}
                            </p>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                              isIncreased ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"
                            }`}>
                              {isIncreased ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                              {diffPercent !== null ? `${Math.abs(diffPercent).toFixed(1)}%` : "0%"}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono mt-0.5">
                              {isIncreased ? "+" : "-"} S/ {Math.abs(diff).toFixed(2)}
                            </span>
                          </div>

                          <div className="text-right shrink-0 min-w-[55px]">
                            <p className="text-[9px] text-gray-400 line-through font-mono">
                              {Number(previous) > 0 ? `S/ ${Number(previous).toFixed(2)}` : "—"}
                            </p>
                            <p className="text-xs font-bold font-mono text-akaza-marron">
                              S/ {Number(current).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </aside>
      </div>

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
