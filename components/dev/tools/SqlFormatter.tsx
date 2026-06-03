"use client";

import { useState } from "react";
import { format, type SqlLanguage } from "sql-formatter";
import { Wand2, Trash2, FileCode } from "lucide-react";
import { fieldClass, inputClass, DevButton, CopyButton, Panel, Labeled, StatusPill } from "@/components/dev/ui";

const LANGS: SqlLanguage[] = ["sql", "mysql", "postgresql", "mariadb", "sqlite", "bigquery", "snowflake", "plsql"];
const SAMPLE =
  "select id,name,email from users u join orders o on o.user_id=u.id where u.active=1 and o.total>100 order by o.created_at desc limit 10;";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<SqlLanguage>("sql");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ s: "ok" | "error" | "idle"; msg: string }>({ s: "idle", msg: "" });

  const run = (raw?: string, lang?: SqlLanguage) => {
    const src = raw ?? input;
    const lg = lang ?? language;
    if (!src.trim()) { setOutput(""); setStatus({ s: "idle", msg: "" }); return; }
    try {
      setOutput(format(src, { language: lg, tabWidth: 2, keywordCase: "upper" }));
      setStatus({ s: "ok", msg: "Formatted" });
    } catch (e) {
      setOutput("");
      setStatus({ s: "error", msg: e instanceof Error ? e.message : "Could not format" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Labeled label="Dialect">
          <select value={language} onChange={(e) => { const v = e.target.value as SqlLanguage; setLanguage(v); run(undefined, v); }} className={inputClass}>
            {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Labeled>
        <DevButton variant="primary" icon={Wand2} onClick={() => run()}>Format</DevButton>
        <DevButton icon={FileCode} onClick={() => { setInput(SAMPLE); run(SAMPLE); }}>Sample</DevButton>
        <DevButton icon={Trash2} onClick={() => { setInput(""); setOutput(""); setStatus({ s: "idle", msg: "" }); }}>Clear</DevButton>
        <div className="ml-auto"><StatusPill state={status.s}>{status.msg}</StatusPill></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="SQL input">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste a SQL query…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
        <Panel label="Formatted" actions={<CopyButton value={output} />}>
          <textarea value={output} readOnly spellCheck={false} placeholder="Formatted SQL appears here…" className={`${fieldClass} min-h-[18rem]`} />
        </Panel>
      </div>
    </div>
  );
}
