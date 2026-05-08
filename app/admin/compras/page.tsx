"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, RefreshCw, ShoppingCart, 
  User, Calendar, TrendingUp, TrendingDown, Package, CreditCard 
} from "lucide-react";
import { AdminService } from "@/service/admin.service";
import { Producto, CompraResponse } from "@/ts/types";
import { CompraModal } from "@/component/admin/CompraModal";
import { Button } from "@/component/admin/Button";
import { PageHeader } from "@/component/admin/PageHeader";

export default function ComprasPage() {
  const [compras, setCompras] = useState<CompraResponse[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [comprasData, productosData] = await Promise.all([
        AdminService.getComprasDelDia(),
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

  useEffect(() => { fetchData(); }, []);

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
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-akaza-amarillo transition-colors" size={14} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-akaza-amarillo/20 transition-all cursor-pointer"
          />
        </div>
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
          <span className="text-lg font-bold text-gray-800 tracking-tight">S/ {stats.total.toFixed(2)}</span>
          <span className="text-[9px] font-black text-green-600 bg-green-100/50 px-1.5 py-0.5 rounded-md leading-none">
            +2.4%
          </span>
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
          <span className="text-lg font-bold text-gray-800 tracking-tight">{stats.count}</span>
          <span className="text-[10px] font-medium text-gray-400 uppercase">Registros</span>
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
        <span className="text-sm font-bold text-gray-700 tracking-tight">
          {new Date(selectedDate).toLocaleDateString("es-PE", { 
            day: '2-digit', month: 'long' 
          })}
        </span>
      </div>
    </div>
  </div>
</div>

      {/* TABLA ESTILIZADA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              type="text" 
              placeholder="Filtrar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-akaza-amarillo/50"
            />
          </div>
          <button onClick={fetchData} className="p-2 text-gray-300 hover:text-akaza-marron transition-colors">
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Información</th>
                <th className="px-6 py-4">Insumo</th>
                <th className="px-6 py-4 text-center">Cantidad</th>
                <th className="px-6 py-4 text-center">Precio Unit.</th>
                <th className="px-6 py-4 text-right">Inversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCompras.map((c: any) => {
                const total = c.cantidad_comprada * c.precio_unidad_compra;
                const hora = new Date(c.fecha_compra).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const variacion = c.precio_unidad_compra - (c.producto?.precio_compra_anterior || 0);

                return (
                  <tr key={c.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-800">{hora}</span>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                          <User size={10} /> {c.comprador_nombre || "Admin"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-akaza-amarillo/20 group-hover:text-akaza-marron transition-colors font-bold text-[10px]">
                          {c.producto?.nombre?.substring(0,2).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-gray-700 tracking-tight">{c.producto?.nombre}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-gray-600">{Number(c.cantidad_comprada).toFixed(1)}</span>
                      <span className="text-[10px] text-gray-400 ml-1 font-bold uppercase">{c.unidad_medida}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-700">S/ {Number(c.precio_unidad_compra).toFixed(2)}</span>
                        {c.producto?.precio_compra_anterior && (
                          <div className={`flex items-center gap-0.5 text-[9px] font-black ${variacion > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {variacion > 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                            S/ {Math.abs(variacion).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-black text-xs">
                        S/ {total.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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