import { BadgeCheck, ClipboardList, X } from "lucide-react";
import { Order } from "@/types";

type OrdersModalProps = {
  isOpen: boolean;
  orders: Order[];
  onClose: () => void;
  onReorder: (dishName: string) => void;
};

const statusStyles: Record<Order["status"], string> = {
  ESPERA: "bg-zinc-100 text-zinc-700",
  COCINANDO: "bg-amber-100 text-amber-700",
  LISTO: "bg-emerald-100 text-emerald-700",
  PAGADO: "bg-akaza-amarillo/30 text-akaza-marron",
};

export function OrdersModal({
  isOpen,
  orders,
  onClose,
  onReorder,
}: OrdersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-akaza-marron/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-akaza-crema w-full max-w-3xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(61,28,2,0.2)] border border-akaza-marron/5 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
        <div className="bg-akaza-marron px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList size={24} />
            <h3 className="text-2xl font-black">Mis Pedidos</h3>
          </div>
          <button
            onClick={onClose}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-akaza-marron/5 rounded-full flex items-center justify-center text-akaza-marron/40 mb-4 shadow-inner">
                <ClipboardList size={36} />
              </div>
              <h4 className="text-akaza-marron font-black text-xl">¿Aún no has ordenado?</h4>
              <p className="text-sm text-akaza-marron/60 max-w-sm mt-2">
                Escanea el código QR de tu mesa, chatea con Akaza para armar tu pedido, y una vez que lo confirmes aparecerá aquí en tiempo real.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <article
                key={order.id}
                className="bg-white rounded-3xl border border-akaza-marron/5 p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-akaza-marron/40 font-bold">
                      Pedido {order.id}
                    </p>
                    <p className="text-sm text-akaza-marron/60 font-medium">
                      Fecha: {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-akaza-marron font-black text-lg">{order.total}</span>
                  </div>
                </div>

                <ul className="text-sm text-akaza-marron/70 space-y-1 mb-4">
                  {order.dishes.map((dish) => (
                    <li key={dish} className="flex items-center gap-2">
                      <BadgeCheck size={15} className="text-akaza-amarillo" />
                      {dish}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onReorder(order.dishes[0])}
                  className="px-5 py-3 rounded-2xl bg-akaza-marron text-white text-sm font-bold hover:shadow-lg transition-all active:scale-95"
                >
                  Volver a pedir
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
