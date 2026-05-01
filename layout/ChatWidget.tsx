import Link from "next/link";
import { Headphones } from "lucide-react";

export function ChatWidget() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link
        href="/chat"
        aria-label="Ir al chat de Akaza"
        className="bg-akaza-marron text-akaza-blanco w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-akaza-blanco active:scale-90"
      >
        <Headphones size={28} />
      </Link>
    </div>
  );
}
