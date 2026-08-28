"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, QrCode } from "lucide-react";

type QrModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function QrModal({ isOpen, onClose }: QrModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 220,
        },
        (decodedText) => {
          console.log("QR detectado:", decodedText);
          let mesa = decodedText;

          if (decodedText.includes("mesa=")) {
            mesa = decodedText.split("mesa=")[1];
          }

          onClose();
          window.location.href = `/chat?mesa=${mesa}`;
        },
        () => {}
      )
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, [isOpen, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Tarjeta Modal del Escáner */}
      <div className="relative bg-akaza-crema w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-akaza-marron/20 animate-in zoom-in-95 duration-200 text-center">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-akaza-marron/50 hover:text-akaza-marron hover:bg-akaza-marron/10 p-1 rounded-lg transition-all"
          aria-label="Cerrar escáner"
        >
          <X size={18} />
        </button>

        {/* Encabezado en Merriweather */}
        <div className="mb-4 space-y-1">
          <div className="w-10 h-10 rounded-full bg-akaza-marron text-akaza-amarillo flex items-center justify-center mx-auto mb-2 shadow-sm">
            <QrCode size={20} />
          </div>
          <h3 className="font-serif text-lg font-bold text-akaza-marron">
            Escáner de Mesa
          </h3>
          <p className="text-xs text-akaza-marron/70 font-medium">
            Apunta tu cámara al código QR de la mesa para vincular tu pedido al instante.
          </p>
        </div>

        {/* Visor de Cámara del Escáner */}
        <div className="bg-white rounded-xl p-3 border border-akaza-marron/15 shadow-inner">
          <div className="relative w-full aspect-square rounded-lg border-2 border-dashed border-akaza-marron/40 overflow-hidden bg-black/5 flex items-center justify-center">
            <div id="reader" className="w-full h-full rounded-lg"></div>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-akaza-marron/70 mt-3 uppercase tracking-wider">
            <Camera size={13} className="text-akaza-marron" />
            <span>Escaneando código...</span>
          </div>
        </div>

      </div>
    </div>
  );
}
