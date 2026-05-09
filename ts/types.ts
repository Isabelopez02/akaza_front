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
  unidad_medida: string;
  stock_actual: number;
  stock_minimo_alerta: number;
  // Precio actual (actualizado con cada compra)
  precio_compra?: number | null;
  // Precio de la compra anterior → para indicador visual de alza
  precio_compra_anterior?: number | null;
  // Mermas (de tabla separada)
  merma_min_porcentaje?: number | null;
  merma_max_porcentaje?: number | null;
};

export type CompraPayload = {
  id_producto: number;
  cantidad: number;
  unidad_medida: string;
  precio_unitario: number;
};

export type CompraResponse = {
  id: number;
  id_producto: number;
  cantidad_comprada: number;
  unidad_medida: string;
  precio_unidad_compra: number;
  fecha_compra: string;
  producto: Producto; // Producto actualizado embebido
};

// --- Tipos para la Receta (Ingredientes del Plato) ---
export type Receta = {
  id?: number;
  id_plato: number;
  id_producto: number;
  cantidad_estimada: number;
  unidad_medida: string;
  es_opcional: boolean;
  producto?: Producto; // Para cuando el backend te devuelve el objeto producto completo
};

// --- Actualización del Tipo Plato ---
export type Plato = {
  id: number;
  nombre: string;
  precio: number; // Mapeado de precio_venta en algunos lugares
  precio_venta?: number; // Valor directo del backend
  descripcion: string;
  img_url: string; // Mapeado de imagen_url
  categoria: string;
  disponible?: boolean;
  // Agregamos esto para que coincida con tu MenuRepository:
  recetas?: Receta[]; 
  productos?: Producto[]; // A veces el backend mapea los productos directamente
};

// --- Tipo para enviar al Backend (Payload) ---
export type RecetaCreate = {
  producto_ref: number | string; // ID o Nombre como espera tu Python
  cantidad_estimada: number;
  unidad_medida: string;
  es_opcional: boolean;
};

export type PlatoCreatePayload = {
  nombre: string;
  descripcion: string;
  precio_venta: number;
  imagen_url: string;
  categoria: string;
  recetas: RecetaCreate[]; // La lista de ingredientes
};

export type Combo = {
  id: number;
  nombre: string;
  precio?: number;
  precio_venta?: number;
  incluye: string;
  ahorro_estimado: number;
  img_url?: string;
  imagen_url?: string;
  platos?: { id: number; nombre: string }[];
};

export type Dish = {
  n: string;
  p: string;
  d: string;
  img: string;
};
