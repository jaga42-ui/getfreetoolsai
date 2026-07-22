"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, RotateCcw } from "lucide-react";

const CODE = `function initExploit(target) {
  const socket = net.connect({ host: target, port: 443 });
  const payload = Buffer.from(SHELLCODE, 'base64');
  socket.on('connect', () => {
    console.log('[+] handshake complete: ' + target);
    for (let i = 0; i < payload.length; i += CHUNK) {
      socket.write(payload.slice(i, i + CHUNK));
    }
  });
  return new Promise((resolve) => {
    scanPorts(target, [22, 80, 443, 3306, 8080]).then((open) => {
      open.forEach((p) => bruteforce(target, p, WORDLIST));
      resolve(injectRootkit(target, open));
    });
  });
}

async function bypassFirewall(node) {
  const keys = await deriveKeys(node.fingerprint);
  return keys.map((k) => ({ node, token: sign(k, NONCE) }));
}

// establishing encrypted tunnel...
const mesh = new OverlayNetwork(SEED_NODES);
mesh.route(packet, { anonymize: true, hops: 7 });
grantAccess(sessionId, 'ROOT');
`;

export default function HackerTyper() {
  const [output, setOutput] = useState("");
  const [access, setAccess] = useState<"idle" | "granted">("idle");
  const posRef = useRef(0);
  const preRef = useRef<HTMLPreElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = preRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [output]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Access-granted gag on Enter; ignore modifier-only keys.
    if (e.key === "Enter") {
      setAccess("granted");
      return;
    }
    if (e.key.length !== 1 && e.key !== "Backspace") return;
    e.preventDefault();
    setAccess("idle");
    const step = 4;
    const next = CODE.slice(posRef.current, posRef.current + step);
    posRef.current = (posRef.current + step) % CODE.length;
    setOutput((o) => o + next);
  };

  const goFullscreen = () => {
    wrapRef.current?.requestFullscreen?.();
    wrapRef.current?.focus();
  };

  const reset = () => {
    setOutput("");
    posRef.current = 0;
    setAccess("idle");
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative h-[60vh] max-h-[520px] overflow-hidden rounded-lg border border-green-500/30 bg-black p-4 font-mono text-sm text-green-400 outline-none focus:border-green-500/60"
      >
        <pre ref={preRef} className="h-full overflow-y-auto whitespace-pre-wrap break-words">
          {output || (
            <span className="text-green-500/50">
              Click here and start mashing the keyboard — random keys type out
              &quot;hacker&quot; code. Press Enter for ACCESS GRANTED.
            </span>
          )}
          {output && <span className="animate-pulse">▋</span>}
        </pre>

        {access === "granted" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="border-2 border-green-400 px-8 py-4 font-mono text-2xl font-bold tracking-widest text-green-400 sm:text-4xl">
              ACCESS GRANTED
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={goFullscreen}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40"
        >
          <Maximize2 className="h-4 w-4" /> Fullscreen
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Just for laughs — nothing is actually being hacked and no code runs. Go
        fullscreen, type away, and press Enter for the big reveal. Press Esc to
        exit fullscreen.
      </p>
    </div>
  );
}
