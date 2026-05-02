import { Dish, Order, ProfileData } from "./types";

export const featuredDishes: Dish[] = [
  {
    n: "Ceviche Akaza",
    p: "S/ 38",
    d: "Pesca del día con leche de tigre al ají amarillo.",
    img: "/plato1.jpg",
  },
  {
    n: "Lomo del Huerto",
    p: "S/ 45",
    d: "Cortes finos al wok con reducción de la casa.",
    img: "/plato2.jpg",
  },
  {
    n: "Causa Girasol",
    p: "S/ 32",
    d: "Masa de papa amarilla rellena de pulpa de cangrejo.",
    img: "/plato3.jpg",
  },
];

export const initialProfileData: ProfileData = {
  name: "",
  email: "",
  allergies: "",
  preferences: "",
};

export const mockOrders: Order[] = [
  {
    id: "AK-2026-102",
    date: "22/04/2026",
    total: "S/ 84.00",
    status: "ESPERA",
    dishes: ["Ceviche Akaza", "Chicha Morada"],
  },
  {
    id: "AK-2026-098",
    date: "18/04/2026",
    total: "S/ 132.00",
    status: "COCINANDO",
    dishes: ["Lomo del Huerto", "Causa Girasol", "Mazamorra Morada"],
  },
  {
    id: "AK-2026-087",
    date: "11/04/2026",
    total: "S/ 54.00",
    status: "LISTO",
    dishes: ["Ají de Gallina", "Limonada Hierbabuena"],
  },
  {
    id: "AK-2026-075",
    date: "02/04/2026",
    total: "S/ 96.00",
    status: "PAGADO",
    dishes: ["Arroz con Mariscos", "Suspiro Limeño"],
  },
];
