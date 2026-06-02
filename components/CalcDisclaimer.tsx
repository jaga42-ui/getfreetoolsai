import { Info } from "lucide-react";

/** Liability/accuracy disclaimer shown on calculator pages. */
export function CalcDisclaimer({ kind }: { kind: "financial" | "health" }) {
  const text =
    kind === "financial"
      ? "Results are estimates based on standard formulas. For actual loan terms, tax liability, or investment returns, please consult your bank, CA, or financial advisor."
      : "Results are general estimates. BMI and calorie calculations vary by individual. Consult a healthcare professional for medical advice.";
  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg border border-sky-500/30 bg-sky-500/5 p-3 text-xs leading-relaxed text-text-muted">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
      <span>{text}</span>
    </div>
  );
}
