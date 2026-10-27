import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pink-only identity: every neutral carries a faint pink undertone
        cream: "#FAF1F2",
        panel: "#FFFFFF",
        line: "#F0DCE2",
        ink: "#1B1418",
        mute: "#8F7E85",
        pink: "#FF5B9E",
        rose: "#E8317F",
        blush: "#FFD9E8",
        bubble: "#FFB3D1"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
