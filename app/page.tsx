"use client";
import Image from "next/image";
import { useState } from "react";
import {
  MessageCircle,
  X,
  User,
  Lock,
  Mail,
  Send,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const downloadMenu = () => {
    const link = document.createElement("a");
    link.href = "/carta.pdf";
    link.download = "Carta_Akaza_2026.pdf"; // ESTO ES EL NOMBRE CON LA QUE SE GUARDA EL PDF EN LA PC DEL CLIENTE O QUIEN LO VAYA A DESCARGAR . RECUERDA
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const orderViaChat = (plato: string) => {
    setIsChatOpen(true);
    // Esto simula que el usuario ya escribió el nombre del plato
    // Podrías pasarlo a un estado de 'mensajes' si quieres que aparezca escrito
    console.log(`El usuario está interesado en: ${plato}`);
  };

  // Función para que al momento de scrolear el usuario sea mas amigable la interaccion
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-akaza-crema flex flex-col font-sans relative selection:bg-akaza-amarillo selection:text-akaza-marron">
      {/* --- 1. NAVBAR --- */}
      <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-akaza-marron/5 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative w-10 h-10">
            <Image
              src="/logo-akaza.png"
              alt="Logo Akaza"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-akaza-marron font-black tracking-tighter text-2xl uppercase">
            Akaza
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-bold text-akaza-marron/60 uppercase tracking-widest">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-akaza-marron transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection("joyas")}
            className="hover:text-akaza-marron transition-colors"
          >
            Carta
          </button>
          <button
            onClick={() => scrollToSection("nosotros")}
            className="hover:text-akaza-marron transition-colors"
          >
            Nosotros
          </button>
        </div>

        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-akaza-marron text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <User size={16} /> Login
        </button>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 md:py-40">
        <h1 className="text-6xl md:text-8xl font-black text-akaza-marron mb-8 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
          Sabor que <span className="text-akaza-amarillo">inspira</span>,<br />
          conexiones reales.
        </h1>
        <p className="max-w-2xl text-lg text-akaza-marron/60 font-medium mb-12">
          Tradición peruana con un toque moderno en Santa Anita.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* LINK EXTEERNO AL WHATSAPP  */}
          <a
            href="https://wa.me/51986310588" // AQUI VA EL NUMERO DE WHATSAPP 
            target="_blank"
            className="bg-akaza-marron text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-2 justify-center"
          >
            Reservar ahora <ChevronRight size={20} />
          </a>
          <button
            onClick={downloadMenu}
            className="bg-white text-akaza-marron border border-akaza-marron/10 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            Descargar Menú (PDF)
          </button>
        </div>
      </section>

      {/*  3. SECCIÓN DE ESPECIALIDADES (JOYAS)  */}
      <section id="joyas" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="text-center mb-16">
          <h2 className="text-akaza-marron text-5xl font-black tracking-tight mb-4 italic">
            Nuestras Joyas
          </h2>
          <div className="w-24 h-1 bg-akaza-amarillo mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              n: "Ceviche Akaza",
              p: "S/ 38",
              d: "Pesca del día con leche de tigre al ají amarillo.",
              img: "/plato1.jpg",
            },
            {
              n: "Lomo del Huerto",
              p: "S/ 45",
              d: "Cortes finos al wok con reducción de la casa.",
              img: "/plato2.jpg",
            },
            {
              n: "Causa Girasol",
              p: "S/ 32",
              d: "Masa de papa amarilla rellena de pulpa de cangrejo.",
              img: "/plato3.jpg",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-akaza-marron/5"
            >
              {/* Contenedor de la Imagen */}
              <div className="relative h-64 w-full overflow-hidden">
                {/* Imagen del plato (Pon las fotos en /public con estos nombres) */}
                <div className="absolute inset-0 bg-akaza-marron/10 group-hover:bg-transparent transition-colors z-10"></div>
                <Image
                  src={item.img}
                  alt={item.n}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-akaza-marron leading-none">
                    {item.n}
                  </h3>
                  <span className="text-akaza-marron font-black text-xl tracking-tighter">
                    {item.p}
                  </span>
                </div>
                <p className="text-akaza-marron/50 font-medium text-sm leading-relaxed mb-6">
                  {item.d}
                </p>
                <button
                  onClick={() => orderViaChat(item.n)}
                  className="w-full py-4 rounded-xl border-2 border-akaza-marron/5 text-akaza-marron font-black text-sm hover:bg-akaza-amarillo hover:border-akaza-amarillo transition-all uppercase tracking-widest shadow-sm active:scale-95"
                >
                  Pedir por el Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. SECCIÓN NOSOTROS (Para dar sentido al Navbar) --- */}
      <section
        id="nosotros"
        className="bg-akaza-marron py-24 px-6 text-white text-center"
      >
        <div className="max-w-3xl mx-auto">
          <UtensilsCrossed
            size={48}
            className="mx-auto mb-6 text-akaza-amarillo"
          />
          <h2 className="text-4xl font-black mb-6">Nuestra Historia</h2>
          <p className="text-white/70 text-lg leading-relaxed italic">
            "Akaza nació con la idea de llevar la calidez de un girasol a la
            mesa peruana. En el corazón de Santa Anita, buscamos que cada plato
            sea una conexión con nuestras raíces."
          </p>
        </div>
      </section>

      {/* --- 5. MODAL DE LOGIN (Ajustado Estéticamente) --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Fondo desenfocado que justo le tamos dando al login */}
          <div
            className="absolute inset-0 bg-akaza-marron/50 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsLoginOpen(false)}
          ></div>

          {/* Caja del Modal */}
          <div className="relative bg-akaza-crema w-full max-w-md rounded-[2.5rem] shadow-[0_30px_100px_rgba(61,28,2,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 border border-akaza-marron/5">
            {/* Header del Login (Mismo diseño pero más aireado) */}
            <div className="bg-akaza-marron p-12 text-center relative text-white">
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 p-2 shadow-xl flex items-center justify-center">
                <Image
                  src="/logo-akaza.png"
                  alt="Logo"
                  width={60}
                  height={60}
                />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-1">
                ¡Bienvenido!
              </h2>
              <p className="text-akaza-amarillo text-xs font-bold uppercase tracking-widest">
                Acceso Akaza
              </p>
            </div>

            {/* Formulario (Nuevo diseño: minimalista y alto contraste) */}
            <form
              className="p-10 space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-5 top-5 text-akaza-marron/20"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2 tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-5 top-5 text-akaza-marron/20"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo transition-all font-medium text-akaza-marron shadow-inner"
                  />
                </div>
              </div>

              <button className="w-full bg-akaza-marron text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-akaza-marron/20 transition-all text-lg mt-6 active:scale-95">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- 6. WIDGET DE CHATBOT (Ajustado para no chocar arriba) --- */}
      <div className="fixed bottom-8 right-8 z-50">
        {isChatOpen && (
          /* Ajustes de Ingeniería:
      - bottom-[85px]: Separación exacta del botón.
      - h-[calc(100vh-180px)]: Altura dinámica para NO CHOCAR con el navbar.
      - max-h-[500px]: Altura máxima para no ser gigante en pantallas grandes.
    */
          <div className="absolute bottom-[85px] right-0 w-[350px] md:w-[400px] h-[calc(100vh-180px)] max-h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-akaza-marron/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header (Mismo diseño, p-5 para compacidad) */}
            <div className="bg-akaza-marron p-5 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl p-1.5 rotate-3 shadow-inner">
                  <Image
                    src="/logo-akaza.png"
                    alt="Bot"
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight">
                    Asistente Akaza
                  </p>
                  <p className="text-[10px] font-bold text-akaza-amarillo uppercase tracking-widest">
                    En línea
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Chat (p-6 y space-y-4 para mejor lectura) */}
            <div className="flex-1 p-6 bg-akaza-crema/10 overflow-y-auto space-y-4">
              <div className="flex flex-col gap-1 max-w-[90%]">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-akaza-marron shadow-sm border border-akaza-marron/5 font-medium leading-relaxed">
                  ¡Hola! Soy tu guía inteligente. ¿En qué puedo ayudarte hoy?
                </div>
              </div>
            </div>

            {/* Input del Chat (Mismo diseño) */}
            <div className="p-4 bg-white border-t border-akaza-marron/5 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Escribe aquí..."
                className="flex-1 bg-zinc-50 rounded-2xl px-5 py-3.5 text-sm outline-none border border-zinc-100 focus:ring-2 focus:ring-akaza-amarillo/50 Transition-all font-medium"
              />
              <button className="bg-akaza-amarillo p-3.5 rounded-2xl text-akaza-marron shadow-md hover:scale-105 transition-all active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Botón Circular del Chat (Ajustado h-16 w-16) */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-akaza-marron text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white active:scale-90"
        >
          {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>

      {/* --- 7. FOOTER --- */}
      <footer className="py-12 border-t border-akaza-marron/5 text-center bg-white">
        <p className="text-[10px] font-black text-akaza-marron/20 uppercase tracking-[0.5em]">
          Santa Anita, Lima • Akaza Experience 2026
        </p>
      </footer>
    </div>
  );
}
