import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgba(255,255,255,0.04)",
        accent: "#a78bfa",
        "accent-start": "#6366f1",
        "accent-mid": "#8b5cf6",
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
        "text-primary": "#ffffff",
        "text-secondary": "rgba(255,255,255,0.5)",
        "text-muted": "rgba(255,255,255,0.3)",
      },
      fontFamily: {
        arabic: ["'Noto Naskh Arabic'", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
