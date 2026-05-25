"use client";
import { QrCode, MessageSquareCode, ChefHat } from "lucide-react";

export function HowToOrderSection() {
  const pasos = [
    {
      paso: "01",
      titulo: "Escanea tu Mesa",
      descripcion: "Utiliza tu cámara o haz clic en el botón QR de la barra superior. Esto le asocia tu sesión a la mesa para entregarte la comida fresca.",
      icon: QrCode,
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      paso: "02",
      titulo: "Arma tu Orden",
      descripcion: "Conversa directamente con Akaza. Pídele recomendaciones, indícale alergias o pide platos. Ella confirmará tu pedido en segundos.",
      icon: MessageSquareCode,
      color: "bg-akaza-amarillo/20 text-akaza-marron border-akaza-amarillo/10",
    },
    {
      paso: "03",
      titulo: "Disfruta en Mesa",
      descripcion: "Tu pedido se envía a la cocina al instante. El personal te servirá tus platos calientes y listos en cuestión de minutos.",
      icon: ChefHat,
      color: "bg-green-50 text-green-600 border-green-100",
    },
  ];

  return (
    <section className="bg-akaza-crema/10 py-20 w-full relative overflow-hidden border-y border-akaza-marron/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Cabecera Gourmet */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-black text-akaza-marron/40 uppercase tracking-[4px]">
            Experiencia de Mesa
          </span>
          <h2 className="text-akaza-marron text-3xl sm:text-4xl font-black tracking-tight mt-1.5 mb-3 italic">
            ¿Cómo Realizar tu Pedido?
          </h2>
          <div className="w-16 h-0.5 bg-akaza-amarillo mx-auto"></div>
        </div>

        {/* Tarjetas de Secuencia Conectadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          
          {/* Línea conectora dashed ultra-fina (Solo en pantallas grandes) */}
          <div className="hidden lg:block absolute top-1/2 left-20 right-20 h-0.5 border-t border-dashed border-akaza-marron/15 -translate-y-12 z-0"></div>

          {pasos.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl border border-akaza-marron/5 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center group z-10"
              >
                {/* Círculo indicador de número flotante */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-akaza-marron text-white text-xs font-black flex items-center justify-center border-[3px] border-white shadow-md group-hover:bg-akaza-amarillo group-hover:text-akaza-marron transition-colors duration-500">
                  {p.paso}
                </span>

                {/* Icono de Pasos */}
                <div className={`w-16 h-16 rounded-[1.25rem] border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-inner ${p.color}`}>
                  <Icon size={28} className="transition-transform duration-700 group-hover:rotate-6" />
                </div>

                <h3 className="text-base font-black text-akaza-marron tracking-tight mb-3">
                  {p.titulo}
                </h3>
                <p className="text-xs font-medium text-akaza-marron/50 leading-relaxed">
                  {p.descripcion}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
