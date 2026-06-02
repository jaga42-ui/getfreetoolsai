import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Disclaimer | GetFreeToolsAI",
  description:
    "Disclaimer for GetFreeToolsAI. Our calculators and tools provide estimates for informational purposes only — consult a professional for financial or medical decisions.",
  keywords: "getfreetoolsai disclaimer, calculator accuracy disclaimer",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Disclaimer
      </h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: June 2, 2026</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-text-muted">
        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            General disclaimer
          </h2>
          <p className="mt-2">
            The information and tools provided on GetFreeToolsAI are for general
            informational and utility purposes only.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            Financial disclaimer
          </h2>
          <p className="mt-2">
            EMI, loan, SIP, salary, GST, and all other financial calculators on
            this site provide estimates based on standard formulas. Results are
            for planning purposes only and should not be considered financial
            advice. Interest rates, tax laws, and financial regulations change
            frequently. Always consult a qualified financial advisor, chartered
            accountant, or your bank before making financial decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            Health disclaimer
          </h2>
          <p className="mt-2">
            BMI and calorie calculators provide general estimates based on
            population averages. Results do not account for individual health
            conditions, body composition, or medical history. Do not use these
            tools as a substitute for professional medical advice. Always consult
            a qualified healthcare provider for health decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            Tool accuracy
          </h2>
          <p className="mt-2">
            While we strive for accuracy in all tools, GetFreeToolsAI does not
            guarantee 100% accuracy in all cases. PDF, image, and file processing
            results may vary based on file complexity, browser compatibility, and
            input quality.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            External links
          </h2>
          <p className="mt-2">
            Our site may contain links to third-party websites. We are not
            responsible for the content or privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            Contact
          </h2>
          <p className="mt-2">
            <a
              href="mailto:hello@getfreetoolsai.com"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              hello@getfreetoolsai.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
