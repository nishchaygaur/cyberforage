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
        background: "#040812",
        foreground: "#f8fafc",
        cyber: {
          dark: "#040812",
          surface: "#080F1D",
          card: "#0A1322",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(0, 240, 192, 0.35)",
          cyan: {
            DEFAULT: "#00F0C0",
            hover: "#00FFCC",
            glow: "rgba(0, 240, 192, 0.25)",
            muted: "rgba(0, 240, 192, 0.15)",
          },
          teal: "#00E5BE",
          purple: {
            DEFAULT: "#A855F7",
            glow: "rgba(168, 85, 247, 0.25)",
            muted: "rgba(168, 85, 247, 0.15)",
          },
          rose: {
            DEFAULT: "#F43F5E",
            glow: "rgba(244, 63, 94, 0.25)",
            muted: "rgba(244, 63, 94, 0.15)",
          },
          blue: {
            DEFAULT: "#38BDF8",
            glow: "rgba(56, 189, 248, 0.25)",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        "cyan-glow": "0 0 25px rgba(0, 240, 192, 0.25)",
        "cyan-glow-sm": "0 0 12px rgba(0, 240, 192, 0.2)",
        "cyan-glow-lg": "0 0 45px rgba(0, 240, 192, 0.35)",
        "purple-glow": "0 0 25px rgba(168, 85, 247, 0.25)",
        "rose-glow": "0 0 25px rgba(244, 63, 94, 0.25)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        "hero-gradient": "radial-gradient(circle at 75% 30%, rgba(0, 240, 192, 0.12) 0%, rgba(4, 8, 18, 0) 65%)",
      },
    },
  },
  plugins: [],
};
export default config;
