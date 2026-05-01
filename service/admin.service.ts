import { api } from "@/lib/api";

export const AdminService = {
  // Productos (Insumos/Ingredientes)
  getProductos: async () => {
    const { data } = await api.get("/api/admin/productos");
    return data;
  },
  createProducto: async (producto: any) => {
    const { data } = await api.post("/api/admin/productos", producto);
    return data;
  },
  updateProducto: async (id: number, producto: any) => {
    const { data } = await api.put(`/api/admin/productos/${id}`, producto);
    return data;
  },
  deleteProducto: async (id: number) => {
    const { data } = await api.delete(`/api/admin/productos/${id}`);
    return data;
  },

  // Platos
  getPlatos: async () => {
    const { data } = await api.get("/api/admin/platos");
    return data;
  },
  createPlato: async (plato: any) => {
    const { data } = await api.post("/api/admin/platos", plato);
    return data;
  },
  updatePlato: async (id: number, plato: any) => {
    const { data } = await api.put(`/api/admin/platos/${id}`, plato);
    return data;
  },
  deletePlato: async (id: number) => {
    const { data } = await api.delete(`/api/admin/platos/${id}`);
    return data;
  },

  // Combos
  getCombos: async () => {
    const { data } = await api.get("/api/admin/combos");
    return data;
  },
  createCombo: async (combo: any) => {
    const { data } = await api.post("/api/admin/combos", combo);
    return data;
  },
  updateCombo: async (id: number, combo: any) => {
    const { data } = await api.put(`/api/admin/combos/${id}`, combo);
    return data;
  },
  deleteCombo: async (id: number) => {
    const { data } = await api.delete(`/api/admin/combos/${id}`);
    return data;
  }
};
