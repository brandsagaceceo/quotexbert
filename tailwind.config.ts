import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#800020",
          dark: "#600018",
          light: "#a0002a",
        },
        ink: {
          100: "#f8fafc",
          200: "#f1f5f9",
          300: "#e2e8f0",
          500: "#64748b",
          700: "#334155",
          900: "#0f172a",
        },
      },
      borderRadius: {
        card: "1.25rem",
        button: "9999px",
      },
      fontFamily: {
        sans: ["system-ui", "Inter", "Manrope", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.75",
      },
    },
  },
  plugins: [],
};

export default config;
