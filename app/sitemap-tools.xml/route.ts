import { toolEntries, urlsetXml } from "@/lib/sitemapUrls";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(toolEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
