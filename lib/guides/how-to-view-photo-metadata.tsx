import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-view-photo-metadata",
  category: "image",
  title: "How to View a Photo's Hidden Metadata (EXIF, GPS & More)",
  description:
    "See the hidden EXIF data inside a photo — camera model, date, settings and even GPS location. Runs in your browser, so your image is never uploaded. Free, no signup.",
  keywords:
    "how to view photo metadata, exif viewer, see photo gps location, check image metadata, view exif data, photo taken date, metadata viewer, does photo have location",
  excerpt:
    "Reveal the camera, date, settings and GPS location hidden inside a photo — and decide what to strip before sharing.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 4,
  tags: ["metadata", "exif", "privacy"],
  relatedTools: ["/image/metadata-viewer", "/image/remove-exif", "/image/compress"],
  relatedGuides: ["remove-exif-metadata-from-photos"],
  toc: [
    { id: "what", label: "What EXIF metadata is" },
    { id: "steps", label: "How to view it" },
    { id: "gps", label: "The GPS privacy risk" },
    { id: "strip", label: "Removing it before sharing" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Every photo your phone or camera takes carries a hidden layer of data called
        EXIF — the camera model, the exact date and time, the exposure settings, and
        often the <strong>GPS coordinates</strong> of where it was taken. You
        can&apos;t see it in the picture, but anyone with the file can. You can{" "}
        <Link href="/image/metadata-viewer">view a photo&apos;s metadata for
        free</Link> in your browser, with no upload — the image never leaves your
        device.
      </p>

      <h2 id="what">What EXIF metadata is</h2>
      <p>
        EXIF (Exchangeable Image File Format) is technical information the camera
        embeds in the file. Typical fields include: camera or phone make and model,
        date and time taken, shutter speed, aperture and ISO, lens, orientation, and
        — if location services were on — latitude and longitude.
      </p>

      <h2 id="steps">How to view it</h2>
      <ol>
        <li>Open the <Link href="/image/metadata-viewer">Metadata Viewer</Link>.</li>
        <li>Drop in the photo.</li>
        <li>Read the full list of embedded fields, including any GPS coordinates.</li>
      </ol>
      <p>It&apos;s all read locally, so even a private photo isn&apos;t sent anywhere to be inspected.</p>

      <h2 id="gps">The GPS privacy risk</h2>
      <p>
        This is the one that matters. A photo taken at home and posted online can
        carry the exact coordinates of your house. Many big social platforms strip
        location on upload — but plenty of contexts (files emailed directly, some
        forums, cloud shares, marketplace listings) keep it. If you sell something
        from home or share photos of children, checking for embedded GPS before you
        post is a genuine safety step.
      </p>

      <h2 id="strip">Removing metadata before sharing</h2>
      <p>
        Once you&apos;ve seen what&apos;s in there, you can wipe it. The{" "}
        <Link href="/image/remove-exif">Remove EXIF tool</Link> strips all metadata —
        including GPS — and gives you a clean copy to share, again without uploading
        anything. A good habit: view before posting anything sensitive, strip if it
        carries location. Note that re-compressing with the{" "}
        <Link href="/image/compress">Compress Image tool</Link> also drops most
        metadata as a side effect.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Does my photo have my location in it?</strong> It might — if location services were on when you took it. The viewer shows any GPS coordinates present.</p>
      <p><strong>Do social networks remove metadata?</strong> Many strip it on upload, but not all sharing methods do — don&apos;t rely on it.</p>
      <p><strong>Is my image uploaded?</strong> No. Metadata is read in your browser; your photo never leaves your device.</p>
      <p><strong>How do I remove it?</strong> Use the <Link href="/image/remove-exif">Remove EXIF tool</Link> for a clean copy.</p>
    </>
  ),
};

export default guide;
