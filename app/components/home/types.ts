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

export type OrderStatus = "ESPERA" | "COCINANDO" | "LISTO" | "PAGADO";

export type Order = {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  dishes: string[];
};

export type Dish = {
  n: string;
  p: string;
  d: string;
  img: string;
};
