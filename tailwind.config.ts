import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep cosmos black-navy
        void: {
          950: "#07080f",
          900: "#0c0e1a",
          800: "#12141f",
          700: "#1b1e30",
          600: "#282c48",
          500: "#363a64",
        },
        // warm coral — the human view, meaning we make (primary)
        flux: {
          600: "#d94e3a",
          500: "#ff6b5c",
          400: "#ff9b8f",
        },
        // cosmic violet — quantum / the fundamental
        iris: {
          600: "#6d4ddb",
          500: "#8b7bff",
          400: "#b3a8ff",
        },
        // life teal — biology, emergence, nature
        leaf: {
          500: "#2dd4bf",
          400: "#6ee7d6",
        },
        // starlight gold — physics / light
        gold: {
          600: "#cf9b2e",
          500: "#f5b942",
          400: "#ffd27a",
          300: "#ffe3a8",
          200: "#fff1d4",
        },
        // nebula magenta
        plasm: {
          600: "#d6377a",
          500: "#ff4fa3",
          400: "#ff8cc4",
        },
        ink: {
          50: "#f4f4fb",
          100: "#e6e6f3",
          300: "#a8aac6",
          500: "#6c6e90",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Spectral"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
        zhsans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        panel: "inset 0 1px 0 rgba(255,107,92,0.07), 0 24px 64px -30px rgba(0,0,0,0.95)",
        glow: "0 0 48px -10px rgba(255,107,92,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
