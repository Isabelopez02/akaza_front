"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/layout/Navbar";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { AuthService } from "@/service/auth.service";
import { ChatbotService } from "@/service/chatbot.service";
import { AuthModal } from "@/component/modal/AuthModal";
import { ProfileModal } from "@/component/modal/ProfileModal";
import { OrdersModal } from "@/component/modal/OrdersModal";
import { QrModal } from "@/layout/QrModal";
import { initialProfileData } from "@/types/constants";
import { AuthForm, ProfileData, Order } from "@/types";
import { AdminService } from "@/service/admin.service";

type ChatRole = "user" | "bot";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatSessionMode = "general" | "mesa";

type ChatSession = {
  id: string;
  title: string;
  date: string;
  mode: ChatSessionMode;
  mesaId: number | null;
  messages: ChatMessage[];
};

function ChatAkazaFinal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // Auth & UI State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState<AuthForm>({
    fullName: "",
    email: "",
    password: "",
  });
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  // Chat State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("general-main");
  const [nroMesa, setNroMesa] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoicePending, setIsVoicePending] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const mesaParam = searchParams.get("mesa");
      const mesaNumero = mesaParam ? Number(mesaParam) : null;
      setNroMesa(Number.isFinite(mesaNumero) ? mesaNumero : null);

      const checkSession = async () => {
        try {
          const data = await AuthService.checkSession();
          const authenticated = Boolean(data?.autenticado);
          setIsLoggedIn(authenticated);
          const currentUserId = data?.id ? Number(data.id) : null;
          setIdUsuario(currentUserId);
          setProfileData((prev) => ({
            ...prev,
            name: data?.correo || "Invitado",
            email: data?.correo || prev.email,
          }));
          
          if (authenticated && data?.rol === "administrador") {
            router.push("/admin");
            return;
          }

          // Procesar prompt/category automatizado una vez que la sesión y la mesa están listas
          const promptParam = searchParams.get("prompt");
          const categoryParam = searchParams.get("category");
          
          let initialPrompt = "";
          if (promptParam) {
            initialPrompt = promptParam;
          } else if (categoryParam) {
            initialPrompt = `Muéstrame platos de la categoría ${categoryParam}`;
          }

          if (initialPrompt) {
            setIsLoading(true);
            const userMessage: ChatMessage = { role: "user", content: initialPrompt };
            
            // Establecer el historial inicial agregando la consulta del usuario
            const initialSession = ChatbotService.getInitialSession() as unknown as ChatSession[];
            initialSession[0].messages.push(userMessage);
            setChatHistory(initialSession);

            try {
              const res = await ChatbotService.sendMessage(
                currentUserId, 
                mesaNumero, 
                initialPrompt
              );
              const respuestaIA = res?.respuesta_ia || "Recibí tu mensaje, dame un momento.";
              setChatHistory((prev) =>
                prev.map((session) =>
                  session.id === "general-main"
                    ? { ...session, messages: [...session.messages, { role: "bot", content: respuestaIA }] }
                    : session
                )
              );
              hablarRespuestaIA(respuestaIA);
            } catch (error) {
              setChatHistory((prev) =>
                prev.map((session) =>
                  session.id === "general-main"
                    ? { ...session, messages: [...session.messages, { role: "bot", content: "Error al procesar mensaje." }] }
                    : session
                )
              );
            } finally {
              setIsLoading(false);
            }
          } else {
            setChatHistory(ChatbotService.getInitialSession());
          }

        } catch {
          setIsLoggedIn(false);
          setIdUsuario(null);
          setChatHistory(ChatbotService.getInitialSession());
        }
      };

      void checkSession();
    }
  }, [isMounted, searchParams, router]);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");

    // Validación básica
    if (isRegisterMode && authForm.fullName.length < 3) {
      setAuthError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (authForm.password.length < 6) {
      setAuthError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      if (isRegisterMode) {
        await AuthService.register(authForm.fullName.trim(), authForm.email.trim(), authForm.password);
      }
      const resLogin = await AuthService.login(authForm.email.trim(), authForm.password);
      
      if (resLogin?.access_token) {
        setIsLoggedIn(true);
        const data = await AuthService.checkSession();
        setIdUsuario(data?.id ? Number(data.id) : null);
        setProfileData((prev) => ({
          ...prev,
          name: data?.nombre || authForm.fullName || data?.correo || "Usuario",
          email: data?.correo || authForm.email,
        }));

        if (data?.rol === "administrador") {
          router.push("/admin");
          return;
        }

        setIsLoginOpen(false);
        setIsRegisterMode(false);
        setAuthForm({ fullName: "", email: "", password: "" });
      }
    } catch (error: any) {
      setAuthError(error?.response?.data?.detail || "Error en autenticación");
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setIdUsuario(null);
    setUserOrders([]);
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const openOrdersModal = async () => {
    setIsOrdersOpen(true);
    setIsUserMenuOpen(false);

    try {
      // Obtener el ID de usuario más reciente directamente de la sesión activa
      const sessionData = await AuthService.checkSession();
      const currentUserId = sessionData?.id ? Number(sessionData.id) : idUsuario;
      console.log("[openOrdersModal] currentUserId:", currentUserId);

      const ps = await AdminService.getPlatos();
      const cs = await AdminService.getCombos();
      const allPedidos = await AdminService.getPedidos();
      
      const filtered = allPedidos.filter((p: any) => 
        currentUserId !== null && String(p.id_usuario) === String(currentUserId)
      );
      
      const mappedOrders: Order[] = filtered.map((p: any) => {
        const dishesList = (p.detalles || []).map((det: any) => {
          let name = "Plato";
          if (det.id_plato) {
            const matched = ps.find((x: any) => x.id === det.id_plato);
            if (matched) name = matched.nombre;
          } else if (det.id_combo) {
            const matched = cs.find((x: any) => x.id === det.id_combo);
            if (matched) name = matched.nombre;
          }
          return `${det.cantidad}x ${name}`;
        });
        
        let statusText: "ESPERA" | "COCINANDO" | "LISTO" | "PAGADO" = "ESPERA";
        if (p.estado_pago === "PAGADO") {
          statusText = "PAGADO";
        } else if (p.estado_cocina === "PREPARANDO" || p.estado_cocina === "En proceso") {
          statusText = "COCINANDO";
        } else if (p.estado_cocina === "LISTO" || p.estado_cocina === "Listo") {
          statusText = "LISTO";
        }
        
        return {
          id: p.ticket || `ORD-${p.id}`,
          date: new Date(p.fecha_venta).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          total: `S/ ${Number(p.total).toFixed(2)}`,
          status: statusText,
          dishes: dishesList,
        };
      });
      
      setUserOrders(mappedOrders);
    } catch (err) {
      console.error("Error loading user orders:", err);
    }
  };

  // Chat Handlers
  const currentSession = chatHistory.find((session) => session.id === currentSessionId);
  const messages = currentSession?.messages ?? [];

  const updateCurrentSessionMessages = (nextMessages: ChatMessage[]) => {
    setChatHistory((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: nextMessages, date: "Ahora" }
          : session,
      ),
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentSession) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    updateCurrentSessionMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await ChatbotService.sendMessage(idUsuario, nroMesa ?? currentSession.mesaId, input);
      const respuestaIA = data?.respuesta_ia || "Recibí tu mensaje, dame un momento.";
      updateCurrentSessionMessages([...messages, userMessage, { role: "bot", content: respuestaIA }]);
      hablarRespuestaIA(respuestaIA);
    } catch (error) {
      updateCurrentSessionMessages([...messages, userMessage, { role: "bot", content: "Error al procesar mensaje." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const hablarRespuestaIA = (textoCrudo: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const textoLimpio = textoCrudo.replace(/\|\|.*?\|\|/g, "").replace(/\[ORDEN_CONFIRMADA\].*$/s, "").replace(/\*\*/g, "").replace(/\*/g, "").trim();
    if (!textoLimpio) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textoLimpio);
    utterance.lang = "es-PE";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-PE";
    setIsVoicePending(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onend = () => setIsVoicePending(false);
    recognition.start();
  };

  const createNewGeneralSession = () => {
    const newSession: ChatSession = {
      id: `general-${Date.now()}`,
      title: "Nuevo Chat General",
      date: "Ahora",
      mode: "general",
      mesaId: nroMesa,
      messages: [{ role: "bot", content: "Hola, soy Akaza. ¿En qué puedo ayudarte?" }],
    };
    setChatHistory((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  if (!isMounted) return null;

  return (
    <div className="h-[100dvh] bg-akaza-crema overflow-hidden font-sans flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        isUserMenuOpen={isUserMenuOpen}
        profileName={profileData.name}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenQr={() => setIsQrOpen(true)}
        onToggleUserMenu={() => setIsUserMenuOpen((prev) => !prev)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onLogout={handleLogout}
        onScrollTop={() => router.push("/")}
        onScrollToSection={() => router.push("/")}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          chatHistory={chatHistory}
          currentSessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          createNewGeneralSession={createNewGeneralSession}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <ChatArea
          messages={messages}
          handleSend={handleSend}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleVoiceInput={handleVoiceInput}
          isVoicePending={isVoicePending}
          nroMesa={nroMesa}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {isSidebarOpen && <div className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[55] md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      </div>

      <AuthModal
        isOpen={isLoginOpen}
        isRegisterMode={isRegisterMode}
        authForm={authForm}
        onClose={() => setIsLoginOpen(false)}
        onToggleMode={() => setIsRegisterMode((prev) => !prev)}
        onSubmit={handleAuthSubmit}
        onChange={(field, value) => setAuthForm(prev => ({ ...prev, [field]: value }))}
        errorMessage={authError}
      />

      <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} profileData={profileData} onClose={() => setIsProfileOpen(false)} onChange={(f, v) => setProfileData(p => ({ ...p, [f]: v }))} />
      <OrdersModal isOpen={isOrdersOpen} orders={userOrders} onClose={() => setIsOrdersOpen(false)} onReorder={() => {}} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-akaza-crema">Cargando...</div>}>
      <ChatAkazaFinal />
    </Suspense>
  );
}