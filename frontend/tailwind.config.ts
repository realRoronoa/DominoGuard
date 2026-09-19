import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 42px rgba(239,68,68,0.18)"
      }
    }
  },
  plugins: []
};
export default config;
