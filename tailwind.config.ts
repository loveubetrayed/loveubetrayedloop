import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F6",
        panel: "#FFFFFF",
        line: "#ECE7E1",
        ink: "#1A1A1A",
        mute: "#8B8880",
        pink: "#FF5B9E",
        pink2: "#C88FFF"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        veil: "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(255,91,158,0.14), transparent 60%)",
        "gradient-title": "linear-gradient(100deg, #FF5B9E 10%, #C88FFF 60%, #FFB8D9 100%)"
      }
    }
  },
  plugins: []
};

export default config;
