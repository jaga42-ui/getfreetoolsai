import Link from "next/link";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "About GetFreeToolsAI — Free Online Tools | No Signup, No Limits",
  description:
    "Learn about GetFreeToolsAI — our mission to provide free, private, browser-based tools for everyone. No signup required, no file uploads, no watermarks, ever.",
  keywords:
    "about getfreetoolsai, free online tools, browser based tools, private tools no upload, no signup tools",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        About GetFreeToolsAI
      </h1>

      <div className="mt-8 space-y-10">
        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Our mission
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            GetFreeToolsAI was built out of personal frustration. Every time we
            needed to compress a PDF, convert an image, or calculate an EMI, we
            ended up on sites that were slow, cluttered with ads, demanded account
            signups, limited free users to two tasks per day, or uploaded our
            personal documents to unknown servers.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            So we decided to build something different. GetFreeToolsAI is a
            collection of free online tools that run entirely in your browser. No
            files are ever uploaded to our servers, no accounts are required,
            there are no daily limits, no watermarks, and no hidden premium tiers
            — just tools that work.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            What we offer
          </h2>
          <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-muted">
            <li>
              <span className="font-medium text-text-primary">PDF tools</span> —
              compress, merge, split, convert to and from images and Word, unlock,
              rotate, OCR, add page numbers and watermarks.
            </li>
            <li>
              <span className="font-medium text-text-primary">Image tools</span> —
              compress to an exact size, convert formats, remove backgrounds with
              AI, resize, crop, upscale, apply filters, round corners, pick colours
              and extract text.
            </li>
            <li>
              <span className="font-medium text-text-primary">Calculators</span> —
              EMI, loan, SIP, compound interest, GST, salary, BMI, calorie,
              percentage, age, tip, discount and more, all using verified formulas.
            </li>
            <li>
              <span className="font-medium text-text-primary">Coming soon</span> —
              AI writing tools, generators, video tools and developer utilities.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Our privacy commitment
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            Every tool on GetFreeToolsAI processes your files locally in your
            browser using modern WebAssembly and JavaScript technology. Your PDFs
            are never uploaded to our servers, your photos never leave your device,
            your financial data stays private, and your documents are never stored
            or logged.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            We believe privacy is a right, not a premium feature. That is why every
            tool — present and future — will always process data locally wherever
            it is technically possible.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Always free
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            GetFreeToolsAI is and always will be free. We are supported by
            non-intrusive advertising that lets us keep the lights on without
            charging you anything. We will never add a paywall, a daily limit, or a
            forced signup.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Contact
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            Have feedback, found a bug, or want to suggest a new tool? We&apos;d
            love to hear from you. Email{" "}
            <a
              href="mailto:hello@getfreetoolsai.com"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              hello@getfreetoolsai.com
            </a>{" "}
            or use our{" "}
            <Link
              href="/contact"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
