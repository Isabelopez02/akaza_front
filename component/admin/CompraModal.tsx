/**
 * CompraModal — Mini-modal para registrar el ingreso de mercadería de un producto.
 * Se abre desde el botón "+" en cada ProductCard.
 *
 * Llama a POST /api/compras con:
 *   { id_producto, cantidad, unidad_medida, precio_unitario }
 */
"use client";
import { useState } from "react";
import { X, ShoppingCart, RefreshCw, AlertTriangle, Package2 } from "lucide-react";
import { Producto } from "@/ts/types";
import { AdminService } from "@/service/admin.service";

type CompraModalProps = {
  producto: Producto;
  onClose: () => void;
  /** Callback con el producto actualizado para refrescar la card sin re-fetch */
  onSuccess: (productoActualizado: Producto) => void;
};

const UNIDADES = ["kg", "litro", "unidad", "gramo", "ml", "paquete", "caja"];

export function CompraModal({ producto, onClose, onSuccess }: CompraModalProps) {
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState(producto.unidad_medida);
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Precio total calculado en tiempo real
  const precioTotal =
    parseFloat(cantidad) > 0 && parseFloat(precioUnitario) > 0
      ? (parseFloat(cantidad) * parseFloat(precioUnitario)).toFixed(2)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cant = parseFloat(cantidad);
    const precio = parseFloat(precioUnitario);

    if (isNaN(cant) || cant <= 0) {
      setError("Ingresa una cantidad válida mayor a 0.");
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      setError("Ingresa un precio unitario válido mayor a 0.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminService.registrarCompra({
        id_producto: producto.id,
        cantidad: cant,
        unidad_medida: unidad,
        precio_unitario: precio,
      });
      onSuccess(response.producto);
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : err?.message ?? "Error al registrar compra.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-gray-50 border-2 border-transparent focus:border-akaza-amarillo rounded-2xl py-3.5 px-5 outline-none transition-all font-bold text-akaza-marron disabled:opacity-60";
  const labelClass =
    "text-[10px] font-black text-akaza-marron/50 uppercase tracking-widest ml-1 block mb-1.5";

  return (
    <div className="fixed inset-0 bg-akaza-marron/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
              <ShoppingCart size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-akaza-marron leading-tight">
                Registrar Compra
              </h2>
              <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <Package2 size={11} />
                {producto.nombre}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Precio actual del producto (referencia visual) */}
        {producto.precio_compra != null && (
          <div className="mx-6 mt-4 bg-gray-50 rounded-2xl px-4 py-2.5 flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Precio actual
            </span>
            <span className="text-sm font-black text-akaza-marron">
              S/ {Number(producto.precio_compra).toFixed(2)}{" "}
              <span className="text-xs font-medium text-gray-400">/ {producto.unidad_medida}</span>
            </span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-3 text-xs font-medium">
              <AlertTriangle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Cantidad + Unidad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Cantidad</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className={inputClass}
                placeholder="Ej. 5"
                disabled={isLoading}
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Unidad</label>
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                className={inputClass + " appearance-none"}
                disabled={isLoading}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio unitario */}
          <div>
            <label className={labelClass}>Precio por {unidad} (S/)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              className={inputClass}
              placeholder="Ej. 12.50"
              disabled={isLoading}
            />
          </div>

          {/* Total calculado */}
          {precioTotal && (
            <div className="bg-green-50 rounded-2xl px-4 py-3 flex justify-between items-center">
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">
                Total de la compra
              </span>
              <span className="text-lg font-black text-green-700">S/ {precioTotal}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-4 rounded-[1.5rem] font-black text-base hover:bg-green-700 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Confirmar Compra
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
