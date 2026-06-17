import { renderBrandIcon } from "@/lib/brandIcon";

export const runtime = "edge";

// 192x192 PNG app icon (purpose: any). Referenced from app/manifest.ts.
export function GET() {
  return renderBrandIcon(192);
}
