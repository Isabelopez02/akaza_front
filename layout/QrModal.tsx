"use client";

// Hooks y librerías necesarias para el escaneo QR
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Librería externa para acceso a cámara y escaneo QR
import { Html5Qrcode } from "html5-qrcode";

import { Camera, X } from "lucide-react";

type QrModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function QrModal({ isOpen, onClose }: QrModalProps) {
  const router = useRouter();

  // Inicializa la cámara y el lector QR cuando el modal se abre
  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },

        // Captura el contenido del QR escaneado

        (decodedText) => {
          console.log("QR detectado:", decodedText);

          let mesa = decodedText;

          // Extrae el número de mesa desde el QR
          if (decodedText.includes("mesa=")) {
            mesa = decodedText.split("mesa=")[1];
          }

          onClose();

          // Redirección automática al chat con la mesa detectada
          window.location.href = `/chat?mesa=${mesa}`;
        },
        () => { }
      )
      .catch((err) => {
        console.log(err);
      });

    return () => { };
  }, [isOpen, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-akaza-marron/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(61,28,2,0.2)] border border-akaza-marron/10 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-akaza-marron/40 hover:text-akaza-marron transition-colors"
        >
          <X size={22} />
        </button>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-akaza-marron">Escáner QR</h3>
          <p className="text-sm text-akaza-marron/60 mt-1">
            Simulación visual para futuras órdenes en mesa.
          </p>
        </div>

        <div className="bg-akaza-crema rounded-3xl p-6 border border-akaza-marron/5">
          <div className="relative w-full aspect-square rounded-3xl border-2 border-dashed border-akaza-marron/30 bg-white overflow-hidden">
            <div id="reader" className="w-full h-full rounded-3xl"></div>
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-akaza-marron/50 mt-4">
            Apunta tu cámara al código de la mesa
          </p>
        </div>
      </div>
    </div>
  );
}
