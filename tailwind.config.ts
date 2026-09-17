import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        surface: "#1e293b",
        border: "#334155",
        accent: "#6366f1",
        accentHover: "#4f46e5",
        muted: "#94a3b8",
      },
    },
  },
  plugins: [],
};

export default config;
