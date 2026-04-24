"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { AuthService } from "../service/auth.service";
import { ChatbotService } from "../service/chatbot.service";

type ChatRole = "user" | "bot";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ParsedChunk =
  | { type: "text"; value: string }
  | { type: "dish"; name: string; price: string };

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState("Invitado");
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("general-main");
  const [nroMesa, setNroMesa] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoicePending, setIsVoicePending] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ============================================================
  // 🚩 PUNTO DE CONEXIÓN 1: CARGAR HISTORIAL (GET)
  // ============================================================
  useEffect(() => {
    if (isMounted) {
      const mesaParam = searchParams.get("mesa");
      const mesaNumero = mesaParam ? Number(mesaParam) : null;
      setNroMesa(Number.isFinite(mesaNumero) ? mesaNumero : null);

      const checkSession = async () => {
        try {
          const data = await AuthService.checkSession();
          setIsLoggedIn(Boolean(data?.autenticado));
          setIdUsuario(data?.id_usuario ? Number(data.id_usuario) : null);
          setProfileName(data?.correo || "Invitado");
        } catch {
          setIsLoggedIn(false);
          setIdUsuario(null);
        }
      };

      // El historial es local — carga la sesión inicial de forma síncrona
      setChatHistory(ChatbotService.getInitialSession());
      void checkSession();
    }
  }, [isMounted, searchParams]);

  const currentSession = chatHistory.find((session) => session.id === currentSessionId);
  const messages = currentSession?.messages ?? [];

  const updateCurrentSessionMessages = (nextMessages: ChatMessage[]) => {
    setChatHistory((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: nextMessages,
              date: "Ahora",
            }
          : session,
      ),
    );
  };

  // ============================================================
  // 🚩 PUNTO DE CONEXIÓN 2: ENVIAR MENSAJE (POST)
  // ============================================================
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentSession) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    updateCurrentSessionMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await ChatbotService.sendMessage(
        idUsuario,
        nroMesa ?? currentSession.mesaId,
        input
      );

      const respuestaIA = data?.respuesta_ia || "Recibí tu mensaje, dame un momento.";
      updateCurrentSessionMessages([
        ...messages,
        userMessage,
        { role: "bot", content: respuestaIA },
      ]);
      // 🔊 TAREA 3: Hablar la respuesta en voz alta tras recibirla
      hablarRespuestaIA(respuestaIA);
    } catch (error) {
      console.error("Error al conectar con Python (Chat):", error);
      updateCurrentSessionMessages([
        ...messages,
        userMessage,
        { role: "bot", content: "Hubo un problema al procesar tu mensaje. Intenta otra vez." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 🔊 TAREA 3: TEXT-TO-SPEECH — La IA habla en voz alta
  // ============================================================
  const hablarRespuestaIA = (textoCrudo: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Limpiar marcadores antes de hablar
    const textoLimpio = textoCrudo
      .replace(/\|\|.*?\|\|/g, "")          // eliminar bloques ||...|| de platos
      .replace(/\[ORDEN_CONFIRMADA\].*$/s, "") // eliminar bloque de orden al final
      .replace(/\*\*/g, "")                  // quitar negritas markdown
      .replace(/\*/g, "")                    // quitar cursivas markdown
      .trim();

    if (!textoLimpio) return;

    // Cancelar cualquier lectura previa
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textoLimpio);
    utterance.lang = "es-PE";
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    // Buscar voz femenina preferida (Google Español o Spanish Female)
    const elegirVoz = () => {
      const voces = window.speechSynthesis.getVoices();
      const vozFemenina =
        voces.find((v) => /google.*español/i.test(v.name)) ||
        voces.find((v) => /female/i.test(v.name) && v.lang.startsWith("es")) ||
        voces.find((v) => v.lang.startsWith("es"));
      if (vozFemenina) utterance.voice = vozFemenina;
      window.speechSynthesis.speak(utterance);
    };

    // Las voces pueden tardar en cargarse en algunos navegadores
    if (window.speechSynthesis.getVoices().length > 0) {
      elegirVoz();
    } else {
      window.speechSynthesis.onvoiceschanged = elegirVoz;
    }
  };

  // ============================================================
  // 🎤 TAREA 2: SPEECH-TO-TEXT — Reconocimiento de voz en vivo
  // ============================================================
  const handleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("[Voice] Este navegador no soporta SpeechRecognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-PE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsVoicePending(true);

    recognition.onresult = (event: any) => {
      const textoHablado = event.results[0][0].transcript;
      console.log("[Voice] Texto reconocido:", textoHablado);
      setInput(textoHablado);
      setIsVoicePending(false);
    };

    recognition.onerror = (event: any) => {
      console.error("[Voice] Error de reconocimiento:", event.error);
      setIsVoicePending(false);
    };

    recognition.onend = () => {
      setIsVoicePending(false);
    };

    recognition.start();
  };

  const createNewGeneralSession = () => {
    const newSession: ChatSession = {
      id: `general-${Date.now()}`,
      title: "Nuevo Chat General",
      date: "Ahora",
      mode: "general",
      mesaId: nroMesa,
      messages: [
        {
          role: "bot",
          content: "Hola, soy Akaza. Cuéntame tu consulta y te ayudo.",
        },
      ],
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
        profileName={profileName}
        onOpenLogin={() => {}}
        onOpenQr={() => {}}
        onToggleUserMenu={() => setIsUserMenuOpen((prev) => !prev)}
        onOpenProfile={() => {}}
        onOpenOrders={() => {}}
        onLogout={() => {
          AuthService.logout();
          setIsLoggedIn(false);
          setIsUserMenuOpen(false);
        }}
        onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onScrollToSection={() => {}}
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