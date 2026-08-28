"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

const STORAGE_KEY = "akaza_chat_history_v1";

function ChatAkazaFinal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // Auth & UI State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  // Guardar en localStorage cada vez que cambie chatHistory
  useEffect(() => {
    if (isMounted && chatHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
      } catch (err) {
        console.error("Error al guardar historial en localStorage:", err);
      }
    }
  }, [chatHistory, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const mesaParam = searchParams.get("mesa");
      const mesaNumero = mesaParam ? Number(mesaParam) : null;
      setNroMesa(Number.isFinite(mesaNumero) ? mesaNumero : null);

      const checkSessionAndHistory = async () => {
        try {
          const data = await AuthService.checkSession();
          const authenticated = Boolean(data?.autenticado);
          setIsLoggedIn(authenticated);
          const currentUserId = data?.id ? Number(data.id) : null;
          setIdUsuario(currentUserId);
          setProfileData((prev) => ({
            ...prev,
            name: data?.nombre || data?.correo || "Usuario",
            email: data?.correo || prev.email,
            allergies: (data as any)?.alergias || "",
            preferences: (data as any)?.preferencias || "",
          }));

          if (authenticated) {
            if (data?.rol === "administrador") {
              router.push("/admin");
              return;
            } else if (data?.rol === "cocinero" || data?.rol === "chef") {
              router.push("/cocina");
              return;
            }
          }

          // Cargar chats guardados de localStorage si existen
          let savedSessions: ChatSession[] = [];
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              savedSessions = JSON.parse(raw);
            }
          } catch (e) {
            console.error("Error leyendo localStorage:", e);
          }

          if (savedSessions.length === 0) {
            savedSessions = ChatbotService.getInitialSession() as unknown as ChatSession[];
          }

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

            if (savedSessions.length > 0) {
              savedSessions[0].messages.push(userMessage);
            }
            setChatHistory(savedSessions);

            try {
              const res = await ChatbotService.sendMessage(currentUserId, mesaNumero, initialPrompt);
              const respuestaIA = res?.respuesta_ia || "Recibí tu mensaje, dame un momento.";
              setChatHistory((prev) =>
                prev.map((session) =>
                  session.id === prev[0]?.id
                    ? { ...session, messages: [...session.messages, { role: "bot", content: respuestaIA }] }
                    : session
                )
              );
              hablarRespuestaIA(respuestaIA);
            } catch (error) {
              setChatHistory((prev) =>
                prev.map((session) =>
                  session.id === prev[0]?.id
                    ? { ...session, messages: [...session.messages, { role: "bot", content: "Error al procesar mensaje." }] }
                    : session
                )
              );
            } finally {
              setIsLoading(false);
            }
          } else {
            setChatHistory(savedSessions);
          }
        } catch {
          setIsLoggedIn(false);
          setIdUsuario(null);
          setChatHistory(ChatbotService.getInitialSession());
        }
      };

      void checkSessionAndHistory();
    }
  }, [isMounted, searchParams, router]);

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");

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
        } else if (data?.rol === "cocinero" || data?.rol === "chef") {
          router.push("/cocina");
          return;
        }

        setIsLoginOpen(false);
        setIsRegisterMode(false);
        setAuthForm({ fullName: "", email: "", password: "" });
      }
    } catch (error: any) {
      const detail = error?.response?.data?.detail ?? error?.response?.data ?? error?.message;
      if (typeof detail === "string") {
        setAuthError(detail);
      } else if (Array.isArray(detail)) {
        const msgs = detail.map((d: any) => (typeof d === "string" ? d : d?.msg || "")).filter(Boolean);
        setAuthError(msgs.join(" | ") || "Error de autenticación");
      } else if (detail && typeof detail === "object" && "msg" in detail) {
        setAuthError(String(detail.msg));
      } else {
        setAuthError("No se pudo autenticar. Verifica tus datos.");
      }
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setIdUsuario(null);
    setUserOrders([]);
    router.push("/");
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setChatHistory((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, title: newTitle.trim() } : session
      )
    );
  };

  const currentSession = chatHistory.find((session) => session.id === currentSessionId);
  const messages = currentSession?.messages ?? [];

  const updateCurrentSessionMessages = (nextMessages: ChatMessage[]) => {
    setChatHistory((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, messages: nextMessages, date: "Ahora" }
          : session
      )
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
    const textoLimpio = textoCrudo
      .replace(/\|\|.*?\|\|/g, "")
      .replace(/\[ORDEN_CONFIRMADA\].*$/s, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .trim();
    if (!textoLimpio) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textoLimpio);
    utterance.lang = "es-PE";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      <div className="flex flex-1 min-h-0">
        <Sidebar
          chatHistory={chatHistory}
          currentSessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          createNewGeneralSession={createNewGeneralSession}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onOpenQr={() => setIsQrOpen(true)}
          onRenameSession={handleRenameSession}
          isLoggedIn={isLoggedIn}
          profileName={profileData.name}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLogout={handleLogout}
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
          onOpenQr={() => setIsQrOpen(true)}
        />
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-akaza-marron/60 backdrop-blur-sm z-[55] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      <AuthModal
        isOpen={isLoginOpen}
        isRegisterMode={isRegisterMode}
        authForm={authForm}
        onClose={() => setIsLoginOpen(false)}
        onToggleMode={() => setIsRegisterMode((prev) => !prev)}
        onSubmit={handleAuthSubmit}
        onChange={(field, value) => setAuthForm((prev) => ({ ...prev, [field]: value }))}
        errorMessage={authError}
      />

      <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <ProfileModal
        isOpen={isProfileOpen}
        profileData={profileData}
        onClose={() => setIsProfileOpen(false)}
        onChange={(f, v) => setProfileData((p) => ({ ...p, [f]: v }))}
      />
      <OrdersModal
        isOpen={isOrdersOpen}
        orders={userOrders}
        onClose={() => setIsOrdersOpen(false)}
        onReorder={() => {}}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-akaza-crema font-serif text-akaza-marron">
          Cargando Asistente Akaza...
        </div>
      }
    >
      <ChatAkazaFinal />
    </Suspense>
  );
}