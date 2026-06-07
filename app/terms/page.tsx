import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Terms of Service",
  description:
    "Terms of service for GetFreeToolsAI. Rules for using our free online PDF, image, and calculator tools.",
  keywords: "getfreetoolsai terms of service, free tools terms",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-text-muted">Last updated: June 2, 2026</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-text-muted">
        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            1. Acceptance of terms
          </h2>
          <p className="mt-2">
            By using GetFreeToolsAI (www.getfreetoolsai.com), you agree to these
            Terms of Service. If you do not agree, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            2. Description of service
          </h2>
          <p className="mt-2">
            GetFreeToolsAI provides free online tools including PDF tools, image
            tools, and calculators. These tools run in your web browser and do not
            upload files to our servers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            3. Use of service
          </h2>
          <p className="mt-2">
            You may use GetFreeToolsAI for personal, educational, and commercial
            purposes, for processing your own files and documents, and for any
            lawful purpose. You may not use GetFreeToolsAI to process illegal
            content, attempt to hack or damage our systems, scrape or copy our
            code or content, use automated tools to overwhelm our servers, or
            violate any applicable laws.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            4. Disclaimer of warranties
          </h2>
          <p className="mt-2">
            Our tools are provided &quot;as is&quot; without warranty of any kind.
            We do not guarantee 100% accuracy of all calculations, that tools will
            work in all browsers, uninterrupted availability, or that results will
            meet specific requirements. Calculator results (EMI, BMI, taxes, and
            so on) are estimates for informational purposes only. Always verify
            important financial or medical decisions with a qualified professional.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            5. Limitation of liability
          </h2>
          <p className="mt-2">
            GetFreeToolsAI is not liable for any loss of data or files, financial
            decisions made based on calculator results, technical errors or
            inaccurate results, or any damages arising from use of our tools.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            6. Intellectual property
          </h2>
          <p className="mt-2">
            The GetFreeToolsAI website, its design, code, and content are owned by
            GetFreeToolsAI. You may not copy, reproduce, or distribute our content
            without permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            7. Privacy
          </h2>
          <p className="mt-2">
            Your use of our tools is governed by our Privacy Policy at
            www.getfreetoolsai.com/privacy-policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            8. Third-party advertising
          </h2>
          <p className="mt-2">
            We display Google AdSense advertisements. These ads are managed by
            Google and subject to Google&apos;s advertising policies. We are not
            responsible for the content of third-party advertisements.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            9. Changes to terms
          </h2>
          <p className="mt-2">
            We reserve the right to update these terms. Continued use of the site
            after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            10. Governing law
          </h2>
          <p className="mt-2">
            These terms are governed by applicable law. Any disputes shall be
            resolved in accordance with the applicable jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            11. Contact
          </h2>
          <p className="mt-2">
            Terms questions:{" "}
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
