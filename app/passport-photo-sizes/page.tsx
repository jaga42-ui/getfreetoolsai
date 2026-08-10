import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { Breadcrumb, FaqSection } from "@/components/ToolScaffold";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { allTools } from "@/lib/tools";
import { SITE_URL, toolMeta, breadcrumbSchema } from "@/lib/seo";
import {
  photoSpecs,
  pxAt300,
  toInches,
  mmLabel,
  PHOTO_LAST_REVIEWED,
} from "@/lib/passportPhotoSizes";

export const metadata = toolMeta({
  title: "Passport & Visa Photo Size by Country (mm, inches & pixels)",
  description:
    "Passport and visa photo sizes for 35+ countries — mm, inches, exact pixels at 300 DPI, background colour and head-height rules. Free reference.",
  keywords:
    "passport photo size, visa photo size, passport photo dimensions, passport photo size by country, 35x45mm, 2x2 passport photo, schengen visa photo size, passport photo size in pixels",
  path: "/passport-photo-sizes",
});

const faqs = [
  { q: "What is the standard passport photo size?", a: "The most common international passport photo size is 35 × 45 mm (3.5 × 4.5 cm), used across the UK, the EU/Schengen area, India, Australia and much of the world. The main exception is the United States, which uses 2 × 2 inches (51 × 51 mm)." },
  { q: "What size is a US passport photo?", a: "A US passport photo is 2 × 2 inches (51 × 51 mm), which is 600 × 600 pixels at 300 DPI. The head must be 1 to 1⅜ inches (25–35 mm) from the bottom of the chin to the top of the head, on a plain white or off-white background. US visa photos use the same size." },
  { q: "What is the Schengen visa photo size?", a: "The Schengen visa photo is 35 × 45 mm with the head taking up 32–36 mm of the height, on a light grey or plain background. The same specification is used for passports across the 26 Schengen countries." },
  { q: "How many pixels is a 35 × 45 mm photo at 300 DPI?", a: "A 35 × 45 mm photo at 300 DPI is 413 × 531 pixels. To convert any size, multiply the dimension in millimetres by 300 and divide by 25.4 (the number of millimetres in an inch)." },
  { q: "What background colour should a passport photo have?", a: "Most countries require a plain white or light grey background with even lighting and no shadows. A few accept off-white or light blue. Always check your country's rule in the table above and confirm with the issuing authority." },
  { q: "Can I make a compliant passport photo myself?", a: "Yes. Take a clear, front-facing photo in even light against a plain wall, then crop it to your country's size and print it at 300 DPI. The free Passport Photo Maker does the cropping, sizing and print-sheet layout in your browser." },
];

const related = ["/image/passport-photo", "/image/crop", "/image/resize", "/image/compress"]
  .map((href) => allTools.find((t) => t.href === href))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));

export default function PassportPhotoSizesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Image Tools", url: `${SITE_URL}/image-tools` },
          { name: "Passport Photo Sizes" },
        ])}
      />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Passport Photo Sizes"
      />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.15] text-text-primary sm:text-[2.5rem]">
          Passport &amp; Visa Photo Size by Country
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-text-muted">
          The official passport and visa photo dimensions for 35+ countries — in
          millimetres and inches, the exact pixel size at print-ready 300 DPI, the
          required background colour, and head-height rules where they&apos;re
          specified. Bookmark it, or use it to crop a compliant photo in seconds
          with the free{" "}
          <Link href="/image/passport-photo" className="text-primary underline underline-offset-2">
            Passport Photo Maker
          </Link>
          .
        </p>
      </header>

      <TrustBadges className="mt-6" badges={["Free", "No Signup"]} />

      <div className="mt-8 rounded-xl border border-primary/25 bg-primary/5 p-5">
        <p className="font-display text-[17px] font-medium text-text-primary">
          Quick answer
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
          Two formats cover most of the world:{" "}
          <strong className="text-text-primary">35 × 45 mm</strong> (UK, EU /
          Schengen, India, Australia and most countries) and{" "}
          <strong className="text-text-primary">2 × 2 in (51 × 51 mm)</strong>{" "}
          (United States). <strong className="text-text-primary">Canada</strong>{" "}
          and <strong className="text-text-primary">Brazil</strong> use 50 × 70 mm,
          and <strong className="text-text-primary">China</strong> uses 33 × 48 mm.
          At 300 DPI, a 35 × 45 mm photo is 413 × 531 pixels.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium text-text-primary">Country</th>
              <th className="px-4 py-3 font-medium text-text-primary">Size (mm)</th>
              <th className="px-4 py-3 font-medium text-text-primary">Size (in)</th>
              <th className="px-4 py-3 font-medium text-text-primary">Pixels @ 300 DPI</th>
              <th className="px-4 py-3 font-medium text-text-primary">Head height</th>
              <th className="px-4 py-3 font-medium text-text-primary">Background</th>
            </tr>
          </thead>
          <tbody>
            {photoSpecs.map((s) => (
              <tr key={s.country} className="border-b border-border/60 align-top last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium text-text-primary">
                    <span aria-hidden className="mr-1.5">{s.flag}</span>
                    {s.country}
                  </span>
                  {s.note && (
                    <span className="mt-0.5 block text-xs leading-snug text-text-muted">
                      {s.note}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                  {mmLabel(s.wMm)} × {mmLabel(s.hMm)} mm
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                  {s.sizeLabel ?? `${toInches(s.wMm)} × ${toInches(s.hMm)} in`}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                  {pxAt300(s.wMm)} × {pxAt300(s.hMm)} px
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                  {s.headMm ?? "—"}
                </td>
                <td className="px-4 py-3 text-text-muted">{s.background}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Last reviewed {PHOTO_LAST_REVIEWED}. Photo rules change and some countries
        publish different sizes for different documents — always confirm against
        your issuing authority (passport office, embassy or visa portal) before
        printing.
      </p>

      {/* CTA into the tool */}
      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Camera className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="font-display text-lg font-medium text-text-primary">
              Make a compliant photo in your browser
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              Crop to any size above at 300 DPI, set the background, and print a
              full sheet — nothing is uploaded.
            </p>
          </div>
        </div>
        <Link
          href="/image/passport-photo"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Open Passport Photo Maker
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          How to read this table
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            <strong className="text-text-primary">Millimetres vs inches.</strong>{" "}
            Most countries specify photos in millimetres (or centimetres); the
            United States and a few others use inches. Both columns describe the
            same physical photo, so use whichever your form asks for.
          </p>
          <p>
            <strong className="text-text-primary">Pixels at 300 DPI.</strong> For a
            digital upload or home print, 300 DPI (dots per inch) is the standard
            for crisp photo quality. The pixel size is{" "}
            <code>mm × 300 ÷ 25.4</code> — so a 35 × 45 mm photo becomes 413 × 531
            pixels. If a portal asks for a specific pixel size, match that instead.
          </p>
          <p>
            <strong className="text-text-primary">Head height.</strong> Where a
            country publishes it, this is the distance from the bottom of the chin
            to the top of the head. As a rule of thumb the head fills roughly
            70–80% of the photo, centred, with a little space above the hair.
          </p>
          <p>
            <strong className="text-text-primary">Background.</strong> Plain,
            evenly lit, and shadow-free is the universal requirement. To swap a
            busy background for a plain one, run your photo through the{" "}
            <Link href="/image/background-remover" className="text-primary underline underline-offset-2">
              Background Remover
            </Link>{" "}
            first, then crop it to size.
          </p>
        </div>
      </section>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Tools to prepare your photo
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((t) => (
            <ToolCard key={t.href} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
