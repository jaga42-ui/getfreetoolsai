import Link from "next/link";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "About GetFreeToolsAI — Private, Free Browser Tools",
  description:
    "GetFreeToolsAI provides free, private, browser-based tools — no signup, no uploads, no watermarks. Learn what we build, how the privacy works, and how you can verify it yourself.",
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
      <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
        GetFreeToolsAI is a growing collection of free online tools for PDF,
        image, calculator and developer tasks — built around one principle: your
        files should never leave your device. Everything runs locally in your
        browser. No signup, no watermark, no daily limits.
      </p>

      <div className="mt-10 space-y-10">
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
            So we built something different: a set of genuinely free tools that
            run entirely in your browser. No files are ever uploaded to our
            servers, no accounts are required, there are no daily limits, no
            watermarks, and no hidden premium tiers — just tools that work.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            What we offer
          </h2>
          <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-text-muted">
            <li>
              <span className="font-medium text-text-primary">PDF tools</span> —{" "}
              <Link href="/pdf/compress" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">compress</Link>,{" "}
              <Link href="/pdf/merge" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">merge</Link>,{" "}
              <Link href="/pdf/split" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">split</Link>, convert
              to and from images and Word, unlock, rotate, OCR, add page numbers
              and watermarks.
            </li>
            <li>
              <span className="font-medium text-text-primary">Image tools</span> —{" "}
              <Link href="/image/compress" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">compress to an exact size</Link>,
              convert formats,{" "}
              <Link href="/image/background-remover" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">remove backgrounds with AI</Link>,
              resize, crop, upscale, apply filters, round corners, pick colours
              and extract text.
            </li>
            <li>
              <span className="font-medium text-text-primary">Calculators</span> —
              EMI, loan, SIP, compound interest, GST, salary, BMI, calorie,
              percentage, age, tip, discount and more, all using verified formulas.
            </li>
            <li>
              <span className="font-medium text-text-primary">Developer tools</span>{" "}
              — JSON formatter, JWT decoder, hash generator, Base64, regex tester,
              minifiers and more — fast, private utilities for engineers.
            </li>
          </ul>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            New tools are added regularly based on what people actually search for
            and need. You can browse everything from the{" "}
            <Link href="/" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">home page</Link>{" "}
            or read our{" "}
            <Link href="/guides" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">how-to guides</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            How it works — and how you can verify it
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            Most online tools upload your file to a server, process it there, and
            send it back. Ours don&apos;t. Every tool runs inside your own browser
            using modern WebAssembly and JavaScript, so your file is read, edited
            and saved entirely on your device — it is never transmitted anywhere.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            You don&apos;t have to take our word for it. There are two simple ways
            to confirm it yourself:
          </p>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-text-muted">
            <li>
              <span className="font-medium text-text-primary">Watch the network.</span>{" "}
              Open your browser&apos;s developer tools (F12) → Network tab while you
              use a tool. You&apos;ll see your file is never sent in a request.
            </li>
            <li>
              <span className="font-medium text-text-primary">Go offline.</span>{" "}
              Load a tool page, then disconnect from the internet. Most tools keep
              working — because the processing was never happening on a server.
            </li>
          </ul>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            This local-first model is also why there are no file-size caps from us:
            there is no upload to limit. The only practical limit is your own
            device&apos;s memory.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            How we build and maintain the tools
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            GetFreeToolsAI is built and maintained by a small team of developers
            who use these tools themselves. Each tool is tested against real files
            before it ships, and our how-to guides are written by the same people
            who build the tools they describe. When something breaks or a result
            looks wrong, we fix it — feedback from users directly shapes what we
            improve and what we build next.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            Calculators use standard, published formulas (for example, the
            reducing-balance method for loan EMIs), and results are intended as
            accurate estimates for planning — we note where real-world fees or
            rounding may differ.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Who it&apos;s for
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            Students fitting an assignment under an upload limit, freelancers
            preparing client documents, small businesses standardising files, and
            anyone who would rather not hand a private PDF or photo to an unknown
            server. The tools are designed to be obvious — a clear drop zone, a big
            download button, sensible defaults — and they work the same on a phone,
            tablet or desktop browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            How we keep it free
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
            GetFreeToolsAI is, and will remain, free to use. The site is supported
            by advertising, which lets us cover costs without charging you or
            putting tools behind a paywall. Because files are processed on your
            device, we have no access to their contents — and we do not sell
            personal data. See our{" "}
            <Link href="/privacy-policy" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">privacy policy</Link>{" "}
            for the full detail. We will never add a forced signup, a daily limit,
            or a watermark on your output.
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
