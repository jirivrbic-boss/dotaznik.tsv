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
        arena: {
          black: "#050505",
          neon: "#88FF00",
          "neon-alt": "#39FF14",
          orange: "#F5832B",
          "orange-hot": "#FF6600",
          muted: "#D1D1D1",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(136, 255, 0, 0.35), 0 0 40px rgba(136, 255, 0, 0.15)",
        orange: "0 0 16px rgba(245, 131, 43, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
