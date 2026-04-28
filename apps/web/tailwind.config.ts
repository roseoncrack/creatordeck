import type { Config } from "tailwindcss";
import preset from "@creatordeck/config/tailwind.preset";
import animate from "tailwindcss-animate";

const config: Config = {
  presets: [preset as unknown as Config],
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "purple-glow": "hsl(var(--primary))",
        brand: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      boxShadow: {
        "purple-glow":
          "0 0 0 1px hsl(262 83% 58% / 0.3), 0 8px 30px -8px hsl(262 83% 58% / 0.5)",
        "purple-glow-sm":
          "0 0 0 1px hsl(262 83% 58% / 0.25), 0 4px 20px -6px hsl(262 83% 58% / 0.35)",
        "purple-glow-lg":
          "0 0 0 1px hsl(262 83% 58% / 0.4), 0 16px 50px -10px hsl(262 83% 58% / 0.6)",
      },
      backgroundImage: {
        "purple-radial":
          "radial-gradient(ellipse at center, hsl(262 83% 45% / 0.4) 0%, transparent 70%)",
        "purple-fade":
          "linear-gradient(180deg, hsl(262 83% 25% / 0.2) 0%, transparent 100%)",
      },
      keyframes: {
        "gradient-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
        "purple-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "gradient-pulse": "gradient-pulse 8s ease-in-out infinite",
        "purple-spin": "purple-spin 20s linear infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
