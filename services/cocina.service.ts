import { api } from "@/lib/api";

export const CocinaService = {
  // ✅ Endpoint real del backend: GET /api/pedidos/mesa/{nro_mesa}
  getPedidosPorMesa: async (nro_mesa: number) => {
    console.log(`[CocinaService] GET /api/pedidos/mesa/${nro_mesa} - Obteniendo pedidos de la mesa`);
    try {
      const { data } = await api.get(`/api/pedidos/mesa/${nro_mesa}`);
      console.log("[CocinaService] Pedidos recibidos:", data);
      return data;
    } catch (error) {
      console.error("[CocinaService] Error listando pedidos:", error);
      throw error;
    }
  },

  // ✅ Endpoint real del backend: PUT /api/pedidos/{id_pedido}/confirmar
  confirmarPedido: async (id_pedido: number) => {
    console.log(`[CocinaService] PUT /api/pedidos/${id_pedido}/confirmar - Confirmando pedido`);
    try {
      const { data } = await api.put(`/api/pedidos/${id_pedido}/confirmar`);
      console.log("[CocinaService] Pedido confirmado:", data);
      return data;
    } catch (error) {
      console.error(`[CocinaService] Error confirmando pedido ${id_pedido}:`, error);
      throw error;
    }
  },

  // ✅ Endpoint real del backend: PUT /api/pedidos/${id_pedido}/preparar
  prepararPedido: async (id_pedido: number) => {
    console.log(`[CocinaService] PUT /api/pedidos/${id_pedido}/preparar`);
    const { data } = await api.put(`/api/pedidos/${id_pedido}/preparar`);
    return data;
  },

  // ✅ Endpoint real del backend: PUT /api/pedidos/${id_pedido}/listo
  listoPedido: async (id_pedido: number) => {
    console.log(`[CocinaService] PUT /api/pedidos/${id_pedido}/listo`);
    const { data } = await api.put(`/api/pedidos/${id_pedido}/listo`);
    return data;
  },

  // ✅ Endpoint real del backend: GET /api/menu/platos
  getMenu: async () => {
    console.log("[CocinaService] GET /api/menu/platos - Obteniendo carta completa");
    try {
      const { data } = await api.get("/api/menu/platos");
      console.log("[CocinaService] Menú recibido:", data);
      return data;
    } catch (error) {
      console.error("[CocinaService] Error obteniendo menú:", error);
      throw error;
    }
  },
};
