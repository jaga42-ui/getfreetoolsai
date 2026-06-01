import dynamic from "next/dynamic";
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
  title:
    "Remove EXIF Data Free — Strip GPS & Metadata from Photos | GetFreeToolsAI",
  description:
    "Remove EXIF metadata and GPS location from photos free online. Protect your privacy before sharing images. 100% browser-based — your photos never leave your device.",
  keywords:
    "remove exif data, strip exif from photo, remove gps from photo, exif remover free, photo metadata remover, remove location from photo",
  path: "/image/remove-exif",
});

const jsonLd = softwareAppSchema({
  name: "Free EXIF Remover",
  description:
    "Remove EXIF metadata and GPS location from photos free online. 100% browser-based and private.",
  path: "/image/remove-exif",
  ratingCount: 498,
});

const RemoveExif = dynamic(() => import("@/components/tools/RemoveExif"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What is EXIF data and why remove it?",
    a: "EXIF is metadata cameras and phones embed in photos — including GPS coordinates, device model, and the exact date/time. Removing it protects your privacy before posting images online.",
  },
  {
    q: "Does this remove GPS location?",
    a: "Yes. Re-saving the image through the browser canvas discards every metadata block, including the GPS location tags, so the shared photo can’t reveal where it was taken.",
  },
  {
    q: "Will removing metadata change how the photo looks?",
    a: "No visible change. Only the hidden metadata is removed; the pixels are preserved (JPG is re-saved at high quality, PNG losslessly).",
  },
  {
    q: "Which formats are supported?",
    a: "JPG, PNG and WebP. JPGs are the most common carriers of EXIF/GPS data, which this tool detects and reports before stripping.",
  },
  {
    q: "Is my photo uploaded to a server?",
    a: "Never. The entire process runs in your browser, which is exactly why it’s safe for sensitive or personal photos.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Remove EXIF"
      />
      <ToolHeader
        title="Remove EXIF & GPS Metadata"
        description="Strip hidden metadata — including GPS location — from your photos before sharing them. Fully private, in your browser."
      />
      <div className="mt-8">
        <RemoveExif />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your photo",
          "We strip all metadata",
          "Download the clean image",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/remove-exif" />
    </div>
  );
}
