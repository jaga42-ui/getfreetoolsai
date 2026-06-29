import { NextResponse } from "next/server";

// Runs as a Vercel Function (server-side) so the provider API key is never
// exposed to the browser. The newsletter form posts here same-origin, which
// keeps it within the existing CSP connect-src 'self'.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Subscribe an email to the newsletter. Defaults to Buttondown (simple,
 * privacy-friendly, generous free tier). To swap providers, replace the fetch
 * block below — the request/response contract this route exposes stays the same.
 *
 * Env:
 *   BUTTONDOWN_API_KEY  — server-only provider key (required to activate)
 */
export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    // Not wired up yet — the UI is gated on NEXT_PUBLIC_NEWSLETTER_ENABLED so
    // real users never hit this, but keep the response explicit for debugging.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        tags: ["getfreetoolsai"],
      }),
    });

    if (res.ok) return NextResponse.json({ ok: true });

    // An already-subscribed email is a success from the visitor's perspective.
    const text = await res.text();
    if (res.status === 400 && /already|exists|subscribed/i.test(text)) {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "network" }, { status: 502 });
  }
}
