import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Remove EXIF Data & GPS from Photos Free Online",
  description:
    "Strip EXIF metadata and GPS location from JPG, PNG, WebP photos. Free, no signup, 100% private — protect your privacy before sharing images.",
  keywords:
    "remove exif data, strip gps from photo, remove metadata from image, exif remover free, photo privacy",
  openGraph: {
    title: "Remove EXIF Data & GPS from Photos Free Online | GetFreeToolsAI",
    description:
      "Strip EXIF metadata and GPS location from photos. Free, 100% private, browser-based.",
    url: "https://getfreetoolsai.com/image/remove-exif",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove EXIF Data & GPS from Photos Free Online",
    description: "Strip EXIF and GPS metadata from photos. Free, private.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/remove-exif" },
};

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
