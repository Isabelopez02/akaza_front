export type AuthForm = {
  fullName: string;
  email: string;
  password: string;
};

export type ProfileData = {
  name: string;
  email: string;
  allergies: string;
  preferences: string;
};

export type UserData = {
  id?: number;
  nombre?: string;
  correo?: string;
  rol?: string;
  autenticado?: boolean;
  access_token?: string;
};

export type OrderStatus = "ESPERA" | "COCINANDO" | "LISTO" | "PAGADO";

export type Order = {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  dishes: string[];
};

// --- Tipos para el Backend (Admin) ---

export type Producto = {
  id: number;
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  categoria: string;
};

export type Plato = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  img_url: string;
  categoria: string;
  disponible?: boolean;
};

export type Combo = {
  id: number;
  nombre: string;
  precio: number;
  incluye: string;
  ahorro_estimado: number;
  img_url: string;
};

export type Dish = {
  n: string;
  p: string;
  d: string;
  img: string;
};
