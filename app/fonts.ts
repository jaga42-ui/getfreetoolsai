import localFont from "next/font/local";

// Self-hosted variable fonts via next/font/local — keeps the project's
// no-build-time-fetch guarantee while adding automatic <link rel="preload">,
// font-display: swap, and a size-adjusted fallback face (near-zero CLS).
//
// We ship only the latin `wght` axis (the same axis the previous Fontsource
// default import used) to keep the payload small for an English-language site.

export const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
  style: "normal",
  preload: true,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});

export const fraunces = localFont({
  src: "./fonts/fraunces-latin-wght-normal.woff2",
  variable: "--font-serif",
  display: "swap",
  weight: "100 900",
  style: "normal",
  preload: true,
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});
