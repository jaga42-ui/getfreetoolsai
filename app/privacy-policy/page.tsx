import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Privacy Policy",
  description:
    "GetFreeToolsAI privacy policy. Learn how we handle your data, cookies, and advertising. Your files never leave your browser.",
  keywords: "getfreetoolsai privacy policy, free tools privacy, data policy",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Last updated: June 2, 2026 ·{" "}
        <a
          href="https://www.getfreetoolsai.com"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          www.getfreetoolsai.com
        </a>
      </p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-text-muted">
        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            1. Introduction
          </h2>
          <p className="mt-2">
            GetFreeToolsAI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
            operates www.getfreetoolsai.com. This Privacy Policy explains how we
            collect, use, and protect information when you use our website and
            tools.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            2. Information we do NOT collect
          </h2>
          <p className="mt-2">
            We want to be upfront: GetFreeToolsAI does not collect, store, or
            process any files you upload or use in our tools. All file processing
            (PDF compression, image conversion, calculations, and so on) happens
            entirely in your web browser using WebAssembly and JavaScript. Your
            files are never transmitted to our servers. We do not collect:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Files you upload or process</li>
            <li>Documents, images, or PDFs you use</li>
            <li>Financial data you enter in calculators</li>
            <li>Personal data entered in any tool</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            3. Information we DO collect
          </h2>
          <p className="mt-2 font-medium text-text-primary">3.1 Google Analytics</p>
          <p className="mt-1">
            We use Google Analytics 4 to understand how visitors use our website.
            This collects pages visited and time spent, browser and device type,
            general geographic location (country/city), and the referring website.
            This data is anonymous and aggregated; no personally identifiable
            information is collected. You can opt out of Google Analytics at
            tools.google.com/dlpage/gaoptout.
          </p>
          <p className="mt-3 font-medium text-text-primary">3.2 Google AdSense</p>
          <p className="mt-1">
            We use Google AdSense to display advertisements. Google AdSense may
            use cookies to show relevant ads, collect browsing data for ad
            targeting, and use the DoubleClick cookie. You can opt out of
            personalized advertising at adssettings.google.com. For more on how
            Google uses data, see policies.google.com/technologies/ads.
          </p>
          <p className="mt-3 font-medium text-text-primary">3.3 Cookies</p>
          <p className="mt-1">
            We use Google Analytics cookies (_ga, _gid) and Google AdSense
            cookies. We do not set session cookies of our own. You can disable
            cookies in your browser settings at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            4. How we use information
          </h2>
          <p className="mt-2">
            Anonymous analytics data is used only to understand which tools are
            most useful, improve website performance, and fix bugs and technical
            issues. We do not sell, rent, or share any data with third parties
            except as described in this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            5. Third-party services
          </h2>
          <p className="mt-2">
            We use Google Analytics (analytics.google.com), Google AdSense
            (adsense.google.com), Vercel (vercel.com) for website hosting, and
            Formspree (formspree.io) for our contact form. Each has its own
            privacy policy governing data collected by their services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            6. Children&apos;s privacy
          </h2>
          <p className="mt-2">
            GetFreeToolsAI does not knowingly collect any information from
            children under 13. Our tools are general-purpose utilities suitable
            for all ages.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            7. Data security
          </h2>
          <p className="mt-2">
            Since we do not collect or store your files or personal data, there
            is minimal security risk. Our website uses HTTPS encryption for all
            connections.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            8. Your rights
          </h2>
          <p className="mt-2">
            You have the right to opt out of Google Analytics tracking, opt out of
            personalized ads, request information about data we hold, and contact
            us with privacy concerns.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            9. Changes to this policy
          </h2>
          <p className="mt-2">
            We may update this policy. Changes will be posted on this page with an
            updated date. Continued use of the site constitutes acceptance of the
            updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-text-primary">
            10. Contact
          </h2>
          <p className="mt-2">
            Privacy questions:{" "}
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
