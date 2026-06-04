import { guideEntries, urlsetXml } from "@/lib/sitemapUrls";

export const dynamic = "force-static";

export function GET() {
  return new Response(urlsetXml(guideEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
