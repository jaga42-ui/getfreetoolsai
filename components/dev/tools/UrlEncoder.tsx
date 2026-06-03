"use client";

import { useState } from "react";
import { ArrowRightLeft, Trash2 } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

export default function UrlEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const run = (text: string, m: "encode" | "decode") => {
    setErr("");
    if (!text) { setOut(""); return; }
    try {
      setOut(m === "encode" ? encodeURIComponent(text) : decodeURIComponent(text));
    } catch {
      setOut("");
      setErr("Invalid input for decoding");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-zinc-700 p-0.5">
          {(["encode", "decode"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); run(input, m); }} className={`rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors ${mode === m ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}>{m}</button>
          ))}
        </div>
        <DevButton icon={ArrowRightLeft} onClick={() => { const nm = mode === "encode" ? "decode" : "encode"; setMode(nm); setInput(out); run(out, nm); }}>Swap</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOut(""); setErr(""); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={err ? "error" : out ? "ok" : "idle"}>{err || "Done"}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label={mode === "encode" ? "Plain text" : "Encoded URL"}>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); run(e.target.value, mode); }} spellCheck={false} placeholder={mode === "encode" ? "Text or URL to encode…" : "Encoded text to decode…"} className={`${fieldClass} min-h-[14rem] break-all`} />
        </Panel>
        <Panel label={mode === "encode" ? "Encoded URL" : "Plain text"} actions={<CopyButton value={out} />}>
          <textarea value={out} readOnly spellCheck={false} className={`${fieldClass} min-h-[14rem] break-all`} />
        </Panel>
      </div>
    </div>
  );
}
