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
        surface: "rgba(8,22,28,0.78)",
        "surface-strong": "rgba(4,13,18,0.94)",
        accent: "#d7b66f",
        "accent-start": "#f0d99c",
        "accent-mid": "#c59c50",
        lapis: "#7898b4",
        success: "#7ea38e",
        warning: "#e1b96b",
        error: "#ef8f82",
        "text-primary": "#f4eddc",
        "text-secondary": "#d8d0bd",
        "text-muted": "#9da7a2",
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
