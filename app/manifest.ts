import { MetadataRoute } from "next";
import { TOOL_COUNT_LABEL } from "@/lib/siteTools";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GetFreeToolsAI — Free Online Tools",
    short_name: "GetFreeToolsAI",
    description:
      `${TOOL_COUNT_LABEL} free online PDF, image, audio and developer tools. No signup, no watermark, 100% browser-based and private.`,
    categories: ["productivity", "utilities"],
    lang: "en-US",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe4",
    theme_color: "#211f1a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // Full-bleed safe-zone icon for Android adaptive-icon masking.
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
