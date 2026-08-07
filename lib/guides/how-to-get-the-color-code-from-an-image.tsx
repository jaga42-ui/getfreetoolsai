import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-get-the-color-code-from-an-image",
  category: "image",
  title: "How to Get the Color Code (HEX) from an Image",
  description:
    "Pick any pixel from an image and get its HEX and RGB color code for designs, CSS and brand matching.",
  keywords:
    "how to get color code from image, color picker from image, hex code from image, eyedropper tool, rgb from image, pick color from photo, get hex color online",
  excerpt:
    "Pick any pixel and get its HEX and RGB code for CSS, design and brand matching — free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["color picker", "hex", "design"],
  relatedTools: ["/image/color-picker", "/image/filters", "/image/convert"],
  relatedGuides: [],
  toc: [
    { id: "why", label: "Why grab a color code" },
    { id: "formats", label: "HEX vs RGB" },
    { id: "steps", label: "Step-by-step" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        You spot the perfect shade in a photo, a logo or a screenshot and need its
        exact code to reuse it. An eyedropper (color picker) reads the precise
        color of any pixel and gives you its HEX and RGB values. You can{" "}
        <Link href="/image/color-picker">get the color code from an image for
        free</Link> in your browser, with no upload — the image never leaves your
        device.
      </p>

      <h2 id="why">Why grab a color code</h2>
      <ul>
        <li><strong>Match a brand color</strong> — pull the exact shade from a logo for a consistent design.</li>
        <li><strong>Build a palette</strong> — sample colors from a photo you love for a scheme.</li>
        <li><strong>CSS and design work</strong> — get the HEX to drop straight into code or a design tool.</li>
        <li><strong>Recreate a color</strong> you can see but don&apos;t have the value for.</li>
      </ul>

      <h2 id="formats">HEX vs RGB — which do you need?</h2>
      <p>
        They&apos;re the same color written two ways. <strong>HEX</strong> (like{" "}
        <code>#4b6b4e</code>) is compact and standard in web/CSS and most design
        tools. <strong>RGB</strong> (like <code>rgb(75, 107, 78)</code>) lists the
        red, green and blue amounts separately, which is handy when you need to tweak
        one channel or work with opacity (RGBA). Most tools show both, so copy
        whichever your workflow wants.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/color-picker">Color Picker tool</Link>.</li>
        <li>Drop in the image.</li>
        <li>Click or hover any pixel to read its color.</li>
        <li>Copy the HEX or RGB value.</li>
      </ol>
      <p>
        Editing the colors of the image rather than sampling them? The{" "}
        <Link href="/image/filters">Image Filters tool</Link> adjusts brightness,
        contrast and saturation.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What&apos;s a HEX code?</strong> A six-character code like <code>#4b6b4e</code> representing a color&apos;s red, green and blue values in hexadecimal.</p>
      <p><strong>Can I get RGB too?</strong> Yes — the picker shows both HEX and RGB for the pixel you select.</p>
      <p><strong>Is my image uploaded?</strong> No. The picker reads pixels in your browser; your image never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — unlimited use, no signup.</p>
    </>
  ),
};

export default guide;
