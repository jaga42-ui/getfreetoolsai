import { renderBrandIcon } from "@/lib/brandIcon";

export const runtime = "edge";

// 512x512 maskable PNG icon (full-bleed, safe-zone mark). Referenced from
// app/manifest.ts so Android adaptive-icon masking renders cleanly.
export function GET() {
  return renderBrandIcon(512, true);
}
