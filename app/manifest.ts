import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GetFreeTools",
    short_name: "GetFreeTools",
    description: "50+ free online tools. No signup.",
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
