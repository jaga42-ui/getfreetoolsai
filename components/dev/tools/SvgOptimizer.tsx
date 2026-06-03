"use client";

import { useState } from "react";
import { Wand2, Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

const byteLen = (s: string) => new TextEncoder().encode(s).length;
const fmt = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Created with an editor -->\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="24" height="24" viewBox="0 0 24 24">\n  <metadata>some metadata</metadata>\n  <path inkscape:label="x" d="M12 2 L2 22 H22 Z" fill="currentColor"/>\n</svg>`;

function optimize(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata>[\s\S]*?<\/metadata>/gi, "")
    .replace(/<(title|desc)>[\s\S]*?<\/\1>/gi, "")
    .replace(/\s(inkscape|sodipodi):[\w-]+="[^"]*"/g, "")
    .replace(/\sxmlns:(inkscape|sodipodi|dc|cc|rdf)="[^"]*"/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const run = (raw?: string) => {
    const src = raw ?? input;
    if (!src.trim()) { setOutput(""); setStatus({ s: "idle", msg: "" }); return; }
    const out = optimize(src);
    setOutput(out);
    const before = byteLen(src), after = byteLen(out);
    setStatus({ s: "ok", msg: `${fmt(before)} → ${fmt(after)} · −${before ? Math.round((1 - after / before) * 100) : 0}%` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DevButton variant="primary" icon={Wand2} onClick={() => run()}>Optimize</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); run(SAMPLE); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="SVG input">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste SVG markup…" className={`${fieldClass} min-h-[16rem]`} />
        </Panel>
        <Panel label="Optimized" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="Optimized SVG appears here…" className={`${fieldClass} min-h-[16rem]`} />
        </Panel>
      </div>
      {output && (
        <Panel label="Preview">
          <div className="flex min-h-[6rem] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 p-4 text-zinc-200" dangerouslySetInnerHTML={{ __html: output }} />
        </Panel>
      )}
      <p className="text-xs text-zinc-500">Strips XML prolog, comments, editor metadata and excess whitespace. Runs in your browser.</p>
    </div>
  );
}
