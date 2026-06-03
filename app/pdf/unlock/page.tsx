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
import { ToolDemo } from "@/components/ToolDemo";

export const metadata = toolMeta({
  title:
    "Unlock PDF Free Online — Remove PDF Password Protection | GetFreeToolsAI",
  description:
    "Remove password protection from PDF files free. Enter your password and download an unlocked PDF instantly. 100% private — password never sent to any server. Browser-based.",
  keywords:
    "unlock pdf, remove pdf password, pdf password remover free, decrypt pdf online, unlock password protected pdf free",
  path: "/pdf/unlock",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF Unlocker",
  description:
    "Remove password protection from PDF files free online. 100% private — password never sent to any server.",
  path: "/pdf/unlock",
  ratingCount: 642,
});

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
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
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
      <ToolDemo kind="unlock" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF unlocker removes the password and the printing or copying
          restrictions from a PDF you are authorised to access. It is the tool
          you need when your bank statement, salary slip, or policy document
          opens only after a password and you are tired of typing it every time,
          or when a file blocks you from printing or selecting text. Enter the
          open password once and download a clean, unrestricted copy. Crucially,
          your password and your document are used only inside your browser to
          decrypt the file locally — nothing is ever sent to a server, which is
          exactly why this is safe for sensitive financial and legal files.
          Unlike paid desktop apps, it is completely free with no limits and no
          watermark. It works in Chrome, Firefox, Safari, and Edge with no
          installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/unlock" />
    </div>
  );
}
