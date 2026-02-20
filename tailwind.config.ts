import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1628",
          light: "#122240",
          dark: "#060e1a",
        },
        accent: {
          DEFAULT: "#d4a853",
          light: "#e0bf7a",
          dark: "#b8903f",
        },
        gray: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e2e6ea",
          300: "#cbd2d9",
          400: "#94a1b0",
          500: "#6b7a8d",
          600: "#4a5568",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
