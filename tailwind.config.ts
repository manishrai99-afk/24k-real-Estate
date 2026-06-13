import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        brand: {
          50: "#fdf8ef",
          100: "#fbf0d6",
          200: "#f5e0aa",
          300: "#efcb74",
          400: "#e9b142",
          500: "#df9420",
          600: "#c47517",
          700: "#a25615",
          800: "#824316",
          900: "#6a3715",
          950: "#3d1c07", // Luxury Gold-Bronze Accents
        },
        sidebar: {
          bg: "#0a0b0d",
          hover: "#14161a",
          active: "#1c1f26",
          border: "#181a1f",
          text: "#9ca3af",
          textActive: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out-in",
        "slide-in": "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
