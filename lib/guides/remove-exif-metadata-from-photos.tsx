import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "remove-exif-metadata-from-photos",
  category: "image",
  title: "How to Remove EXIF Metadata (and GPS Location) from Photos",
  description:
    "Photos carry hidden EXIF data including GPS location, device and timestamps. Strip EXIF metadata from images free, in your browser, before sharing.",
  keywords:
    "remove exif data, strip metadata from photo, remove gps from photo, delete exif, remove location from image, photo privacy metadata",
  excerpt:
    "Strip hidden GPS, device and timestamp data from photos before sharing — free and in-browser.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  authorId: "team",
  readingTime: 5,
  tags: ["privacy", "exif", "metadata"],
  relatedTools: ["/image/remove-exif", "/image/compress", "/image/convert"],
  relatedGuides: ["compress-images-without-losing-quality"],
  toc: [
    { id: "what", label: "What EXIF reveals" },
    { id: "why", label: "Why it matters" },
    { id: "steps", label: "Step-by-step" },
    { id: "notes", label: "Good to know" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Every photo your phone or camera takes carries hidden metadata called
        EXIF — and it can include the exact GPS coordinates where the picture was
        taken. Before you post or send a photo, it is worth stripping that data.
        Here is how to remove EXIF metadata for free in your browser.
      </p>

      <h2 id="what">What EXIF data reveals</h2>
      <ul>
        <li><strong>GPS location</strong> — the precise latitude and longitude of the shot.</li>
        <li><strong>Date and time</strong> — when the photo was captured.</li>
        <li><strong>Device</strong> — camera or phone make and model.</li>
        <li><strong>Settings</strong> — exposure, ISO, lens and software details.</li>
      </ul>

      <h2 id="why">Why it matters</h2>
      <p>
        Sharing a photo with GPS intact can reveal your home, workplace or a
        child&apos;s school. Many big platforms strip EXIF on upload, but plenty
        of sites, forums, marketplaces and direct file transfers do not — so the
        data travels with the file. Removing it first puts you in control.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/remove-exif">remove EXIF tool</Link>.</li>
        <li>Drop in your JPG or PNG (or paste it with Ctrl/Cmd+V).</li>
        <li>The tool re-saves the image without its metadata.</li>
        <li>Download the clean copy — the pixels are unchanged, the metadata is gone.</li>
      </ol>
      <p>
        This runs entirely in your browser, which is the whole point: a privacy
        tool that uploaded your photo to a server would defeat its own purpose.
      </p>

      <h2 id="notes">Good to know</h2>
      <ul>
        <li>The image itself looks identical — only the hidden data is removed.</li>
        <li>
          Re-saving through most editors (including{" "}
          <Link href="/image/compress">compression</Link> and{" "}
          <Link href="/image/convert">conversion</Link>) also drops most EXIF as
          a side effect.
        </li>
        <li>Keep an original copy if you rely on the metadata yourself (for example for cataloguing).</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Does removing EXIF change how the photo looks?</strong> No. The pixels are untouched; only metadata is stripped.</p>
      <p><strong>Does it remove GPS location?</strong> Yes — location is part of EXIF and is removed with the rest.</p>
      <p><strong>Can I do several photos?</strong> Process them one after another; each download is clean.</p>
      <p><strong>Is my photo uploaded?</strong> No. Metadata removal happens in your browser; your image never leaves your device.</p>
    </>
  ),
};

export default guide;
