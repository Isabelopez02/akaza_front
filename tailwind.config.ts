import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        merriweather: ["var(--font-merriweather)", "serif"],
        serif: ["var(--font-merriweather)", "serif"],
      },
      colors: {
        akaza: {
          marron: "rgb(var(--akaza-marron) / <alpha-value>)",
          amarillo: "rgb(var(--akaza-amarillo) / <alpha-value>)",
          crema: "rgb(var(--akaza-crema) / <alpha-value>)",
          blanco: "rgb(var(--akaza-blanco) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
export default config;