"use client";

import { useMemo, useState } from "react";
import { Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, Panel, StatusPill } from "@/components/dev/ui";

const FLAGS = ["g", "i", "m", "s", "u", "y"] as const;

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [text, setText] = useState("");

  const { error, matches } = useMemo(() => {
    if (!pattern) return { error: "", matches: [] as RegExpExecArray[] };
    try {
      const flagStr = flags.join("");
      const re = new RegExp(pattern, flagStr);
      if (!text) return { error: "", matches: [] as RegExpExecArray[] };
      const out: RegExpExecArray[] = [];
      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          out.push(m);
          if (m.index === re.lastIndex) re.lastIndex++;
          if (out.length > 1000) break;
        }
      } else {
        const m = re.exec(text);
        if (m) out.push(m);
      }
      return { error: "", matches: out };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid regex", matches: [] as RegExpExecArray[] };
    }
  }, [pattern, flags, text]);

  const toggle = (f: string) => setFlags((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-zinc-500">/</span>
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} placeholder="pattern" className={`${fieldClass} w-48 flex-1 sm:max-w-xs`} />
        <span className="font-mono text-zinc-500">/</span>
        <div className="flex flex-wrap gap-1">
          {FLAGS.map((f) => (
            <button key={f} onClick={() => toggle(f)} title={`flag ${f}`} className={`rounded-md border px-2 py-1 font-mono text-xs transition-colors ${flags.includes(f) ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`}>{f}</button>
          ))}
        </div>
        <DevButton icon={FileCode} onClick={() => { setPattern("\\b[\\w.]+@[\\w.]+\\.\\w+\\b"); setText("Reach us at hi@example.com or sales@getfreetoolsai.com today."); }}>Sample</DevButton>
        <div className="ml-auto"><StatusPill state={error ? "error" : pattern && text ? "ok" : "idle"}>{error || `${matches.length} match${matches.length === 1 ? "" : "es"}`}</StatusPill></div>
      </div>
      <Panel label="Test string">
        <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} placeholder="Text to search…" className={`${fieldClass} min-h-[12rem]`} />
      </Panel>
      <Panel label="Matches">
        <div className="min-h-[6rem] rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-[13px]">
          {matches.length === 0 ? (
            <span className="text-zinc-600">No matches yet.</span>
          ) : (
            <ol className="space-y-1.5">
              {matches.map((m, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2">
                  <span className="text-zinc-600">{i + 1}.</span>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">{m[0]}</span>
                  {m.length > 1 && (
                    <span className="text-zinc-500">
                      groups:
                      {m.slice(1).map((g, gi) => (
                        <span key={gi} className="ml-1 rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">{String(g)}</span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </Panel>
      <DevButton icon={Trash2} onClick={() => { setPattern(""); setText(""); }}>Clear</DevButton>
    </div>
  );
}
