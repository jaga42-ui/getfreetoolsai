import dynamic from "next/dynamic";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Contact GetFreeToolsAI — Get in Touch | Free Online Tools",
  description:
    "Contact GetFreeToolsAI for tool suggestions, bug reports, or business enquiries. We respond within 24-48 hours.",
  keywords:
    "contact getfreetoolsai, tool suggestion, bug report, free tools support",
  path: "/contact",
});

const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Get in touch
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
        We read every message and usually respond within 24–48 hours.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-8 grid gap-4 text-sm text-text-muted sm:grid-cols-3">
        <div>
          <p className="label">Direct email</p>
          <a
            href="mailto:hello@getfreetoolsai.com"
            className="mt-1 block text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            hello@getfreetoolsai.com
          </a>
        </div>
        <div>
          <p className="label">Response time</p>
          <p className="mt-1">Within 24–48 hours</p>
        </div>
        <div>
          <p className="label">Tool suggestions</p>
          <p className="mt-1">We build the most requested tools first.</p>
        </div>
      </div>
    </div>
  );
}
