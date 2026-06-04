import { indexXml } from "@/lib/sitemapUrls";

export const dynamic = "force-static";

export function GET() {
  return new Response(indexXml(["/sitemap-tools.xml", "/sitemap-guides.xml"]), {
    headers: { "Content-Type": "application/xml" },
  });
}
