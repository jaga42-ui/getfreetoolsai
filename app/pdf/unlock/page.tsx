import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";

export const metadata: Metadata = {
  title: "Unlock PDF — Remove PDF Password Free Online",
  description:
    "Remove password protection from PDF files free. Enter your password and download an unlocked PDF instantly. Browser-based, 100% private.",
  keywords:
    "unlock pdf, remove pdf password, pdf password remover free, decrypt pdf online, unlock password protected pdf",
  openGraph: {
    title: "Unlock PDF — Remove PDF Password Free Online | GetFreeToolsAI",
    description:
      "Remove password protection from PDF files free. Enter your password and download an unlocked PDF. 100% private.",
    url: "https://getfreetoolsai.com/pdf/unlock",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock PDF — Remove PDF Password Free Online",
    description: "Remove PDF password protection free. Browser-based, private.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/unlock" },
};

const UnlockPDF = dynamic(() => import("@/components/tools/UnlockPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can you unlock a PDF without the password?",
    a: "No. We remove the restriction using your correct password. We cannot crack or bypass encryption without it. This tool is for unlocking documents you are authorised to access.",
  },
  {
    q: "Is my password sent to your servers?",
    a: "Never. The password is used only inside your browser to decrypt the file locally. Neither your password nor your PDF is uploaded anywhere.",
  },
  {
    q: "What types of PDF encryption are supported?",
    a: "We support the common standard PDF encryptions, including owner/permission passwords (which restrict printing or copying) and user/open passwords used to open the file.",
  },
  {
    q: "Why is my PDF still locked after unlocking?",
    a: "Make sure you entered the exact open password. If the file uses an unusual or very strong encryption scheme we may not be able to process it. Permission-only restrictions are removed automatically without a password.",
  },
  {
    q: "Is this tool safe for sensitive documents?",
    a: "Yes. Because all processing happens in your browser and nothing is uploaded, it’s safe for bank statements, contracts and other private files. Closing the tab erases everything from memory.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="Unlock PDF"
      />
      <ToolHeader
        title="Unlock PDF — Remove Password Protection"
        description="Remove a password or printing/copying restrictions from a PDF you own. Everything runs privately in your browser."
      />
      <div className="mt-8">
        <UnlockPDF />
      </div>
      <HowItWorks
        steps={[
          "Upload your protected PDF",
          "Enter the password (if needed)",
          "Download the unlocked PDF",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/unlock" />
    </div>
  );
}
