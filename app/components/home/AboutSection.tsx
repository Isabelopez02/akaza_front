import { UtensilsCrossed } from "lucide-react";

export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="bg-akaza-marron py-24 px-6 text-white text-center"
    >
      <div className="max-w-3xl mx-auto">
        <UtensilsCrossed size={48} className="mx-auto mb-6 text-akaza-amarillo" />
        <h2 className="text-4xl font-black mb-6">Nuestra Historia</h2>
        <p className="text-white/70 text-lg leading-relaxed italic">
          "Akaza nació con la idea de llevar la calidez de un girasol a la mesa
          peruana. En el corazón de Santa Anita, buscamos que cada plato sea una
          conexión con nuestras raíces."
        </p>
      </div>
    </section>
  );
}
