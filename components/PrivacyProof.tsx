import { ShieldCheck, Check, X, TerminalSquare } from "lucide-react";

/**
 * "Proof, not promises" — weaponizes the one thing every upload-based competitor
 * (Smallpdf, iLovePDF, TinyPNG, remove.bg) structurally cannot offer: files that
 * never leave the browser. Pairs a head-to-head comparison with a "verify it
 * yourself in DevTools" challenge — a trust signal a server-based tool can claim
 * but never actually deliver.
 */

const comparisonRows: { label: string }[] = [
  { label: "Your files never leave your browser" },
  { label: "No daily task limits" },
  { label: "No watermark on your downloads" },
  { label: "No signup or account required" },
  { label: "No file-size cap" },
];

const verifySteps = [
  "Open any tool and add your file.",
  "Press F12 and open the Network tab.",
  "Run the tool and download your result.",
  "Watch: your file is never sent — zero upload requests.",
];

export function PrivacyProof() {
  return (
    <section className="border-t border-border py-16">
      <div className="max-w-2xl">
        <p className="label">Proof, not promises</p>
        <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-text-primary sm:text-[2.5rem]">
          Most “free” tools upload your files. We can’t — there’s no server in
          the loop.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-text-muted sm:text-lg">
          Smallpdf, iLovePDF and TinyPNG send your documents and photos to their
          servers to process them. Every tool here runs entirely inside this
          browser tab, so your files are never uploaded — not to us, not to
          anyone. Don’t take our word for it; check it yourself.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Head-to-head comparison */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/60">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-border bg-surface px-5 py-3.5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              The difference
            </span>
            <span className="px-2 text-center text-[12px] font-semibold leading-tight text-primary">
              Get
              <br />
              FreeToolsAI
            </span>
            <span className="px-2 text-center text-[12px] font-medium leading-tight text-text-muted">
              Typical
              <br />
              free tools
            </span>
          </div>
          <ul>
            {comparisonRows.map((row, i) => (
              <li
                key={row.label}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 px-5 py-3.5 ${
                  i % 2 ? "bg-background/40" : ""
                }`}
              >
                <span className="text-[14.5px] font-medium text-text-primary">
                  {row.label}
                </span>
                <span className="flex w-[72px] justify-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15">
                    <Check
                      className="h-3.5 w-3.5 text-secondary"
                      strokeWidth={3}
                    />
                  </span>
                </span>
                <span className="flex w-[72px] justify-center">
                  <X className="h-4 w-4 text-text-muted/40" strokeWidth={2.5} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Verify-it-yourself challenge */}
        <div className="rounded-2xl border border-secondary/25 bg-secondary/[0.06] p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
              <TerminalSquare className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display text-lg font-medium text-text-primary">
              Verify it yourself
            </h3>
          </div>
          <ol className="mt-5 space-y-3">
            {verifySteps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-[11px] font-semibold text-secondary">
                  {i + 1}
                </span>
                <span className="text-[14px] leading-relaxed text-text-muted">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-start gap-2 border-t border-secondary/20 pt-4 text-[13px] leading-relaxed text-text-muted">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
              strokeWidth={2}
            />
            Close the tab and everything is gone from memory. There is no upload
            to intercept and no copy left behind on a server.
          </p>
        </div>
      </div>
    </section>
  );
}
