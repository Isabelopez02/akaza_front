import { api } from "@/lib/api";

export const ChatbotService = {
  // El historial es local — el backend no tiene endpoint de historial
  getInitialSession: () => {
    return [
      {
        id: "general-main",
        title: "Chat General",
        date: "Hoy",
        mode: "general" as const,
        mesaId: null,
        messages: [
          {
            role: "bot" as const,
            content: "¡Bienvenido al centro de atención Akaza! Estoy listo para tomar tu pedido.",
          },
        ],
      },
    ];
  },

  // ✅ Endpoint real: POST /api/chat/mensaje
  // NO requiere token — cualquier usuario puede chatear
  sendMessage: async (id_usuario: number | null, nro_mesa: number | null, mensaje: string) => {
    // Si no está logueado o no tiene mesa, mandar valor ficticio (0) en vez de null/undefined
    const final_id_usuario = id_usuario !== null && id_usuario !== undefined ? id_usuario : 0;
    const final_nro_mesa = nro_mesa !== null && nro_mesa !== undefined ? nro_mesa : 0;
    
    const payload = { id_usuario: final_id_usuario, nro_mesa: final_nro_mesa, mensaje };
    console.log("[ChatbotService] POST /api/chat/mensaje - Enviando (con fallbacks a 0):", payload);
    try {
      const { data } = await api.post("/api/chat/mensaje", payload);
      console.log("[ChatbotService] Respuesta bot:", data);
      // El backend devuelve: { status, mesa, respuesta_ia }
      return data;
    } catch (error) {
      console.error("[ChatbotService] Error enviando mensaje:", error);
      throw error;
    }
  },
};
