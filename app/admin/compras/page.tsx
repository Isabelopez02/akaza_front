"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, RefreshCw, ShoppingCart, 
  User, Calendar, TrendingUp, Package, CreditCard, 
  Calculator, ShoppingBag
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
      console.error("Error cargando datos de compras");
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
    <div className="admin-page-container space-y-5 animate-in fade-in duration-300 text-gray-700">
      
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

      {/* CARDS DE RESUMEN KPI ESTILO DASHBOARD /ADMIN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1 - Inversión Total */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-gray-150 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 text-green-700 flex items-center justify-center">
              <CreditCard size={16} strokeWidth={2.2} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              INVERSIÓN
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Inversión Total
            </p>
            {isFetching ? (
              <div className="h-5 w-24 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className="font-serif text-base sm:text-lg font-black tracking-tight text-akaza-marron leading-tight">
                S/ {stats.total.toFixed(2)}
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Monto ejecutado en compras</p>
          </div>
        </div>

        {/* Card 2 - Insumos Comprados */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-gray-150 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingCart size={16} strokeWidth={2.2} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              REGISTROS
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Insumos Adquiridos
            </p>
            {isFetching ? (
              <div className="h-5 w-16 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className="font-serif text-base sm:text-lg font-black tracking-tight text-akaza-marron leading-tight">
                {stats.count} <span className="text-xs font-sans text-gray-500 font-medium">operaciones</span>
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Total de ítems ingresados</p>
          </div>
        </div>

        {/* Card 3 - Periodo Seleccionado */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-gray-150 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[105px] text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center">
              <Calendar size={16} strokeWidth={2.2} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              PERIODO
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
              Fecha de Consulta
            </p>
            {isFetching ? (
              <div className="h-5 w-24 rounded bg-gray-200 animate-pulse my-1" />
            ) : (
              <p className="font-serif text-sm sm:text-base font-bold text-akaza-marron tracking-tight leading-tight truncate">
                {(() => {
                  if (!selectedDate) return "Selecciona fecha";
                  const d = new Date(`${selectedDate}T12:00:00`);
                  if (isNaN(d.getTime())) return "Fecha Inválida";
                  return new Intl.DateTimeFormat("es-PE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    timeZone: "America/Lima",
                  }).format(d);
                })()}
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Filtro por jornada</p>
          </div>
        </div>

      </div>

      {/* CONTROLES DE FILTRADO MINIMALISTAS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative group flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-marron transition-colors pointer-events-none" size={15} />
          <input 
            type="text" 
            placeholder="Buscar por nombre de insumo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-150 rounded-xl text-xs focus:ring-2 focus:ring-akaza-marron/10 outline-none transition-all shadow-2xs text-gray-700"
          />
        </div>

        <div className="relative group min-w-[150px]">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-150 rounded-xl text-xs font-mono font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-2xs cursor-pointer outline-none focus:ring-2 focus:ring-akaza-marron/10"
          />
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL TABLA + RESUMEN COMPACTO */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* 1. TABLA PRINCIPAL DE COMPRAS COMPACTA */}
        <div className="flex-1 w-full bg-white rounded-xl border border-gray-150 shadow-2xs overflow-hidden text-left">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-sm font-bold text-akaza-marron tracking-tight">Detalle de Compras</h3>
              <p className="text-[10px] text-gray-400 font-medium">Historial de movimientos de inventario</p>
            </div>
            <button onClick={fetchData} className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-akaza-marron transition-all">
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-3.5 py-2.5">Hora / Usuario</th>
                  <th className="px-3.5 py-2.5">Insumo</th>
                  <th className="px-3.5 py-2.5 text-center">Cantidad</th>
                  <th className="px-3.5 py-2.5 text-center">Precio Unit.</th>
                  <th className="px-3.5 py-2.5 text-right">Inversión Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isFetching ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-3.5 py-2.5">
                        <div className="space-y-1">
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                          <div className="h-2 bg-gray-100 rounded w-14"></div>
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-gray-100 rounded-lg"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <div className="h-3 bg-gray-200 rounded w-10 mx-auto"></div>
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <div className="h-3 bg-gray-200 rounded w-14 mx-auto"></div>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <div className="h-5 bg-gray-100 rounded-md w-16 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCompras.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      <Package size={28} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold text-gray-500">No se encontraron compras en esta fecha</p>
                    </td>
                  </tr>
                ) : (
                  filteredCompras.map((c: any) => {
                    const total = c.cantidad_comprada * c.precio_unidad_compra;
                    const hora = new Date(c.fecha_compra).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const variacion = c.precio_unidad_compra - (c.producto?.precio_compra_anterior || 0);

                    return (
                      <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-3.5 py-2.5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold font-mono text-gray-800">{hora}</span>
                            <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400 uppercase">
                              <User size={9} /> {c.comprador_nombre || "Admin"}
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-akaza-marron group-hover:text-white transition-all font-mono text-[9px] font-bold shrink-0">
                              {c.producto?.nombre?.substring(0, 2).toUpperCase()}
                            </div>
                            <p className="text-xs font-bold text-gray-800 truncate">{c.producto?.nombre}</p>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                          <span className="text-xs font-bold font-mono text-gray-700">{Number(c.cantidad_comprada).toFixed(1)}</span>
                          <span className="text-[9px] text-gray-400 ml-1 font-mono uppercase">{c.unidad_medida}</span>
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                          <div className="inline-flex flex-col">
                            <span className="text-xs font-bold font-mono text-gray-800">S/ {Number(c.precio_unidad_compra).toFixed(2)}</span>
                            {c.producto?.precio_compra_anterior && (
                              <span className={`text-[9px] font-mono font-bold ${variacion > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {variacion > 0 ? '▲' : '▼'} S/ {Math.abs(variacion).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 text-right">
                          <span className="bg-akaza-marron/5 text-akaza-marron px-2.5 py-1 rounded-md font-mono text-xs font-bold border border-akaza-marron/10">
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

        {/* 2. PANEL LATERAL COMPACTO DE RESUMEN */}
        <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0">
          
          {/* Card Gasto Total */}
          <div className="bg-akaza-marron rounded-xl p-4 text-white shadow-md relative overflow-hidden group text-left">
            <div className="relative z-10">
              <p className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-70 mb-0.5">Inversión del Día</p>
              {isFetching ? (
                <div className="h-5 w-28 bg-white/20 rounded animate-pulse my-1" />
              ) : (
                <h4 className="font-serif text-lg font-black tracking-tight">
                  S/ {filteredCompras.reduce((acc, curr) => acc + (curr.cantidad_comprada * curr.precio_unidad_compra), 0).toFixed(2)}
                </h4>
              )}
              <div className="mt-2 flex items-center gap-2">
                {isFetching ? (
                  <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                ) : (
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-mono font-bold">
                    {filteredCompras.length} operaciones
                  </span>
                )}
              </div>
            </div>
            <ShoppingBag className="absolute -right-3 -bottom-3 text-white/5 w-20 h-20 group-hover:scale-110 transition-transform" />
          </div>

          {/* Card Informativa 1 */}
          <div className="bg-white rounded-xl p-3 border border-gray-150 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-orange-50 text-orange-600 rounded-md flex items-center justify-center">
                <TrendingUp size={13} />
              </div>
              <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Mayor Costo Unit.</p>
            </div>
            {isFetching ? (
              <div className="h-3.5 bg-gray-200 rounded animate-pulse w-3/4" />
            ) : (
              <p className="text-xs font-bold text-gray-800 truncate">
                {filteredCompras.length > 0 
                  ? filteredCompras.reduce((prev, curr) => (prev.precio_unidad_compra > curr.precio_unidad_compra) ? prev : curr).producto?.nombre 
                  : "---"}
              </p>
            )}
          </div>

          {/* Card Informativa 2 */}
          <div className="bg-gray-50/70 rounded-xl p-3 border border-dashed border-gray-200 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Calculator size={13} className="text-gray-400" />
              <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">Promedio / Compra</p>
            </div>
            {isFetching ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            ) : (
              <p className="font-serif text-sm font-black text-akaza-marron">
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