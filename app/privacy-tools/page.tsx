import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { allTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Photo Privacy Tools — Remove EXIF, GPS & Hidden Metadata Free",
  description:
    "See and strip the hidden data inside your photos — GPS coordinates, camera serial, timestamps. Runs entirely in your browser, so the file you are protecting is never uploaded.",
  keywords:
    "remove exif, remove gps from photo, strip metadata, photo metadata remover, exif viewer, check photo location, image privacy",
  path: "/privacy-tools",
});

/**
 * The privacy cluster head. Search Console shows Google already testing this
 * site for "remove exif", "remove gps metadata" and "strip metadata" — three
 * queries pointing at two tools that previously had no shared parent and no
 * educational page behind them.
 *
 * The claims below are deliberately conservative and match the implementations:
 * RemoveExif re-encodes through a canvas (which drops every metadata block),
 * and MetadataViewer parses EXIF/IFD0/GPS/IPTC via exifr plus PDF document
 * properties via pdf-lib.
 */
const PRIVACY_HREFS = [
  "/image/metadata-viewer",
  "/image/remove-exif",
  "/pdf/protect",
];

/**
 * What actually sits inside a typical phone photo. Kept to fields that exifr
 * genuinely surfaces and that a non-technical reader can act on.
 */
const METADATA_FIELDS: { field: string; what: string; risk: "High" | "Medium" | "Low" }[] = [
  {
    field: "GPS coordinates",
    what: "The exact latitude and longitude where the photo was taken, often accurate to a few metres.",
    risk: "High",
  },
  {
    field: "Date & time taken",
    what: "The precise moment of capture, including timezone on many devices.",
    risk: "Medium",
  },
  {
    field: "Camera make, model & serial",
    what: "Which device took it — the serial number can link separate photos to one physical camera.",
    risk: "Medium",
  },
  {
    field: "Owner & artist tags",
    what: "Some cameras embed a name or copyright string configured once and then forgotten.",
    risk: "Medium",
  },
  {
    field: "Software & edit history",
    what: "Which app processed the image, which can reveal workflow or that an image was edited.",
    risk: "Low",
  },
  {
    field: "Exposure settings",
    what: "Aperture, shutter speed, ISO, focal length. Harmless on its own.",
    risk: "Low",
  },
];

const faqs = [
  {
    q: "What is EXIF data?",
    a: "EXIF (Exchangeable Image File Format) is a block of information your camera or phone writes inside the image file itself. It travels with the photo when you send it. It commonly includes the GPS coordinates of where the shot was taken, the exact date and time, and the camera's make, model and serial number.",
  },
  {
    q: "Does my photo really contain my location?",
    a: "Very likely, if it came from a phone with location services enabled for the camera. The fastest way to know is to check: open the metadata viewer and drop the photo in. If GPS coordinates are present they are shown along with a map link, so you can see exactly what a recipient could see.",
  },
  {
    q: "Don't social networks strip EXIF automatically?",
    a: "Most large platforms do strip it from the version they publish, but that is not something you can verify, it varies by platform and upload path, and it happens only after you have already transmitted the original file — metadata included — to their servers. Stripping it yourself before uploading is the only version of this you control.",
  },
  {
    q: "Does removing EXIF reduce my image quality?",
    a: "The remover re-encodes the image, so a JPEG is recompressed once. At the quality setting used the visible difference is negligible for normal viewing and sharing, but it is not mathematically lossless. If you need the pristine original, keep a copy before stripping.",
  },
  {
    q: "Are my photos uploaded to check or strip metadata?",
    a: "No — and that matters more here than anywhere else on the site, because the whole point is that these files are sensitive. Both tools run entirely in your browser. You can open the Network tab in your browser's developer tools and watch: no request carries your image.",
  },
  {
    q: "Do PDFs have metadata too?",
    a: "Yes. PDFs carry document properties including title, author, subject, the creating application, and creation and modification timestamps. The author field routinely leaks a real name or an internal username. The metadata viewer reads these as well as image EXIF.",
  },
  {
    q: "What about screenshots?",
    a: "Screenshots generally contain no GPS data, since no camera was involved. They can still carry the device and software information, and of course whatever is visible in the image itself — which is frequently the bigger risk.",
  },
];

export default function PrivacyToolsHub() {
  const tools = PRIVACY_HREFS.map((href) =>
    allTools.find((t) => t.href === href)
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Privacy Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Photo & Document Privacy Tools",
          tools.map((t) => ({ name: t.name, href: t.href }))
        )}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Privacy Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Photo &amp; Document Privacy Tools
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Every photo your phone takes carries a hidden block of data inside the
        file — most importantly, the GPS coordinates of where you were standing.
        It travels with the image when you email it, message it or post it to a
        forum. These tools let you see exactly what is in there and strip it out,
        without the file ever leaving your device.
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      {/* ---------------- The workflow ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Check first, then strip
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          Stripping metadata blindly works, but you learn nothing about what your
          device has been recording. Doing it in two steps once is worth the extra
          minute.
        </p>
        <ol className="mt-6 space-y-4">
          {[
            {
              h: "See what is actually in the file",
              p: "Open the metadata viewer and drop in a recent photo from your phone. Sensitive fields are flagged, and if GPS coordinates are present you get a map link showing precisely the location a recipient could extract.",
              href: "/image/metadata-viewer",
              cta: "Open the metadata viewer",
            },
            {
              h: "Strip it",
              p: "The EXIF remover rebuilds the image without any metadata block — GPS, camera serial, timestamps and all — and hands back a clean file to download.",
              href: "/image/remove-exif",
              cta: "Remove EXIF data",
            },
            {
              h: "Verify it worked",
              p: "Run the cleaned file back through the viewer. It should come back empty. This is the step almost nobody does, and it is the only way to be sure rather than hopeful.",
              href: "/image/metadata-viewer",
              cta: "Re-check the cleaned file",
            },
          ].map((s, i) => (
            <li key={s.h} className="flex gap-4">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium text-text-primary">{s.h}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-text-muted">
                  {s.p}
                </p>
                <Link
                  href={s.href}
                  className="mt-1 inline-block text-[15px] text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                >
                  {s.cta}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- What's inside a photo ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          What is hidden inside a photo
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          Not every field matters equally. This is roughly how they rank for
          everyday risk:
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-medium text-text-primary">Field</th>
                <th className="py-3 pr-4 font-medium text-text-primary">
                  What it reveals
                </th>
                <th className="py-3 font-medium text-text-primary">Risk</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {METADATA_FIELDS.map((m) => (
                <tr key={m.field} className="border-b border-border/60">
                  <td className="py-3 pr-4 text-text-primary">{m.field}</td>
                  <td className="py-3 pr-4">{m.what}</td>
                  <td className="py-3">
                    <span
                      className={
                        m.risk === "High"
                          ? "rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600"
                          : m.risk === "Medium"
                            ? "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700"
                            : "rounded-full bg-border/60 px-2.5 py-1 text-xs font-medium text-text-muted"
                      }
                    >
                      {m.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- When it matters ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          When this genuinely matters
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              Selling something online
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              Marketplace listings are the classic case: photos taken at home,
              posted publicly, carrying the coordinates of your front door to
              anyone who downloads them.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              Posting under a pseudonym
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              A camera serial number is a persistent identifier. It can tie an
              anonymous account&apos;s images to photos you posted elsewhere under
              your real name.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              Sending documents to strangers
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              PDFs of a CV or an application often carry an author field with a
              real name or an employer&apos;s internal username, set years ago and
              never revisited.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              Photographing other people
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              Location data attached to a photo of someone else discloses their
              whereabouts, not just yours — worth stripping before you forward it
              on.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-10 text-[15px] leading-relaxed text-text-muted">
        Sharing a scanned document instead? Run it through{" "}
        <Link
          href="/ocr-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          OCR
        </Link>{" "}
        to pull out just the text you need, or{" "}
        <Link
          href="/pdf/protect"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          password-protect the PDF
        </Link>{" "}
        before sending it. Everything on this site runs in your browser — see{" "}
        <Link
          href="/privacy-policy"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          how we handle data
        </Link>
        .
      </p>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/privacy-tools" />
    </div>
  );
}
