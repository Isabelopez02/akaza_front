export interface Pedido {
  id: number;
  mesa: number;
  cliente: string;
  productos: string[];
  estado: "Pendiente" | "Preparando" | "Listo";
}