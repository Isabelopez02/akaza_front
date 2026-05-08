"use client";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Ventas Totales", value: "S/ 12,450", icon: DollarSign, trend: "+12.5%", positive: true },
    { name: "Pedidos Hoy", value: "48", icon: ShoppingBag, trend: "+5.2%", positive: true },
    { name: "Clientes Nuevos", value: "124", icon: Users, trend: "-2.1%", positive: false },
    { name: "Plato Popular", value: "Tacos Al Pastor", icon: TrendingUp, trend: "+18.3%", positive: true },
  ];

  return (
    <div className="admin-page-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-akaza-marron tracking-tight">Panel de Control</h1>
        <p className="text-gray-500 mt-1">Bienvenido de nuevo, aquí tienes el resumen de hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-akaza-crema rounded-2xl text-akaza-marron">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                {stat.trend}
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
            <p className="text-2xl font-black text-akaza-marron mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-akaza-marron text-lg">Pedidos Recientes</h2>
            <button className="text-akaza-marron text-sm font-bold hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-4 font-bold">Pedido</th>
                  <th className="px-6 py-4 font-bold">Mesa</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-akaza-marron text-sm">#ORD-{1000 + i}</p>
                      <p className="text-xs text-gray-400">Hace 15 min</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">Mesa 0{i}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-700">
                        Preparando
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-akaza-marron text-sm">
                      S/ {(Math.random() * 100 + 20).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-akaza-marron text-lg mb-6">Platos más Vendidos</h2>
          <div className="space-y-6">
            {[
              { name: "Tacos Al Pastor", sales: 124, img: "https://images.unsplash.com/photo-1593504049359-74330189a345?w=100&h=100&fit=crop" },
              { name: "Hamburguesa Akaza", sales: 89, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" },
              { name: "Combo Familiar", sales: 67, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop" },
              { name: "Limonada Imperial", sales: 54, img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=100&h=100&fit=crop" },
            ].map((product) => (
              <div key={product.name} className="flex items-center gap-4">
                <img src={product.img} alt={product.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-akaza-marron text-sm leading-tight">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{product.sales} ventas esta semana</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-akaza-crema flex items-center justify-center text-[10px] font-black text-akaza-marron">
                  #{[1, 2, 3, 4][product.sales % 4]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
