import { MetadataRoute } from "next";
import { toolEntries, guideEntries } from "@/lib/sitemapUrls";

// Complete /sitemap.xml (kept for continuity). The scalable structure is the
// sitemap index at /sitemap-index.xml → /sitemap-tools.xml + /sitemap-guides.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  return [...toolEntries(), ...guideEntries()].map((e) => ({
    url: e.url,
    lastModified: new Date(e.lastModified),
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
