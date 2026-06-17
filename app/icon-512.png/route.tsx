import { renderBrandIcon } from "@/lib/brandIcon";

export const runtime = "edge";

// 512x512 PNG app icon (purpose: any). Referenced from app/manifest.ts.
export function GET() {
  return renderBrandIcon(512);
}
