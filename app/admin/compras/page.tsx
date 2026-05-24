"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, RefreshCw, ShoppingCart, 
  User, Calendar, TrendingUp, TrendingDown, Package, CreditCard, 
  Calculator,
  ShoppingBag
} from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { Producto, CompraResponse } from "@/types";
import { CompraModal } from "@/app/admin/combos/_components/CompraModal";
import { Button } from "@/component/admin/Button";
import { PageHeader } from "@/component/admin/PageHeader";

export default function ComprasPage() {
  const [compras, setCompras] = useState<CompraResponse[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Lima",
    })
    );
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [comprasData, productosData] = await Promise.all([
        AdminService.getComprasDelDia(selectedDate),
        AdminService.getProductos()
      ]);
      setCompras(comprasData);
      setProductos(productosData);
    } catch (err) {
      console.error("Error cargando datos");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedDate]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleSubmitExistente = async (id_producto: number, cantidad: number, unidad_medida: string, precio_total: number) => {
    setIsLoadingSubmit(true);
    setModalError(null);
    try {
      const precio_unitario = precio_total / cantidad;
      await AdminService.registrarCompra({
        id_producto,
        cantidad,
        unidad_medida,
        precio_unitario,
      });
      await fetchData();
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err?.response?.data?.detail || "Error al registrar la compra.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleSubmitNuevo = async (nombre: string, cantidad: number, unidad_medida: string, precio_total: number) => {
    setIsLoadingSubmit(true);
    setModalError(null);
    try {
      const precio_unitario = precio_total / cantidad;
      await AdminService.createProducto({
        nombre: nombre.trim(),
        unidad_medida,
        stock_actual: cantidad,
        stock_minimo_alerta: 0,
        precio_compra: precio_unitario,
      });
      await fetchData();
      setIsModalOpen(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail) ? JSON.stringify(detail) : detail;
      setModalError(msg || "Error al registrar el nuevo insumo.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  // --- Lógica de Filtrado y Stats ---
  const filteredCompras = useMemo(() => {
    return compras.filter((c) => {
      const matchesDate = c.fecha_compra.startsWith(selectedDate);
      const matchesSearch = c.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });
  }, [compras, selectedDate, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredCompras.reduce((acc, c) => acc + (c.cantidad_comprada * c.precio_unidad_compra), 0);
    return { total, count: filteredCompras.length };
  }, [filteredCompras]);

  return (
    <div className="admin-page-container space-y-8 text-gray-700">
      
      {/* HEADER COMPACTO */}
      <PageHeader
        title="Historial de Abastecimiento"
        subtitle="Control detallado de ingresos y costos"
      >
        <Button
          size="md"
          icon={<Plus size={14} />}
          onClick={() => setIsModalOpen(true)}
        >
          Nueva Compra
        </Button>
      </PageHeader>

      {/* CARDS DE RESUMEN PEQUEÑAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1 - Inversión Total */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            {/* Ghost Icon: Muy sutil y más pequeño */}
            <CreditCard className="absolute -right-1 -bottom-1 text-gray-100/40 -rotate-12 transition-transform group-hover:rotate-0 duration-500" size={64} />
            
            <div className="relative z-10 flex items-center gap-4">
            {/* Icono Principal: Menos "pesado" */}
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100/50">
                <CreditCard size={18} />
            </div>
            
            <div className="flex flex-col">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Inversión Total</p>
                <div className="flex items-center gap-2">
                {isFetching ? (
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">S/ {stats.total.toFixed(2)}</span>
                    <span className="text-[9px] font-black text-green-600 bg-green-100/50 px-1.5 py-0.5 rounded-md leading-none">
                        +2.4%
                    </span>
                  </>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Card 2 - Productos */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <ShoppingCart className="absolute -right-1 -bottom-1 text-gray-100/40 -rotate-12 transition-transform group-hover:rotate-0 duration-500" size={64} />
            
            <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50">
                <ShoppingCart size={18} />
            </div>
            
            <div className="flex flex-col">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Insumos</p>
                <div className="flex items-baseline gap-1">
                {isFetching ? (
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">{stats.count}</span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase">Registros</span>
                  </>
                )}
                </div>
            </div>
            </div>
        </div>

        {/* Card 3 - Fecha de Consulta */}
        <div className="relative group overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <Calendar className="absolute -right-1 -bottom-1 text-gray-100/40 -rotate-12 transition-transform group-hover:rotate-0 duration-500" size={64} />
            
            <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/50">
                <Calendar size={18} />
            </div>
            
            <div className="flex flex-col">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Periodo</p>
                {isFetching ? (
                  <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mt-1" />
                ) : (
                  <span className="text-sm font-bold text-gray-700 tracking-tight">
                    {(() => {
                      if (!selectedDate) return "Selecciona una fecha";
                      const d = new Date(`${selectedDate}T12:00:00`);
                      if (isNaN(d.getTime())) return "Fecha Inválida";
                      return new Intl.DateTimeFormat("es-PE", {
                          day: "2-digit",
                          month: "long",
                          timeZone: "America/Lima",
                      }).format(d);
                    })()}
                  </span>
                )}
            </div>
            </div>
        </div>
    </div>

      {/* Controles de Filtrado Minimalistas */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre de insumo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-sm text-gray-700"
          />
        </div>

        <div className="relative group min-w-[160px]">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-akaza-marron/10"
          />
        </div>
      </div>
        {/* CONTENEDOR PRINCIPAL CON LAYOUT DINÁMICO */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* 1. TABLA PRINCIPAL (Se expande lo más posible) */}
        <div className="flex-1 w-full bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between gap-4">
            <div>
                <h3 className="text-sm font-black text-akaza-marron tracking-tight uppercase">Detalle de Compras</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Historial de movimientos</p>
            </div>
            <button onClick={fetchData} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-akaza-marron transition-all active:scale-95">
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
            </button>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-4">Información</th>
                    <th className="px-8 py-4">Insumo</th>
                    <th className="px-8 py-4 text-center">Cantidad</th>
                    <th className="px-8 py-4 text-center">Precio Unit.</th>
                    <th className="px-8 py-4 text-right">Inversión</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {isFetching ? (
                  // Skeletons de tabla alineados con la estructura de columnas
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-5">
                        <div className="space-y-1.5">
                          <div className="h-3.5 bg-gray-200 rounded w-12"></div>
                          <div className="h-2.5 bg-gray-100 rounded w-16"></div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-xl"></div>
                          <div className="h-3.5 bg-gray-200 rounded w-28"></div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="h-3.5 bg-gray-200 rounded w-10 mx-auto"></div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="h-3.5 bg-gray-200 rounded w-16 mx-auto"></div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="h-7 bg-gray-100 rounded-xl w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCompras.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                      <Package size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold text-gray-500">No se encontraron compras</p>
                    </td>
                  </tr>
                ) : (
                  filteredCompras.map((c: any) => {
                    const total = c.cantidad_comprada * c.precio_unidad_compra;
                    const hora = new Date(c.fecha_compra).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const variacion = c.precio_unidad_compra - (c.producto?.precio_compra_anterior || 0);

                    return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-all group">
                        {/* ... (Tus celdas de tabla actuales sin cambios) ... */}
                        <td className="px-8 py-5">
                        {/* Contenido de Hora/Comprador */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-800">{hora}</span>
                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase">
                                <User size={10} /> {c.comprador_nombre || "Admin"}
                            </div>
                            </div>
                        </td>
                        <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-akaza-marron group-hover:text-white transition-all font-black text-[10px] shadow-sm">
                                {c.producto?.nombre?.substring(0,2).toUpperCase()}
                            </div>
                            <p className="text-sm font-black text-gray-700">{c.producto?.nombre}</p>
                            </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                        <span className="text-sm font-black text-gray-600">{Number(c.cantidad_comprada).toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400 ml-1 font-bold uppercase">{c.unidad_medida}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                            <div className="inline-flex flex-col">
                            <span className="text-sm font-black text-gray-800">S/ {Number(c.precio_unidad_compra).toFixed(2)}</span>
                            {c.producto?.precio_compra_anterior && (
                                <span className={`text-[9px] font-black ${variacion > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {variacion > 0 ? '▲' : '▼'} S/ {Math.abs(variacion).toFixed(2)}
                                </span>
                            )}
                            </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                        <span className="bg-akaza-marron/5 text-akaza-marron px-4 py-2 rounded-xl font-black text-xs border border-akaza-marron/10">
                            S/ {total.toFixed(2)}
                        </span>
                        </td>
                    </tr>
                    );
                  })
                )}
                </tbody>
            </table>
            </div>
        </div>

        {/* 2. PANEL DE RESUMEN (Sidebar lateral que no roba demasiado espacio) */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
            
            {/* Card Gasto Total */}
            <div className="bg-akaza-marron rounded-[1.3rem] p-6 text-white shadow-xl shadow-akaza-marron/20 relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Inversión Total</p>
                    {isFetching ? (
                      <div className="h-6 w-32 bg-white/20 rounded animate-pulse mt-1" />
                    ) : (
                      <h4 className="text-xl font-black tracking-tighter animate-in fade-in">
                        S/ {filteredCompras.reduce((acc, curr) => acc + (curr.cantidad_comprada * curr.precio_unidad_compra), 0).toFixed(2)}
                      </h4>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                    {isFetching ? (
                      <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
                    ) : (
                      <div className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold animate-in fade-in">
                          {filteredCompras.length} operaciones
                      </div>
                    )}
                    </div>
                </div>
            <ShoppingBag className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
            </div>

            {/* Card Informativa Pequeña 1 */}
            <div className="bg-white rounded-[1.3rem] p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Insumo Mayor</p>
                </div>
                {isFetching ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mt-1" />
                ) : (
                  <p className="text-sm font-black text-gray-700 truncate animate-in fade-in">
                      {filteredCompras.length > 0 
                      ? filteredCompras.reduce((prev, curr) => (prev.precio_unidad_compra > curr.precio_unidad_compra) ? prev : curr).producto?.nombre 
                      : "---"}
                  </p>
                )}
            </div>

            {/* Card Informativa Pequeña 2 */}
            <div className="bg-gray-50/50 rounded-[1.3rem] p-5 border border-dashed border-gray-200">
                <div className="flex items-center gap-3 mb-1">
                    <Calculator size={16} className="text-gray-400" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promedio / Compra</p>
                </div>
                {isFetching ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mt-1" />
                ) : (
                  <p className="text-xl font-black text-akaza-marron animate-in fade-in">
                      S/ {filteredCompras.length > 0 
                      ? (filteredCompras.reduce((acc, curr) => acc + (curr.cantidad_comprada * curr.precio_unidad_compra), 0) / filteredCompras.length).toFixed(2)
                      : "0.00"}
                  </p>
                )}
            </div>

        </div>
        </div>

      <CompraModal 
        isOpen={isModalOpen} 
        productos={productos} 
        isLoading={isLoadingSubmit} 
        error={modalError}
        onSubmitExistente={handleSubmitExistente}
        onSubmitNuevo={handleSubmitNuevo}
        onClose={handleCloseModal} 
      />
    </div>
  );
}