import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "convert-heic-to-jpg",
  category: "image",
  title: "How to Convert HEIC to JPG (iPhone Photos) for Free",
  description:
    "iPhone photos save as HEIC, which many sites and apps will not accept. Learn how to convert HEIC to JPG for free in your browser — no app, no upload, no quality loss.",
  keywords:
    "heic to jpg, convert heic to jpg, iphone photo to jpg, heic to jpeg free, open heic on windows, heic converter no upload",
  excerpt:
    "Turn iPhone HEIC photos into universally accepted JPGs — free, private, no app to install.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  authorId: "team",
  readingTime: 5,
  tags: ["heic", "iphone photos", "image conversion"],
  relatedTools: ["/image/heic-to-jpg", "/image/convert", "/image/compress"],
  relatedGuides: [
    "compress-images-without-losing-quality",
    "resize-image-for-passport-photo",
  ],
  toc: [
    { id: "what", label: "What is HEIC?" },
    { id: "why", label: "Why convert to JPG" },
    { id: "steps", label: "Step-by-step" },
    { id: "tips", label: "Tips" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        If you have ever tried to upload an iPhone photo and been told the file
        type is not supported, you have met HEIC. Here is what it is and how to
        convert HEIC to JPG for free, right in your browser, without installing
        an app or uploading your photos.
      </p>

      <h2 id="what">What is HEIC?</h2>
      <p>
        HEIC (High Efficiency Image Container) is the format iPhones use by
        default. It stores photos at roughly half the size of JPG at similar
        quality, which is great for your phone storage — but many websites,
        Windows apps, and older software cannot open it.
      </p>

      <h2 id="why">Why convert to JPG</h2>
      <ul>
        <li><strong>Compatibility</strong> — JPG opens everywhere: every browser, app, portal and printer.</li>
        <li><strong>Uploads</strong> — forms that reject HEIC almost always accept JPG.</li>
        <li><strong>Sharing</strong> — sending JPG avoids the &quot;cannot open this file&quot; reply.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/heic-to-jpg">HEIC to JPG converter</Link>.</li>
        <li>Drop in one or more .heic files from your iPhone or computer.</li>
        <li>The tool converts them to JPG in your browser.</li>
        <li>Download a single JPG, or all of them at once as a ZIP.</li>
      </ol>
      <p>
        Nothing is uploaded — your photos are converted on your own device, which
        matters for personal pictures.
      </p>

      <h2 id="tips">Tips</h2>
      <ul>
        <li>
          Need a smaller file for a form? After converting, run it through the{" "}
          <Link href="/image/compress">image compressor</Link> (you can target an
          exact KB size).
        </li>
        <li>
          Want PNG or WebP instead of JPG? Use the{" "}
          <Link href="/image/convert">image converter</Link>.
        </li>
        <li>
          To stop new photos saving as HEIC, set your iPhone camera to
          &quot;Most Compatible&quot; in Settings → Camera → Formats.
        </li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Does converting HEIC to JPG lose quality?</strong> There is a tiny, usually invisible loss when re-encoding to JPG. For viewing, sharing and uploads it looks identical.</p>
      <p><strong>Can I convert many photos at once?</strong> Yes — drop in a batch and download them all as a ZIP.</p>
      <p><strong>Do I need an app?</strong> No. It runs in your browser on any device, including Windows.</p>
      <p><strong>Are my photos uploaded?</strong> No. Conversion is 100% local; your images never leave your device.</p>
    </>
  ),
};

export default guide;
