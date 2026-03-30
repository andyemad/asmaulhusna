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
        surface: "rgba(18,24,41,0.78)",
        "surface-strong": "rgba(9,13,24,0.94)",
        accent: "#d7b067",
        "accent-start": "#f4dd9a",
        "accent-mid": "#c89442",
        success: "#79c69a",
        warning: "#e8b452",
        error: "#ff7d7d",
        "text-primary": "#fff8eb",
        "text-secondary": "rgba(241,234,220,0.72)",
        "text-muted": "rgba(233,223,198,0.58)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "serif"],
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
