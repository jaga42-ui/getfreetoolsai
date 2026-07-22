"use client";

import { useMemo, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { InputArea, CopyButton } from "@/components/tools/text/shared";
import { SegmentedControl } from "@/components/ui";
import { textToMorse, morseToText } from "@/lib/funText";

type Mode = "encode" | "decode";

export default function MorseCode() {
  const [mode, setMode] = useState<Mode>("encode");
  const [text, setText] = useState("SOS");
  const [morse, setMorse] = useState("... --- ...");
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<() => void>(() => {});

  const output = useMemo(
    () => (mode === "encode" ? textToMorse(text) : morseToText(morse)),
    [mode, text, morse]
  );

  const morseToPlay = mode === "encode" ? output : morse;

  const play = async () => {
    const seq = morseToPlay.trim();
    if (!seq || playing) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const unit = 0.09; // seconds per dot
    const freq = 600;
    let t = ctx.currentTime + 0.05;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gain);
    const beep = (dur: number) => {
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.setValueAtTime(0, t + dur);
      t += dur + unit; // gap after symbol
    };
    for (const ch of seq) {
      if (ch === ".") beep(unit);
      else if (ch === "-") beep(unit * 3);
      else if (ch === " ") t += unit * 2;
      else if (ch === "/") t += unit * 4;
    }
    osc.start();
    osc.stop(t + 0.05);
    setPlaying(true);
    stopRef.current = () => {
      try {
        osc.stop();
        ctx.close();
      } catch {
        /* already stopped */
      }
      setPlaying(false);
    };
    osc.onended = () => {
      ctx.close();
      setPlaying(false);
    };
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-4">
        <SegmentedControl<Mode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "Text → Morse" },
            { value: "decode", label: "Morse → Text" },
          ]}
        />
      </div>

      {mode === "encode" ? (
        <InputArea
          value={text}
          onChange={setText}
          onClear={() => setText("")}
          label="Text"
          rows={3}
          placeholder="Type text to convert…"
        />
      ) : (
        <InputArea
          value={morse}
          onChange={setMorse}
          onClear={() => setMorse("")}
          label="Morse code"
          rows={3}
          placeholder="Use . and -, spaces between letters, / between words…"
        />
      )}

      <div className="mt-4 min-h-[64px] rounded-lg border border-border bg-background p-4">
        <p className="mb-1 text-[11px] uppercase tracking-widest text-text-muted">
          {mode === "encode" ? "Morse code" : "Text"}
        </p>
        <p className="break-words font-mono text-lg text-text-primary">
          {output || <span className="text-text-muted/50">…</span>}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyButton text={output} label="Copy result" />
        {playing ? (
          <button
            type="button"
            onClick={() => stopRef.current()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={play}
            disabled={!morseToPlay.trim()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40 disabled:opacity-50"
          >
            <Volume2 className="h-4 w-4" /> Play sound
          </button>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Standard international Morse. Letters are separated by a space and words
        by a forward slash (/). Press play to hear it beeped out at 600 Hz.
      </p>
    </div>
  );
}
