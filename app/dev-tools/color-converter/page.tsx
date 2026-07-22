import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Color Converter — HEX to RGB, HSL & HSV Online",
  description:
    "Free color converter. Convert between HEX, RGB, HSL and HSV with a live preview and color picker. Paste any format and get all the others. Runs in your browser.",
  keywords:
    "color converter, hex to rgb, rgb to hex, hex to hsl, rgb to hsl, hsl to rgb, color code converter, hex to hsv",
  path: "/dev-tools/color-converter",
});

const Tool = dynamic(() => import("@/components/dev/tools/ColorConverter"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      This color converter translates a color between the formats you use in CSS
      and design tools: <strong>HEX</strong>, <strong>RGB</strong>,{" "}
      <strong>HSL</strong> and <strong>HSV</strong>. Paste any one format — or use
      the color picker — and it shows all the others instantly, with a live swatch
      so you can see the result.
    </p>
    <h3>Which format when</h3>
    <ul>
      <li><strong>HEX</strong> — compact, the default in most CSS and design files.</li>
      <li><strong>RGB</strong> — direct red/green/blue channels, easy to tweak programmatically.</li>
      <li><strong>HSL / HSV</strong> — hue, saturation and lightness/value; intuitive for adjusting tone and creating palettes.</li>
    </ul>
    <p>Alpha (transparency) is preserved for 8-digit hex and rgba/hsla inputs. Everything runs in your browser.</p>
  </>
);

const faqs = [
  { q: "How do I convert HEX to RGB?", a: "Paste a hex value like #4b6b4e (or use the picker) and read the RGB row — here rgb(75, 107, 78). Three-digit shorthand like #abc is expanded automatically." },
  { q: "How do I convert RGB to HEX?", a: "Type rgb(75, 107, 78) into the color box and read the HEX row. The converter parses rgb(), rgba(), hsl() and hsla() as well as hex." },
  { q: "What's the difference between HSL and HSV?", a: "Both use hue and saturation, but HSL's third value is lightness (0% black, 100% white) while HSV's is value/brightness (0% black, 100% full color). HSL is common in CSS; HSV appears in many color pickers." },
  { q: "Does it support transparency?", a: "Yes. 8-digit hex (#rrggbbaa) and rgba()/hsla() inputs keep their alpha, which is reflected in the RGB and HSL output." },
  { q: "Is my data private?", a: "Yes. Color conversion runs entirely in your browser — nothing is uploaded." },
];

export default function Page() {
  return (
    <DevFrame slug="color-converter" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
