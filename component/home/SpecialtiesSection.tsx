import Image from "next/image";
import { Dish } from "@/types";

type SpecialtiesSectionProps = {
  dishes: Dish[];
  onOrderViaChat: (dishName: string) => void;
};

export function SpecialtiesSection({
  dishes,
  onOrderViaChat,
}: SpecialtiesSectionProps) {
  return (
    <section id="joyas" className="max-w-7xl mx-auto px-6 py-24 w-full">
      <div className="text-center mb-16">
        <h2 className="text-akaza-marron text-5xl font-black tracking-tight mb-4 italic">
          Nuestras Joyas
        </h2>
        <div className="w-24 h-1 bg-akaza-amarillo mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {dishes.map((item) => (
          <div
            key={item.n}
            className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-akaza-marron/5"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <div className="absolute inset-0 bg-akaza-marron/10 group-hover:bg-transparent transition-colors z-10"></div>
              <Image
                src={item.img}
                alt={item.n}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-akaza-marron leading-none">
                  {item.n}
                </h3>
                <span className="text-akaza-marron font-black text-xl tracking-tighter">
                  {item.p}
                </span>
              </div>
              <p className="text-akaza-marron/50 font-medium text-sm leading-relaxed mb-6">
                {item.d}
              </p>
              <button
                onClick={() => onOrderViaChat(item.n)}
                className="w-full py-4 rounded-xl border-2 border-akaza-marron/5 text-akaza-marron font-black text-sm hover:bg-akaza-amarillo hover:border-akaza-amarillo transition-all uppercase tracking-widest shadow-sm active:scale-95"
              >
                Pedir por el Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
