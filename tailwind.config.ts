import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { snu: { DEFAULT: '#0f0f70', dark: '#090947', 50: '#f3f4fb', 100: '#e7e9f6', 300: '#b5bcdf' } } } },
  plugins: [],
} satisfies Config;
