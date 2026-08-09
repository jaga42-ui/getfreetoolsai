import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  PrivacyNote,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Passport Photo Maker — Free Passport & Visa Photos",
  description:
    "Make a passport or visa photo free. Crop to India, US, UK, EU, Canada or China sizes at 300 DPI and print a full sheet — no upload, in-browser.",
  keywords:
    "passport photo maker, passport size photo online, visa photo maker, passport photo editor free, 35x45mm photo, 2x2 passport photo",
  path: "/image/passport-photo",
});

const jsonLd = softwareAppSchema({
  name: "Free Passport Photo Maker",
  description:
    "Crop a photo to official passport and visa sizes at 300 DPI and print a tiled sheet — entirely in your browser.",
  path: "/image/passport-photo",
});

const PassportPhoto = dynamic(() => import("@/components/tools/PassportPhoto"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "Which passport photo sizes are supported?", a: "You can crop to India and Schengen 35×45mm, US visa and passport 2×2 inch (51×51mm), UK/EU 35×45mm, Canada 50×70mm and China visa 33×48mm — all exported at print-ready 300 DPI." },
  { q: "How do I position my face correctly?", a: "Use the zoom slider and the horizontal and vertical sliders to centre your head within the frame. Most passports want the head roughly 70–80% of the photo height with a small margin above the hair." },
  { q: "Can I print several photos on one sheet?", a: "Yes. Choose a 4×6 inch or A4 sheet and the tool tiles as many copies as fit, with light cut lines, so you can print at home or at a photo shop and trim them out." },
  { q: "Can it change the background to white?", a: "It fills any area your photo doesn't cover with white, light blue or a custom colour. To replace a busy background behind you, run the photo through the Background Remover first, then bring it here." },
  { q: "Is my photo uploaded anywhere?", a: "No. Cropping, resizing and sheet layout all happen in your browser, so your photo never leaves your device — important for identity documents." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Image Tools" sectionHref="/image-tools" current="Passport Photo Maker" />
      <ToolHeader
        title="Passport Photo Maker"
        description="Crop any photo to official passport and visa sizes at 300 DPI and print a full sheet — all in your browser."
      />
      <div className="mt-8">
        <PassportPhoto />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your photo never leaves your browser.</span>{" "}
        Cropping and the print sheet are built on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to make a passport photo"
        steps={[
          "Upload a clear, front-facing photo",
          "Choose the size and position your face",
          "Download the photo or a print-ready sheet",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          This free passport photo maker turns an ordinary photo into a
          print-ready ID photo without a studio visit. Pick your country&apos;s
          specification — India and Schengen 35×45mm, US 2×2 inch, UK/EU, Canada
          or China — then zoom and nudge your face into the frame while the live
          preview shows exactly what you&apos;ll get. Every photo is exported at a
          crisp 300 DPI so it prints sharply, and the built-in sheet layout tiles
          multiple copies onto a 4×6 inch or A4 page with faint cut lines, ready
          for a home printer or the local photo shop. You can fill the background
          with white, light blue or a custom colour to meet document rules.
          Everything runs locally in your browser using the Canvas API, so your
          photo is never uploaded and there is no watermark — a genuinely private
          way to prepare passport and visa pictures.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Not sure of the exact dimensions your country needs? See the{" "}
          <Link
            href="/passport-photo-sizes"
            className="text-primary underline underline-offset-2"
          >
            passport &amp; visa photo size by country
          </Link>{" "}
          reference for the size in mm, inches and pixels, plus background and
          head-height rules.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/passport-photo" />
    </div>
  );
}
