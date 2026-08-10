import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";
import { ToolExtraContent } from "@/components/ToolExtraContent";

export const metadata = toolMeta({
  title: "Metadata Viewer — See Hidden EXIF & GPS Data Free",
  description:
    "View hidden photo and PDF metadata — EXIF, GPS location, camera serial, software and timestamps. Free, no upload, 100% private in your browser.",
  keywords:
    "metadata viewer, exif viewer, view photo metadata, check gps in photo, see exif data online, pdf metadata viewer, image metadata checker",
  path: "/image/metadata-viewer",
});

const jsonLd = softwareAppSchema({
  name: "Free Metadata Viewer",
  description:
    "Reveal the hidden EXIF, GPS and document metadata inside a photo or PDF. 100% private — your file never leaves your browser.",
  path: "/image/metadata-viewer",
  ratingCount: 207,
});

const MetadataViewer = dynamic(
  () => import("@/components/tools/MetadataViewer"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "What metadata can this reveal?",
    a: "For photos: EXIF data such as GPS location, camera make/model and serial number, lens, exposure settings, the software used, author/copyright, and the date and time the photo was taken. For PDFs: the title, author, subject, keywords, the creating application, and creation/modification dates.",
  },
  {
    q: "Why does my photo contain my location?",
    a: "Most phones embed GPS coordinates into photos by default. That means a photo you share publicly can reveal exactly where it was taken — including your home. This tool flags that so you can decide before posting.",
  },
  {
    q: "Is my file uploaded to check it?",
    a: "No. The file is read entirely inside your browser, so even sensitive photos and confidential PDFs never leave your device.",
  },
  {
    q: "It says no metadata was found — is that good?",
    a: "Yes. It means the file carries no embedded EXIF or document metadata to identify you, your device or your location. Files exported by some apps (or already stripped) come out clean.",
  },
  {
    q: "How do I remove the metadata it found?",
    a: "For photos, use our Remove EXIF tool to strip everything (including GPS) and download a clean copy. There's a one-click link to it whenever sensitive data is detected.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Metadata Viewer"
      />
      <ToolHeader
        title="Metadata Viewer — See What's Hidden in Your Files"
        description="Reveal the EXIF, GPS location and document metadata buried inside any photo or PDF — privately, in your browser. Know what you're sharing before you share it."
      />
      <div className="mt-8">
        <MetadataViewer />
      </div>
      <HowItWorks
        steps={[
          "Drop in a photo or PDF",
          "We read its hidden metadata locally",
          "Review what it reveals (and strip it if needed)",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Every photo your phone takes and every PDF an app produces can carry
          hidden metadata — and most people never see it. A single holiday photo
          can embed the exact GPS coordinates of where it was taken; a camera can
          stamp in its serial number; a PDF can quietly record the author&apos;s
          name and the software that made it. Our free metadata viewer reads all
          of this and lays it out plainly, highlighting anything that could
          identify you, your device or your location — with a map link if GPS
          coordinates are present. It&apos;s the tool to run before you post a
          photo publicly, send a document to a stranger, or upload a file to a
          forum or marketplace. Because everything is read locally in your
          browser, your file is never uploaded, so it&apos;s safe even for
          sensitive images and confidential PDFs. When it finds something you&apos;d
          rather not share, one click takes you to our Remove EXIF tool to strip
          it and download a clean copy.
        </p>
      </section>
      <ToolExtraContent href="/image/metadata-viewer" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/metadata-viewer" />
    </div>
  );
}
