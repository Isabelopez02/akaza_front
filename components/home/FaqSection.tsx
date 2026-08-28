"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "¿Cómo funciona el asistente de Inteligencia Artificial?",
      answer: "Nuestra IA conoce detalladamente la carta marina y las recetas de Akaza. Al chatear con ella, puedes solicitarle sugerencias de platillos personalizadas según tus antojos, alergias, presupuesto o acompañamientos ideales.",
    },
    {
      question: "¿Puedo conversar con la IA a través de Telegram?",
      answer: "Sí. Contamos con integración oficial mediante la API de Telegram. Solo presiona 'Iniciar Chat en Telegram' o busca a @akazita_bot para recibir respuestas automáticas sobre el menú y recomendaciones desde tu celular.",
    },
    {
      question: "¿El bot de Telegram ofrece funciones para la administración?",
      answer: "Así es. Cuando un usuario administrador interactúa con el bot, la API consulta las métricas operativas de la base de datos en tiempo real para generar reportes ejecutivos de ventas, platos más pedidos y estado del restaurante.",
    },
    {
      question: "¿Cómo realizo mi pedido desde la mesa usando el QR?",
      answer: "Al estar en nuestro local, selecciona la opción 'Escanear Mesa' en el menú superior o escanea directamente el código QR de tu mesa. El pedido se enviará al instante a la pantalla de cocina.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-16 sm:py-20 w-full border-b border-gray-100 scroll-mt-14 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* ── ENCABEZADO CON COMBINADO DE FUENTES FIEL A LA SECCIÓN DE IA ── */}
        <div className="text-center space-y-2 mb-12">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-black tracking-tight mb-1">
            Resolvemos tus dudas
          </h3>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
            Preguntas Frecuentes
          </h2>
          <div className="w-28 sm:w-36 h-[2.5px] bg-black mx-auto mt-3 rounded-full" />
        </div>

        {/* ── LISTA DE PREGUNTAS MINIMALISTA (SIN EXCESO DE PADDING O RELLENO) ── */}
        <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left py-2 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-black hover:text-akaza-marron transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 flex-shrink-0 text-black ${
                      isOpen ? "rotate-180 text-akaza-marron" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="pt-2 pb-2 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed animate-in fade-in duration-200">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
