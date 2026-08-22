"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

import { Button, ErrorMessage } from "@/components/ui";

/**
 * Text to speech using the browser's built-in speech synthesis.
 *
 * No network, no API key, no upload — the voices are the ones already
 * installed on the visitor's device, which is why the list differs between
 * Windows, macOS, Android and iOS.
 */
export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  // Holds the utterance so its handlers can be detached on unmount.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    // Chrome populates the voice list asynchronously and fires voiceschanged
    // once it has. Reading it only on mount returns an empty array there.
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length === 0) return;
      setVoices(list);
      setVoiceUri((current) => {
        if (current) return current;
        const preferred =
          list.find((v) => v.default) ??
          list.find((v) => v.lang.startsWith("en")) ??
          list[0];
        return preferred?.voiceURI ?? "";
      });
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      // Speech continues after navigation otherwise — the synth is global to
      // the tab, not owned by this component.
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(() => {
    if (!text.trim()) return;
    const synth = window.speechSynthesis;

    // Resume rather than restart if the user paused mid-sentence.
    if (synth.paused) {
      synth.resume();
      setPaused(false);
      return;
    }

    synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === voiceUri);
    if (voice) {
      u.voice = voice;
      // Setting lang to match the voice stops some engines from falling back
      // to the document language and mispronouncing everything.
      u.lang = voice.lang;
    }
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utteranceRef.current = u;
    synth.speak(u);
    setSpeaking(true);
    setPaused(false);
  }, [text, voices, voiceUri, rate, pitch]);

  const pause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  if (!supported) {
    return (
      <ErrorMessage message="This browser does not support speech synthesis. Try Chrome, Edge or Safari." />
    );
  }

  return (
    <div>
      <label
        htmlFor="tts-text"
        className="mb-2 block text-sm font-medium text-text-primary"
      >
        Text to read aloud
      </label>
      <textarea
        id="tts-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Type or paste the text you want spoken..."
        className="w-full resize-y rounded-lg border border-border bg-surface p-3.5 text-sm leading-relaxed text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
      />
      <p className="mt-1.5 text-xs text-text-muted">
        {text.length.toLocaleString()} characters
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="tts-voice"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            Voice
          </label>
          <select
            id="tts-voice"
            value={voiceUri}
            onChange={(e) => setVoiceUri(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          >
            {voices.length === 0 && <option>Loading voices…</option>}
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <Slider
          id="tts-rate"
          label="Speed"
          value={rate}
          min={0.5}
          max={2}
          onChange={setRate}
          format={(v) => `${v.toFixed(1)}x`}
        />
        <Slider
          id="tts-pitch"
          label="Pitch"
          value={pitch}
          min={0}
          max={2}
          onChange={setPitch}
          format={(v) => v.toFixed(1)}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          onClick={speak}
          disabled={!text.trim() || (speaking && !paused)}
          icon={Play}
        >
          {paused ? "Resume" : "Speak"}
        </Button>
        <Button
          onClick={pause}
          disabled={!speaking || paused}
          variant="outline"
          icon={Pause}
        >
          Pause
        </Button>
        <Button onClick={stop} disabled={!speaking} variant="outline" icon={Square}>
          Stop
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        Voices come from your own device, so the list depends on your operating
        system and browser. Nothing you type is sent anywhere.
      </p>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  onChange,
  format,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center justify-between text-sm font-medium text-text-primary"
      >
        {label}
        <span className="font-normal text-text-muted">{format(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
