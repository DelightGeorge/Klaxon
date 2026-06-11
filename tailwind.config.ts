import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        k: {
          50: "#f0fdf9", 100: "#ccfbef", 200: "#99f6df",
          300: "#5eeac8", 400: "#2dd4aa", 500: "#14b88e",
          600: "#0d9472", 700: "#0f755c", 800: "#115d4a",
          900: "#124d3e", 950: "#042b24",
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":  "fadeIn 0.25s ease forwards",
        shimmer:    "shimmer 1.8s linear infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
    },
  },
  plugins: [],
};
export default config;