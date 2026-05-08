import { Clock3, CheckCircle, Utensils } from "lucide-react";

interface Props {
  estado: string;
}

export default function EstadoBadge({ estado }: Props) {
  if (estado === "Pendiente") {
    return (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
        <Clock3 size={15} />
        Pendiente
      </span>
    );
  }

  if (estado === "Preparando") {
    return (
      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
        <Utensils size={15} />
        Preparando
      </span>
    );
  }

  return (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
      <CheckCircle size={15} />
      Listo
    </span>
  );
}