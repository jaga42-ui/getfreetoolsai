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
import { ToolExtraContent } from "@/components/ToolExtraContent";

export const metadata = toolMeta({
  title: "Protect PDF with a Password Free Online",
  description:
    "Password-protect a PDF free online. Encrypt your document and restrict printing or copying — 100% private, runs entirely in your browser.",
  keywords:
    "protect pdf, password protect pdf free, encrypt pdf online, add password to pdf, lock pdf with password free",
  path: "/pdf/protect",
});

const jsonLd = softwareAppSchema({
  name: "Free Protect PDF",
  description:
    "Add a password and encryption to a PDF free online. 100% private — your file and password never leave your browser.",
  path: "/pdf/protect",
  ratingCount: 318,
});

const ProtectPDF = dynamic(() => import("@/components/tools/ProtectPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How does password-protecting a PDF work?",
    a: "Your PDF is encrypted in your browser using a password you choose. After that, anyone who wants to open the file must enter that password — the contents are unreadable without it.",
  },
  {
    q: "Is my password or file sent to a server?",
    a: "Never. Both the encryption and your password stay inside your browser. Your document is never uploaded, which makes this safe for contracts, statements and other sensitive files.",
  },
  {
    q: "What encryption is used?",
    a: "The PDF is encrypted with the standard AES encryption built into the PDF format, which is supported by Adobe Acrobat, Preview, Chrome, Edge and other common readers.",
  },
  {
    q: "Can I restrict printing or copying instead of blocking access?",
    a: "Yes. Open the Permissions section and uncheck printing, copying or editing. The file still opens with the password, but those actions are disabled for people who only have that password.",
  },
  {
    q: "What if I forget the password?",
    a: "There is no recovery. We can't reset or bypass it because nothing is stored on our side. Keep a copy of the original unprotected file and store the password somewhere safe.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="Protect PDF"
      />
      <ToolHeader
        title="Protect PDF — Add a Password"
        description="Encrypt a PDF with a password so it can't be opened without it — and optionally block printing or copying. Everything runs privately in your browser."
      />
      <div className="mt-8">
        <ProtectPDF />
      </div>
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Choose a password",
          "Download the protected PDF",
        ]}
      />
      <ToolDemo kind="protect" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free protect-PDF tool adds real password encryption to a document
          so it cannot be opened by anyone who doesn&apos;t know the password.
          It&apos;s what you need before emailing a contract, a salary slip, a
          bank statement or any file you wouldn&apos;t want a stranger to read if
          it landed in the wrong inbox. You can also open the Permissions section
          to keep the file readable but stop people from printing, copying text
          or editing it. The crucial difference from most &ldquo;free&rdquo;
          online encrypters is privacy: the encryption happens entirely inside
          your browser, so neither your document nor your password is ever
          uploaded to a server. It&apos;s completely free with no limits and no
          watermark, and it works in Chrome, Firefox, Safari and Edge with no
          installation and no signup. If you later need to remove the password,
          use our Unlock PDF tool with the same password.
        </p>
      </section>
      <ToolExtraContent href="/pdf/protect" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/protect" />
    </div>
  );
}
