"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui";

const SUBJECTS = [
  "Tool Suggestion",
  "Bug Report",
  "General Feedback",
  "Business Enquiry",
  "Other",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 20) {
      setError("Please fill in your name, email, and a message of at least 20 characters.");
      return;
    }
    setError("");
    // No backend: open the user's email client pre-filled.
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
    );
    const sub = encodeURIComponent(`[${subject}] from ${name}`);
    window.location.href = `mailto:hello@getfreetoolsai.com?subject=${sub}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-6 text-center">
        <Check className="mx-auto h-8 w-8 text-secondary" />
        <p className="mt-3 text-lg font-semibold text-secondary">Thank you!</p>
        <p className="mt-1 text-sm text-text-muted">
          We&apos;ll get back to you within 24–48 hours. If your email app
          didn&apos;t open, write to us directly at{" "}
          <a
            href="mailto:hello@getfreetoolsai.com"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            hello@getfreetoolsai.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-border bg-surface/40 p-4 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-text-muted">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-text-muted">Subject</span>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-text-muted">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
          minLength={20}
          placeholder="Tell us what's on your mind (at least 20 characters)…"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" size="lg" icon={Send}>
        Send Message
      </Button>
    </form>
  );
}
