import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Color Palette Extractor — Get Colors from Image",
  description:
    "Extract the dominant colour palette from any image and copy HEX and RGB values. Upload a photo and get its key colours instantly, in your browser. Free.",
  keywords:
    "color palette extractor, extract colors from image, image color palette, get colors from image, dominant colors, hex from image, palette generator",
  path: "/dev-tools/color-palette",
});

const Tool = dynamic(() => import("@/components/dev/tools/ColorPalette"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Upload an image and this tool samples its pixels to surface the dominant colours as a palette,
      each with copy-ready HEX and RGB values. It is handy for building a theme from a photo,
      matching brand colours, or pulling accents from a reference image.
    </p>
    <p>
      Your image is decoded on a canvas entirely in your browser — nothing is uploaded to any
      server.
    </p>
  </>
);

const faqs = [
  { q: "How are the colours chosen?", a: "The image is sampled and similar colours are grouped into buckets; the most frequent buckets become your palette, averaged for a representative swatch." },
  { q: "What formats can I upload?", a: "Any image your browser can open — typically JPG, PNG and WebP." },
  { q: "Can I copy the values?", a: "Yes. Each swatch shows its HEX and RGB value with a one-click copy button." },
  { q: "Is my image uploaded?", a: "No. The image is read locally on a canvas in your browser and never sent anywhere." },
];

export default function Page() {
  return (
    <DevFrame slug="color-palette" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
