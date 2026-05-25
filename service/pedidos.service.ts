import { Pedido } from "@/types";
import { api } from "@/lib/api";

export async function obtenerPedidos(): Promise<Pedido[]> {
  try {
    const { data } = await api.get("/pedidos");
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}