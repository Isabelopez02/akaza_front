import { Pedido } from "@/types";

const API_URL = "http://localhost:8000";

export async function obtenerPedidos(): Promise<Pedido[]> {
  try {
    const response = await fetch(`${API_URL}/pedidos`);

    if (!response.ok) {
      throw new Error("Error al obtener pedidos");
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    return [];
  }
}