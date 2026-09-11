import { ImageResponse } from "next/og";
import { errorStyles } from "@/lib/errorStyles";
import { errorDialogOg, OG_SIZE } from "@/lib/ogErrorDialog";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Windows error message generator preview";

/**
 * The hub previews as the current Windows era. It is the page that holds the
 * cluster's head terms, so its share card should read as a present-day dialog
 * rather than a retro one.
 */
export default function Image() {
  return new ImageResponse(errorDialogOg(errorStyles[0]), { ...OG_SIZE });
}
