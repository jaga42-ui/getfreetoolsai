"use client";

import { useState } from "react";
import { Wand2, Minimize2, Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

const SAMPLE = `{"name":"GetFreeToolsAI","tools":42,"free":true,"tags":["pdf","image","calc"],"owner":{"city":"Bhubaneswar","since":2026}}`;

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const run = (mode: "format" | "minify") => {
    if (!input.trim()) {
      setOutput("");
      setStatus({ s: "idle", msg: "" });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, mode === "format" ? 2 : 0));
      setStatus({ s: "ok", msg: "Valid JSON" });
    } catch (e) {
      setOutput("");
      setStatus({ s: "error", msg: e instanceof Error ? e.message : "Invalid JSON" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DevButton variant="primary" icon={Wand2} onClick={() => run("format")}>Format</DevButton>
        <DevButton icon={Minimize2} onClick={() => run("minify")}>Minify</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="Input JSON">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste JSON here…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
        <Panel label="Output" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="Formatted JSON appears here…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
      </div>
    </div>
  );
}
