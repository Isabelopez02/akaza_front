import { api } from "@/lib/api";
import { CompraPayload, CompraResponse } from "@/ts/types";

export const AdminService = {
  // ── Productos (Insumos) ─────────────────────────────────────────────────────
  getProductos: async () => {
    const { data } = await api.get("/api/inventario/");
    return data;
  },
  createProducto: async (producto: Record<string, unknown>) => {
    const { data } = await api.post("/api/inventario/", producto);
    return data;
  },
  updateProductoStock: async (id: number, cantidad: number) => {
    const { data } = await api.put(`/api/inventario/${id}/mover-stock`, null, {
      params: { cantidad },
    });
    return data;
  },
  updateProducto: async (id: number, producto: Record<string, unknown>) => {
    const { data } = await api.put(`/api/inventario/${id}/`, producto);
    return data;
  },
  deleteProducto: async (id: number) => {
    const { data } = await api.delete(`/api/inventario/${id}`);
    return data;
  },

  // ── Módulo de Compras ───────────────────────────────────────────────────────
  getComprasDelDia: async (fecha?: string) => {
    const { data } = await api.get("/api/compras/", {
      params: fecha ? { fecha } : {}
    });
    return data;
  },
  // POST /api/compras → registra la compra, actualiza stock y precio del producto
  registrarCompra: async (payload: CompraPayload): Promise<CompraResponse> => {
    const { data } = await api.post("/api/compras/", payload);
    return data;
  },

  // ── Platos (Admin) ───────────────────────────────────────────────────────
  getPlatos: async () => {
    const { data } = await api.get("/api/admin/platos/");
    return data;
  },
  createPlato: async (plato: any) => {
    const { data } = await api.post("/api/admin/platos/", plato);
    return data;
  },
  updatePlato: async (id: number, plato: any) => {
    const { data } = await api.put(`/api/admin/platos/${id}/`, plato);
    return data;
  },
  deletePlato: async (id: number) => {
    const { data } = await api.delete(`/api/admin/platos/${id}/`);
    return data;
  },

  // Combos
  getCombos: async () => {
    const { data } = await api.get("/api/admin/combos/");
    return data;
  },
  createCombo: async (combo: any) => {
    const { data } = await api.post("/api/admin/combos/", combo);
    return data;
  },
  updateCombo: async (id: number, combo: any) => {
    const { data } = await api.put(`/api/admin/combos/${id}/`, combo);
    return data;
  },
  deleteCombo: async (id: number) => {
    const { data } = await api.delete(`/api/admin/combos/${id}/`);
    return data;
  },

  // ── Usuarios ──────────────────────────────────────────────────────────────
  getUsuarios: async () => {
    const { data } = await api.get("/api/admin/usuarios/");
    return data;
  }
};
