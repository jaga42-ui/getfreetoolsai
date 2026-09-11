import { ImageResponse } from "next/og";
import { errorStyles, getErrorStyle } from "@/lib/errorStyles";
import { errorDialogOg, OG_SIZE } from "@/lib/ogErrorDialog";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Prerender one preview per era, so no share waits on a cold render. */
export function generateStaticParams() {
  return errorStyles.map((s) => ({ style: s.slug }));
}

export const alt = "Error message generator preview";

export default function Image({ params }: { params: { style: string } }) {
  const style = getErrorStyle(params.style);
  // The page itself 404s for an unknown slug; fall back rather than throw so a
  // stale share link still resolves to a valid image.
  const s = style ?? errorStyles[0];
  return new ImageResponse(errorDialogOg(s), { ...OG_SIZE });
}
