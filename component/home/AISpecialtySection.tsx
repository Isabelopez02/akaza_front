"use client";
import { MessageSquare, ShieldAlert, Sparkles, Utensils } from "lucide-react";

export function AISpecialtySection() {
  const caracteristicas = [
    {
      titulo: "Filtro de Alergias Inteligente",
      descripcion: "Nuestra IA analiza las recetas en tiempo real. Si indicas una alergia (como mariscos o picante), te guiará de forma segura sugiriéndote cambios o alternativas.",
      icon: ShieldAlert,
    },
    {
      titulo: "Recomendaciones Gastronómicas",
      descripcion: "Pregúntale qué comer según tu estado de ánimo, salud (por ejemplo, resfriado) o antojo. Akaza te sugerirá el maridaje y los platos ideales de la casa.",
      icon: Utensils,
    },
    {
      titulo: "Pedidos al Instante sin Esperas",
      descripcion: "Arma tu mesa virtual y confirma tu orden por el chat. El pedido viaja directamente al sistema del chef en cocina en menos de un segundo.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="bg-white py-20 w-full relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* ── COLUMNA IZQUIERDA: MOCKUP DEL CHAT INTERACTIVO ── */}
          <div className="relative bg-[#FAF8F5] rounded-[2rem] border border-akaza-marron/5 p-6 sm:p-8 shadow-sm flex flex-col justify-between h-[420px] max-w-lg mx-auto lg:mx-0 w-full select-none">
            
            {/* Header del Chatbot */}
            <div className="flex items-center gap-3 pb-4 border-b border-akaza-marron/5 flex-shrink-0">
              <div className="w-10 h-10 bg-akaza-marron text-akaza-amarillo font-black text-sm rounded-full flex items-center justify-center shadow-md">
                A
              </div>
              <div>
                <h4 className="text-sm font-black text-akaza-marron leading-tight flex items-center gap-1.5">
                  Akaza Asistente <span>🐚</span>
                </h4>
                <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Activo con IA
                </span>
              </div>
            </div>

            {/* Cuerpo del Diálogo */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 text-xs font-semibold custom-scrollbar">
              
              {/* Mensaje 1 (Bot) */}
              <div className="flex gap-2.5 items-end max-w-[85%]">
                <div className="w-7 h-7 bg-akaza-marron text-white rounded-full flex items-center justify-center text-[10px] shrink-0">
                  A
                </div>
                <div className="bg-white border border-akaza-marron/5 rounded-2xl rounded-bl-none p-3.5 text-akaza-marron shadow-sm leading-relaxed">
                  ¡Hola! 🐚 Te sugiero probar el <b>Ceviche Akaza</b>. Hoy la corvina está fresquísima. ¿Tienes alguna alergia de la que deba cuidar?
                </div>
              </div>

              {/* Mensaje 2 (Usuario) */}
              <div className="flex gap-2.5 items-end justify-end max-w-[85%] ml-auto">
                <div className="bg-akaza-marron text-white rounded-2xl rounded-br-none p-3.5 shadow-sm leading-relaxed text-right">
                  Sí, soy alérgico a los mariscos y al cangrejo.
                </div>
                <div className="w-7 h-7 bg-akaza-amarillo/30 text-akaza-marron rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold">
                  U
                </div>
              </div>

              {/* Mensaje 3 (Bot) */}
              <div className="flex gap-2.5 items-end max-w-[85%]">
                <div className="w-7 h-7 bg-akaza-marron text-white rounded-full flex items-center justify-center text-[10px] shrink-0">
                  A
                </div>
                <div className="bg-white border border-akaza-marron/5 rounded-2xl rounded-bl-none p-3.5 text-akaza-marron shadow-sm leading-relaxed">
                  Entendido 🛡️ Evitaré camarones, pulpo y cangrejo. Te recomiendo el <b>Ceviche Clásico con Corvina pura</b>, libre de mariscos. ¿Deseas que lo preparemos?
                </div>
              </div>

            </div>

            {/* Input del Chat Mocked */}
            <div className="pt-4 border-t border-akaza-marron/5 flex gap-2 flex-shrink-0">
              <div className="flex-1 bg-white border border-akaza-marron/5 rounded-xl px-4 py-2.5 text-[10px] font-semibold text-akaza-marron/30 flex items-center">
                Escribe tu orden o consulta aquí...
              </div>
              <div className="w-9 h-9 bg-akaza-marron text-white rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:bg-akaza-amarillo hover:text-akaza-marron transition-colors">
                <MessageSquare size={14} />
              </div>
            </div>

          </div>

          {/* ── COLUMNA DERECHA: TEXTO Y CARACTERÍSTICAS ── */}
          <div className="space-y-8 lg:pl-6 text-left">
            <div>
              <span className="text-[10px] font-black text-akaza-marron/40 uppercase tracking-[4px]">
                Nuestra Especialidad
              </span>
              <h2 className="text-akaza-marron text-3xl sm:text-4xl font-black tracking-tight mt-1.5 leading-none">
                Inteligencia Artificial Marina
              </h2>
              <p className="text-xs sm:text-sm text-akaza-marron/60 font-medium leading-relaxed mt-4">
                El corazón de Restaurante Akaza es nuestro asistente conversacional inteligente. Diseñado a la medida para revolucionar el servicio en mesa, entiende tus requerimientos tal como lo haría un mesero humano experto.
              </p>
            </div>

            {/* Lista de Características */}
            <div className="space-y-5">
              {caracteristicas.map((car, idx) => {
                const Icon = car.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-akaza-marron/5 text-akaza-marron flex items-center justify-center shrink-0 group-hover:bg-akaza-marron group-hover:text-white transition-all duration-300">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-akaza-marron tracking-tight mb-1">
                        {car.titulo}
                      </h4>
                      <p className="text-[11px] font-medium text-akaza-marron/50 leading-relaxed">
                        {car.descripcion}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
