"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  X,
  User,
  Lock,
  Mail,
  Send,
  ChevronRight,
  UtensilsCrossed,
  UserPlus,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  
  // ESTADOS DE INTERFAZ
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // --- LÓGICA DE NEGOCIO ---

  const downloadMenu = () => {
    const link = document.createElement("a");
    link.href = "/carta.pdf";
    link.download = "Carta_Akaza_2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const orderViaChat = (plato: string) => {
    router.push(`/chat?item=${encodeURIComponent(plato)}`);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // BACKEND: Esta función ya captura los datos para enviarlos a Python
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>, type: 'login' | 'register') => {
    e.preventDefault();
    
    // Captura de datos del formulario
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(`Enviando a backend Python (${type}):`, { email, password });

    // Ejemplo de conexión que tus compañeros pueden usar:
    /*
    const response = await fetch(`http://tu-api.com/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    */
  };

  return (
    <div className="min-h-screen bg-akaza-crema flex flex-col font-sans relative selection:bg-akaza-amarillo selection:text-akaza-marron">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-akaza-marron/5 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => typeof window !== "undefined" && window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative w-10 h-10">
            <Image src="/logo-akaza.png" alt="Logo Akaza" fill className="object-contain" />
          </div>
          <span className="text-akaza-marron font-black tracking-tighter text-2xl uppercase">Akaza</span>
        </div>

        {/* Navegación Desktop */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-akaza-marron/60 uppercase tracking-widest">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-akaza-marron transition-colors">Inicio</button>
          <button onClick={() => scrollToSection("joyas")} className="hover:text-akaza-marron transition-colors">Carta</button>
          <button onClick={() => scrollToSection("nosotros")} className="hover:text-akaza-marron transition-colors">Nosotros</button>
        </div>

        {/* Acciones de Usuario */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="hidden sm:flex text-akaza-marron px-4 py-2 text-sm font-bold hover:bg-akaza-marron/5 rounded-full transition-all items-center gap-2"
          >
            <UserPlus size={16} /> Registrarse
          </button>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-akaza-marron text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <User size={16} /> Login
          </button>
        </div>
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
          <button
            onClick={() => router.push('/chat')}
            className="bg-akaza-marron text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-2 justify-center"
          >
            Reservar ahora <ChevronRight size={20} />
          </button>

          <button
            onClick={downloadMenu}
            className="bg-white text-akaza-marron border border-akaza-marron/10 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            Descargar Menú (PDF)
          </button>
        </div>
      </section>

      {/* --- 3. SECCIÓN DE JOYAS --- */}
      <section id="joyas" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="text-center mb-16">
          <h2 className="text-akaza-marron text-5xl font-black tracking-tight mb-4 italic">Nuestras Joyas</h2>
          <div className="w-24 h-1 bg-akaza-amarillo mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { n: "Ceviche Akaza", p: "S/ 38", d: "Pesca del día con leche de tigre al ají amarillo.", img: "/plato1.jpg" },
            { n: "Lomo del Huerto", p: "S/ 45", d: "Cortes finos al wok con reducción de la casa.", img: "/plato2.jpg" },
            { n: "Causa Girasol", p: "S/ 32", d: "Masa de papa amarilla rellena de pulpa de cangrejo.", img: "/plato3.jpg" },
          ].map((item, i) => (
            <div key={i} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-akaza-marron/5">
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-akaza-marron/10 group-hover:bg-transparent transition-colors z-10"></div>
                <Image src={item.img} alt={item.n} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-akaza-marron leading-none">{item.n}</h3>
                  <span className="text-akaza-marron font-black text-xl tracking-tighter">{item.p}</span>
                </div>
                <p className="text-akaza-marron/50 font-medium text-sm leading-relaxed mb-6">{item.d}</p>
                <button
                  onClick={() => orderViaChat(item.n)}
                  className="w-full py-4 rounded-xl border-2 border-akaza-marron/5 text-akaza-marron font-black text-sm hover:bg-akaza-amarillo hover:border-akaza-amarillo transition-all uppercase tracking-widest shadow-sm"
                >
                  Pedir por el Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. SECCIÓN NOSOTROS --- */}
      <section id="nosotros" className="bg-akaza-marron py-24 px-6 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <UtensilsCrossed size={48} className="mx-auto mb-6 text-akaza-amarillo" />
          <h2 className="text-4xl font-black mb-6">Nuestra Historia</h2>
          <p className="text-white/70 text-lg leading-relaxed italic">
            "Akaza nació con la idea de llevar la calidez de un girasol a la mesa peruana. En el corazón de Santa Anita, buscamos que cada plato sea una conexión con nuestras raíces."
          </p>
        </div>
      </section>

      {/* --- 5. MODALES (LOGIN Y REGISTRO) --- */}
      {(isLoginOpen || isRegisterOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-akaza-marron/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(false); }}
          ></div>

          <div className="relative bg-akaza-crema w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-akaza-marron/5">
            <div className="bg-akaza-marron p-10 text-center relative text-white">
              <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(false); }} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black mb-1">
                {isLoginOpen ? "¡Bienvenido!" : "Crea tu cuenta"}
              </h2>
              <p className="text-akaza-amarillo text-xs font-bold uppercase tracking-widest">Akaza Experience</p>
            </div>

            <form className="p-10 space-y-4" onSubmit={(e) => handleAuthSubmit(e, isLoginOpen ? 'login' : 'register')}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-5 text-akaza-marron/20" size={18} />
                  <input name="email" type="email" required placeholder="ejemplo@correo.com" className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo font-medium" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-akaza-marron/60 uppercase ml-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-5 text-akaza-marron/20" size={18} />
                  <input name="password" type="password" required placeholder="••••••••" className="w-full bg-white border border-akaza-marron/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-akaza-amarillo font-medium" />
                </div>
              </div>
              <button type="submit" className="w-full bg-akaza-marron text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-akaza-marron/20 transition-all text-lg mt-4 active:scale-95">
                {isLoginOpen ? "Iniciar Sesión" : "Registrarse Ahora"}
              </button>
              <p className="text-center text-xs font-bold text-akaza-marron/40 uppercase tracking-tighter cursor-pointer hover:text-akaza-marron transition-colors" onClick={() => { setIsLoginOpen(!isLoginOpen); setIsRegisterOpen(!isRegisterOpen); }}>
                {isLoginOpen ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </p>
            </form>
          </div>
        </div>
      )}

      {/* --- 6. WIDGET DE CHAT (Burbuja) --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-[350px] bg-white rounded-[2.5rem] shadow-2xl border border-akaza-marron/5 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-akaza-marron p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl p-1.5 shadow-inner flex items-center justify-center">
                  <Image src="/logo-akaza.png" alt="Bot" width={30} height={30} />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight">Asistente Akaza</p>
                  <p className="text-[10px] font-bold text-akaza-amarillo uppercase tracking-widest">En línea</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-akaza-crema/10 space-y-4">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-akaza-marron shadow-sm border border-akaza-marron/5 font-medium">
                ¡Hola! ¿Prefieres hablar conmigo en una ventana más grande?
              </div>
              <button 
                onClick={() => router.push('/chat')}
                className="w-full py-4 bg-akaza-amarillo text-akaza-marron rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-md"
              >
                ABRIR CHAT COMPLETO <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
        
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