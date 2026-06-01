import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper / editorial palette
        background: "#f4efe4", // cream paper
        surface: "#fbf8f1", // near-white card
        border: "#e4ddcd", // warm hairline
        primary: "#b25733", // terracotta / rust
        secondary: "#4b6b4e", // muted forest
        "text-primary": "#211f1a", // ink
        "text-muted": "#6c675c", // warm grey
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Fraunces",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
