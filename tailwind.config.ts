import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5f0e8",
        "paper-dark": "#ede7db",
        ink: "#1a1410",
        "ink-light": "#4a4035",
        "ink-muted": "#635a4a",
        red: { DEFAULT: "#c0392b", dark: "#962d22" },
        rule: "#c8bfb0",
        "rule-dark": "#9a9080",
        success: "#4a7c59",
        warning: "#b8860b",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
        body: ["var(--font-source-serif)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "Courier New", "monospace"],
      },
      fontSize: {
        tiny: "0.55rem",
        tag: "0.60rem",
        btn: "0.65rem",
        sub: "0.82rem",
        meta: "0.88rem",
        body: "0.88rem",
        result: "0.95rem",
        card: "1.05rem",
        section: "1.2rem",
        hero: "1.5rem",
        brand: "2.8rem",
        name: "2.6rem",
        masthead: "4.2rem",
      },
      maxWidth: {
        page: "1280px",
        detail: "760px",
        modal: "620px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(26,20,16,0.12)",
        pop: "0 8px 32px rgba(26,20,16,0.18)",
      },
      transitionTimingFunction: {
        "ease-out-quint": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      letterSpacing: {
        mast: "0.06em",
        meta: "0.12em",
        label: "0.15em",
        wide2: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
