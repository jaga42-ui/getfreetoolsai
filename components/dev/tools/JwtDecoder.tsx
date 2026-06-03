"use client";

import { useMemo, useState } from "react";
import { Trash2, FileCode } from "lucide-react";
import { fieldClass, DevButton, CopyButton, Panel, StatusPill } from "@/components/dev/ui";

function b64urlDecode(s: string) {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = norm + "===".slice((norm.length + 3) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldiBVc2VyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.W5sI4n3kqg5Jr2QF8aQ4r6n0bq3aQ9XwQ8s9b6c0aA";

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "A JWT has three dot-separated parts: header.payload.signature." };
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      return { header, payload, signature: parts[2] ?? "" };
    } catch {
      return { error: "Could not decode — is this a valid JWT?" };
    }
  }, [token]);

  const expInfo = useMemo(() => {
    if (!result || "error" in result) return null;
    const exp = (result.payload as Record<string, unknown>).exp;
    if (typeof exp !== "number") return null;
    const d = new Date(exp * 1000);
    return { date: d.toUTCString(), expired: d.getTime() < Date.now() };
  }, [result]);

  const pretty = (o: unknown) => JSON.stringify(o, null, 2);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DevButton icon={FileCode} onClick={() => setToken(SAMPLE)}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => setToken("")}>Clear</DevButton>
        {expInfo && (
          <div className="ml-auto">
            <StatusPill state={expInfo.expired ? "error" : "ok"}>
              {expInfo.expired ? `Expired · ${expInfo.date}` : `Valid until ${expInfo.date}`}
            </StatusPill>
          </div>
        )}
      </div>
      <Panel label="JWT">
        <textarea value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} placeholder="Paste a JWT (header.payload.signature)…" className={`${fieldClass} min-h-[7rem] break-all`} />
      </Panel>
      {result && "error" in result && <p className="text-sm text-red-400">{result.error}</p>}
      {result && !("error" in result) && (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Header" actions={<CopyButton value={pretty(result.header)} />}>
            <pre className={`${fieldClass} min-h-[10rem] overflow-auto whitespace-pre`}>{pretty(result.header)}</pre>
          </Panel>
          <Panel label="Payload" actions={<CopyButton value={pretty(result.payload)} />}>
            <pre className={`${fieldClass} min-h-[10rem] overflow-auto whitespace-pre`}>{pretty(result.payload)}</pre>
          </Panel>
        </div>
      )}
      <p className="text-xs text-zinc-500">
        This tool only <span className="text-zinc-300">decodes</span> — it never verifies the signature, and your token is never sent to any server.
      </p>
    </div>
  );
}
