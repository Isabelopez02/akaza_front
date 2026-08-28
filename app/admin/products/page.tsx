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
        new Promise((resolve) => setTimeout(resolve, 300)) // Force at least 300ms loading!
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
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p className="text-sm font-medium">{globalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6">
        <div className="space-y-6">
          {/* Controles de Filtrado Minimalistas */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={16} />
              <input
                type="text"
                placeholder="Buscar insumo por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-sm text-gray-700"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "desc" ? "default" : "desc")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  sortOrder === "desc" 
                    ? "bg-akaza-marron text-white border-akaza-marron" 
                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <TrendingUp size={14} />
                Mayor Precio
              </button>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "default" : "asc")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  sortOrder === "asc" 
                    ? "bg-akaza-marron text-white border-akaza-marron" 
                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <TrendingDown size={14} />
                Menor Precio
              </button>
            </div>
          </div>

          {/* Tabla completa */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2"> 
                <Package size={16} className="text-akaza-marron opacity-80" />
                <h3 className="text-base font-black text-akaza-marron tracking-tight">Inventario de Insumos</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-akaza-marron" : "text-gray-400 hover:text-gray-600"}`} title="Vista de Tabla">
                    <LayoutList size={16} />
                  </button>
                  <button onClick={() => setViewMode("graph")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "graph" ? "bg-white shadow-sm text-akaza-marron" : "text-gray-400 hover:text-gray-600"}`} title="Vista de Gráfico">
                    <LineChartIcon size={16} />
                  </button>
                </div>
                <button onClick={fetchProducts} disabled={isFetching} className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-akaza-marron transition-colors disabled:opacity-50">
                  <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
            
            {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50/70 border-b border-gray-100">
                  <tr>
                    <th className="px-3.5 py-2.5 text-left text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Producto</th>
                    <th className="px-3.5 py-2.5 text-left text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">P. Anterior</th>
                    <th className="px-3.5 py-2.5 text-left text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">P. Actual</th>
                    <th className="px-3.5 py-2.5 text-left text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Variación</th>
                    <th className="px-3.5 py-2.5 text-left text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Merma</th>
                    <th className="px-3.5 py-2.5 text-right text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isFetching ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50 animate-pulse">
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
                        <td className="px-3.5 py-2.5">
                          <div className="h-3 bg-gray-100 rounded w-16"></div>
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
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                        <Package size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-bold text-gray-500">No se encontraron productos</p>
                        <p className="text-[11px] mt-1 text-gray-400">Prueba con otro término de búsqueda o crea un insumo nuevo.</p>
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
              <div className="p-6 h-[400px] w-full bg-white flex flex-col justify-between">
                {isFetching ? (
                  <div className="w-full h-full flex flex-col justify-between animate-pulse select-none">
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-100 rounded w-16"></div>
                    </div>
                    <div className="flex-1 flex items-end gap-3 w-full pb-6">
                      <div className="relative w-full h-full flex flex-col justify-between border-l border-b border-gray-100 pl-2">
                        <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                          <div className="w-full border-t border-gray-50"></div>
                          <div className="w-full border-t border-gray-50"></div>
                          <div className="w-full border-t border-gray-50"></div>
                          <div className="w-full border-t border-gray-50"></div>
                        </div>
                        {/* Wavy pulsed line mockup */}
                        <svg className="absolute inset-0 w-full h-full text-gray-200" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <path
                            d="M0,45 Q15,10 30,30 T60,15 T90,25 T100,5"
                            fill="none; opacity: 0.1"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                            className="opacity-50"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-200 px-4">
                      <div className="h-3 bg-gray-100 rounded w-8"></div>
                      <div className="h-3 bg-gray-100 rounded w-8"></div>
                      <div className="h-3 bg-gray-100 rounded w-8"></div>
                      <div className="h-3 bg-gray-100 rounded w-8"></div>
                    </div>
                  </div>
                ) : mockChartData.lines.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <LineChartIcon size={32} className="mb-3 opacity-20" />
                    <p className="text-sm font-bold text-gray-500">No hay datos para graficar</p>
                    <p className="text-[11px] mt-1 text-gray-400">No se encontraron productos en tendencia a la {priceTrend === "up" ? "subida" : "bajada"}.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(val) => `S/${val}`} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        labelStyle={{fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px'}}
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
                            strokeWidth={isHovered ? 3 : 1.5}
                            opacity={isFaded ? 0.2 : 1}
                            dot={isHovered ? { r: 4, strokeWidth: 2 } : false}
                            activeDot={{ r: 6, strokeWidth: 0 }}
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

        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden text-left">
            <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center gap-2">
              {priceTrend === "up" ? (
                <TrendingUp size={15} className="text-akaza-marron opacity-80" />
              ) : (
                <TrendingDown size={15} className="text-akaza-marron opacity-80" />
              )}
              <h3 className="font-serif text-sm font-bold text-akaza-marron tracking-tight">Monitor de Mercado</h3>
            </div>

            <div className="p-3 flex flex-col gap-3">
              {/* Selector de Tendencia (Tabs) */}
              <div className="flex bg-gray-50 p-1 rounded-xl">
                <button
                  onClick={() => setPriceTrend("up")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all rounded-lg ${
                    priceTrend === "up" 
                      ? "bg-white text-red-600 shadow-2xs" 
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp size={11} /> Subidas
                </button>
                <button
                  onClick={() => setPriceTrend("down")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all rounded-lg ${
                    priceTrend === "down" 
                      ? "bg-white text-green-600 shadow-2xs" 
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <TrendingDown size={11} /> Bajadas
                </button>
              </div>

              <div className="space-y-2">
                {isFetching ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg border border-gray-100 p-2.5 bg-white flex items-center justify-between gap-2.5 animate-pulse">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="h-3 bg-gray-100 rounded w-10"></div>
                      </div>
                    </div>
                  ))
                ) : (() => {
                  if (topTrendProducts.length === 0) {
                    return (
                      <div className="rounded-xl bg-gray-50 p-4 flex flex-col items-center justify-center text-center gap-1.5 border border-dashed border-gray-200">
                        <Package size={20} className="text-gray-300" />
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
                        className={`rounded-lg border p-2.5 bg-white transition-all cursor-pointer ${hoveredProductId === product.id ? 'border-akaza-marron shadow-xs scale-[1.01]' : 'border-gray-150 shadow-2xs hover:border-gray-300'}`}
                        onMouseEnter={() => setHoveredProductId(product.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                      >
                        <div className="flex items-center justify-between gap-2.5">
                          
                          {/* Info del Producto */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-xs truncate">{product.nombre}</p>
                            <p className="text-[9px] uppercase font-mono font-bold text-gray-400">
                              {product.unidad_medida}
                            </p>
                          </div>

                          {/* Variación */}
                          <div className="flex flex-col items-end min-w-[65px]">
                            <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                              isIncreased ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                            }`}>
                              {isIncreased ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                              {diffPercent !== null ? `${Math.abs(diffPercent).toFixed(1)}%` : "0%"}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono font-medium mt-0.5">
                              {isIncreased ? "+" : "-"} S/ {Math.abs(diff).toFixed(2)}
                            </span>
                          </div>

                          {/* Precios */}
                          <div className="text-right min-w-[65px]">
                            <p className="text-[9px] text-gray-400 line-through leading-none font-mono">
                              {Number(previous) > 0 ? `S/ ${Number(previous).toFixed(2)}` : "—"}
                            </p>
                            <p className="text-xs font-bold font-mono text-akaza-marron mt-0.5">
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
