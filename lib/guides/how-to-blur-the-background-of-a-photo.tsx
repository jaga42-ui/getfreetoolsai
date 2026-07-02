import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-blur-the-background-of-a-photo",
  category: "image",
  title: "How to Blur the Background of a Photo (Free, No Upload)",
  description:
    "Add a professional depth-of-field blur behind your subject with AI — no fancy camera needed. Runs in your browser, so your photo is never uploaded — free, with no watermark.",
  keywords:
    "how to blur the background of a photo, blur background, blur photo background online, portrait blur effect, bokeh effect, blur background free, blur background without upload",
  excerpt:
    "Get that DSLR-style background blur behind your subject with AI — free and private, entirely in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["blur background", "portrait", "image"],
  relatedTools: ["/image/blur-background", "/image/background-remover", "/image/filters"],
  relatedGuides: ["remove-background-from-images"],
  toc: [
    { id: "why", label: "Why blur the background" },
    { id: "how", label: "How the AI does it" },
    { id: "steps", label: "Step-by-step" },
    { id: "tips", label: "Tips for a natural look" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        That soft, creamy background behind a sharp subject — photographers call it
        bokeh — usually needs an expensive lens and a wide aperture. AI can now fake
        it convincingly from an ordinary phone photo by finding your subject and
        blurring everything else. You can{" "}
        <Link href="/image/blur-background">blur a photo&apos;s background for
        free</Link> in your browser, with no upload and no watermark.
      </p>

      <h2 id="why">Why blur the background</h2>
      <ul>
        <li><strong>Make the subject pop</strong> — a blurred background draws the eye straight to the person or product.</li>
        <li><strong>Hide a messy or distracting scene</strong> — clutter behind you melts away.</li>
        <li><strong>A more professional look</strong> — for profile pictures, portraits and product shots.</li>
        <li><strong>Privacy</strong> — soften identifiable details behind your subject, all on your device.</li>
      </ul>

      <h2 id="how">How the AI does it</h2>
      <p>
        The tool runs an AI segmentation model that separates the foreground
        subject from the background — the same core technology as removing a
        background, but instead of deleting the background it keeps it and applies a
        realistic blur. The model runs entirely in your browser, so your photo is
        never uploaded.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/blur-background">Blur Background tool</Link>.</li>
        <li>Drop in your photo.</li>
        <li>Let the AI detect the subject; the background blurs automatically.</li>
        <li>Adjust the blur strength to taste, then download.</li>
      </ol>

      <h2 id="tips">Tips for a natural look</h2>
      <ul>
        <li><strong>Don&apos;t overdo the blur</strong> — a moderate amount reads as real depth of field; extreme blur looks fake.</li>
        <li><strong>Clear subject separation helps</strong> — the AI works best when the subject stands out from the background.</li>
        <li>
          <strong>Want the background gone entirely?</strong> Use the{" "}
          <Link href="/image/background-remover">Background Remover</Link> instead
          to cut it out for a transparent PNG.
        </li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Do I need a special camera?</strong> No — the AI adds the blur to an ordinary photo after the fact.</p>
      <p><strong>Is my photo uploaded?</strong> No. The model runs in your browser; your image never leaves your device.</p>
      <p><strong>Why is the first run slower?</strong> The AI model downloads once on first use, then is cached for instant reuse.</p>
      <p><strong>Is it free?</strong> Yes — no signup and no watermark on the result.</p>
    </>
  ),
};

export default guide;
