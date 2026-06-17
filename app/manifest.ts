import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GetFreeToolsAI — Free Online Tools",
    short_name: "GetFreeToolsAI",
    description:
      "50+ free online PDF, image, AI and developer tools. No signup, no watermark, 100% browser-based and private.",
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
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
