import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Akaza - Experiencia Gastronómica",
  description: "Asistente inteligente y carta digital de Restaurante Akaza",
  icons: {
    icon: "/logo-akaza.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${merriweather.variable}`}>
      <body className={`${inter.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}