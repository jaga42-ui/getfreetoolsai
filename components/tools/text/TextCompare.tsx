"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowLeftRight, Trash2 } from "lucide-react";

import { SegmentedControl } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  diffLines,
  diffWords,
  pairRows,
  type DiffRow,
  type WordPart,
} from "@/lib/diff";

type View = "split" | "unified";

const areaClass =
  "w-full resize-y rounded-lg border border-border bg-surface p-3.5 font-mono text-sm leading-relaxed text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none";

export default function TextCompare() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [view, setView] = useState<View>("split");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  // Diffing a large paste is the one genuinely expensive thing this tool does.
  // Deferring it keeps typing responsive: React renders the new keystroke
  // immediately and recomputes the diff against the settled value.
  const deferredLeft = useDeferredValue(left);
  const deferredRight = useDeferredValue(right);

  const { rows, stats } = useMemo(
    () =>
      diffLines(deferredLeft, deferredRight, { ignoreCase, ignoreWhitespace }),
    [deferredLeft, deferredRight, ignoreCase, ignoreWhitespace]
  );

  const paired = useMemo(() => pairRows(rows), [rows]);
  const hasInput = left.trim() !== "" || right.trim() !== "";
  const identical = hasInput && stats.added === 0 && stats.removed === 0;

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  const clear = () => {
    setLeft("");
    setRight("");
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cmp-left"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Original text
          </label>
          <textarea
            id="cmp-left"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="Paste the first version here"
            className={areaClass}
          />
        </div>
        <div>
          <label
            htmlFor="cmp-right"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Changed text
          </label>
          <textarea
            id="cmp-right"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="Paste the second version here"
            className={areaClass}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: "split", label: "Side by side" },
            { value: "unified", label: "Unified" },
          ]}
        />
        <Toggle
          checked={ignoreCase}
          onChange={setIgnoreCase}
          label="Ignore case"
        />
        <Toggle
          checked={ignoreWhitespace}
          onChange={setIgnoreWhitespace}
          label="Ignore whitespace"
        />
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={swap}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" /> Swap
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </button>
        </div>
      </div>

      {hasInput && (
        <div
          role="status"
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm"
        >
          <span className="font-medium text-text-primary">
            {identical ? "The two texts are identical" : "Differences found"}
          </span>
          {!identical && (
            <>
              <span className="text-secondary">{stats.added} added</span>
              <span className="text-[#9c4828]">{stats.removed} removed</span>
            </>
          )}
          <span className="text-text-muted">{stats.unchanged} unchanged</span>
        </div>
      )}

      {stats.approximate && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-[#c0563a]/40 bg-[#c0563a]/[0.06] p-3 text-sm text-[#9c4828]"
        >
          These texts are too large to compare line by line, so the whole
          differing section is shown as replaced. Compare smaller sections for a
          precise result.
        </p>
      )}

      {hasInput && !identical && (
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            {view === "split" ? (
              <SplitView rows={paired} opts={{ ignoreCase, ignoreWhitespace }} />
            ) : (
              <UnifiedView rows={rows} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-primary"
      />
      {label}
    </label>
  );
}

/** Shared cell styling. `whitespace-pre-wrap` preserves indentation. */
const cellClass =
  "px-3 py-1 align-top font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words";
const numClass =
  "select-none px-2 py-1 text-right align-top font-mono text-[12px] leading-relaxed text-text-muted/60 w-12";

function SplitView({
  rows,
  opts,
}: {
  rows: DiffRow[];
  opts: { ignoreCase: boolean; ignoreWhitespace: boolean };
}) {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">
        Side-by-side comparison of the two texts
      </caption>
      <tbody>
        {rows.map((r, i) => {
          // A row with both sides present and op "delete" is a *changed* line
          // (pairRows matched them), so highlight the words that differ rather
          // than painting the whole line.
          const changed = r.op === "delete" && r.right !== null;
          const parts =
            changed && r.left !== null && r.right !== null
              ? diffWords(r.left, r.right, opts)
              : null;

          return (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className={numClass}>{r.leftNumber ?? ""}</td>
              <td
                className={cn(
                  cellClass,
                  "w-1/2",
                  r.left === null
                    ? "bg-background/50"
                    : r.op !== "equal" && "bg-[#c0563a]/[0.07]"
                )}
              >
                {parts ? <Marked parts={parts.left} tone="remove" /> : r.left}
              </td>
              <td className={numClass}>{r.rightNumber ?? ""}</td>
              <td
                className={cn(
                  cellClass,
                  "w-1/2",
                  r.right === null
                    ? "bg-background/50"
                    : r.op !== "equal" && "bg-secondary/[0.09]"
                )}
              >
                {parts ? <Marked parts={parts.right} tone="add" /> : r.right}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function UnifiedView({ rows }: { rows: DiffRow[] }) {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">Unified comparison of the two texts</caption>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-border/50 last:border-0">
            <td className={numClass}>{r.leftNumber ?? ""}</td>
            <td className={numClass}>{r.rightNumber ?? ""}</td>
            <td
              className={cn(
                "w-6 select-none px-2 py-1 text-center align-top font-mono text-[13px]",
                r.op === "insert" && "text-secondary",
                r.op === "delete" && "text-[#9c4828]"
              )}
            >
              {r.op === "insert" ? "+" : r.op === "delete" ? "-" : ""}
            </td>
            <td
              className={cn(
                cellClass,
                r.op === "insert" && "bg-secondary/[0.09]",
                r.op === "delete" && "bg-[#c0563a]/[0.07]"
              )}
            >
              {r.op === "insert" ? r.right : r.left}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Render word parts, highlighting the changed runs. */
function Marked({ parts, tone }: { parts: WordPart[]; tone: "add" | "remove" }) {
  return (
    <>
      {parts.map((p, i) =>
        p.changed ? (
          <mark
            key={i}
            className={cn(
              "rounded-sm px-0.5",
              tone === "add"
                ? "bg-secondary/25 text-text-primary"
                : "bg-[#c0563a]/25 text-text-primary"
            )}
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}
