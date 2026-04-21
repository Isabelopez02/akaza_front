import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akaza - Experiencia Gastronómica",
  description: "Asistente inteligente y carta digital de Restaurante Akaza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-akaza-crema text-akaza-marron`}>
        {children}
      </body>
    </html>
  );
}