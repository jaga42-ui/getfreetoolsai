import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "UTM Builder — Free Campaign URL Tracking Link Generator",
  description:
    "Build UTM tracking URLs for Google Analytics free. Channel presets, auto-cleaned parameters, QR code and a saved-campaign list you can export to CSV.",
  keywords:
    "utm builder, utm link builder, campaign url builder, utm generator, google analytics utm, utm parameters, tracking link generator, utm code builder",
  path: "/dev-tools/utm-builder",
});

const Tool = dynamic(() => import("@/components/dev/tools/UtmBuilder"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      A UTM builder turns a plain page URL into a tracking link that tells your
      analytics exactly where a visitor came from. The parameters are just query
      string values appended to the URL — Google Analytics 4, Matomo, Plausible,
      Adobe Analytics and almost every other platform read the same five names,
      which is why UTM tagging has stayed the standard since Urchin Tracking
      Module gave it the acronym in 2005.
    </p>

    <h3>What each UTM parameter does</h3>
    <ul>
      <li>
        <strong>utm_source</strong> — the specific referrer: <code>google</code>,{" "}
        <code>newsletter</code>, <code>partner-blog</code>. Answers <em>which property
        sent this person?</em>
      </li>
      <li>
        <strong>utm_medium</strong> — the channel type: <code>cpc</code>,{" "}
        <code>email</code>, <code>social</code>, <code>affiliate</code>. This is the
        field GA4 uses to slot the visit into a default channel group, so getting it
        wrong is what sends traffic to the dreaded <em>Unassigned</em> bucket.
      </li>
      <li>
        <strong>utm_campaign</strong> — the promotion the link belongs to:{" "}
        <code>spring-sale</code>, <code>2026-q3-webinar</code>.
      </li>
      <li>
        <strong>utm_term</strong> — the paid keyword. Mostly used by search ads, and
        usually populated automatically by the ad platform.
      </li>
      <li>
        <strong>utm_content</strong> — which creative or placement was clicked. Use it
        to A/B test two buttons in the same email, or the header link versus the
        footer link.
      </li>
      <li>
        <strong>utm_id</strong> — an optional campaign ID that lets GA4 join the click
        to imported cost data, so you can report real ROAS instead of just sessions.
      </li>
    </ul>

    <h3>How to use this UTM builder</h3>
    <ol>
      <li>
        Paste the destination URL. Use the final landing page, not a redirect or a
        shortener — a redirect can strip the query string before analytics sees it.
      </li>
      <li>
        Pick a preset (Facebook Ads, Google Ads, Newsletter, X, LinkedIn, Affiliate)
        to fill source and medium with conventional values, or type your own.
      </li>
      <li>Name the campaign. Reuse the exact same name across every channel in that campaign.</li>
      <li>
        Add <code>utm_content</code> when more than one link in the same message points
        at the same page, so you can tell which one earned the click.
      </li>
      <li>Copy the link, or download the QR code for print, packaging or a slide deck.</li>
      <li>
        Hit <strong>Save</strong> to keep the link in the campaign list, and export the
        whole list to CSV when you hand it to the rest of the team.
      </li>
    </ol>

    <h3>Why the auto-clean toggle matters</h3>
    <p>
      Analytics platforms treat UTM values as case-sensitive strings. A campaign tagged{" "}
      <code>Spring Sale</code> in one email, <code>spring-sale</code> in an ad and{" "}
      <code>Spring_Sale</code> in a social post produces three separate rows in your
      report, each holding a third of the real numbers. That single inconsistency is the
      most common reason campaign reporting looks wrong.
    </p>
    <p>
      With auto-clean on, every value is lowercased, spaces become hyphens, duplicate
      hyphens collapse, and characters that would need percent-encoding are dropped. The
      result is a link that looks the same no matter who on the team built it. Turn the
      toggle off if you need to preserve an exact value that an ad platform generates for
      you, such as a dynamic <code>{"{keyword}"}</code> macro.
    </p>

    <h3>A worked example</h3>
    <p>
      You are running a Q3 webinar promoted through a LinkedIn ad, a newsletter and an
      affiliate. All three point at <code>https://example.com/webinar</code>. Tag them as{" "}
      <code>utm_campaign=2026-q3-webinar</code> throughout, then vary the channel:
      LinkedIn gets <code>utm_source=linkedin&amp;utm_medium=cpc</code>, the newsletter
      gets <code>utm_source=newsletter&amp;utm_medium=email</code>, and the affiliate gets{" "}
      <code>utm_source=partner&amp;utm_medium=affiliate</code>. In GA4 you can now read
      the whole campaign as one line and still break it down by channel — and because the
      newsletter&apos;s header and footer links carry{" "}
      <code>utm_content=header</code> and <code>utm_content=footer</code>, you learn which
      placement actually drives registrations.
    </p>

    <h3>Common mistakes to avoid</h3>
    <ul>
      <li>
        <strong>Tagging internal links.</strong> A UTM on a link between two of your own
        pages restarts the session attribution, which erases the original source and
        inflates your self-referral numbers. Only tag links that arrive from outside.
      </li>
      <li>
        <strong>Putting UTMs on a canonical URL.</strong> Tagged URLs should never appear
        in your sitemap, canonical tags or internal navigation — search engines can index
        the tagged variant as a duplicate.
      </li>
      <li>
        <strong>Personal data in a parameter.</strong> Never place an email address, name
        or customer ID in a UTM value. It is visible in the address bar, stored in
        analytics, and in most jurisdictions that is a reportable data problem.
      </li>
      <li>
        <strong>Overwriting existing query strings.</strong> If the landing page already
        needs parameters of its own, keep them. This builder merges the UTMs into the
        existing query string rather than replacing it.
      </li>
    </ul>

    <p>
      Everything runs in your browser. The URL you type, the campaign list and the QR
      code are all generated locally, so unreleased campaign names never leave your
      device.
    </p>
  </>
);

const faqs = [
  {
    q: "Which UTM parameters are required?",
    a: "utm_source, utm_medium and utm_campaign are the three that matter. Google Analytics 4 can record a visit with only utm_source, but without a medium it cannot place the traffic in a channel group, so the session usually lands in Unassigned. utm_term, utm_content and utm_id are optional.",
  },
  {
    q: "Are UTM parameters case-sensitive?",
    a: "Yes. Google Analytics treats Spring-Sale and spring-sale as two different campaigns and reports them as separate rows. That is why this builder lowercases values by default — a consistent convention keeps one campaign on one line.",
  },
  {
    q: "Do UTM parameters hurt SEO?",
    a: "Not if you only use them on inbound links from other sites, emails and ads. Problems start when tagged URLs get into your sitemap, canonical tags or internal navigation, because search engines can then index the tagged version as a duplicate of the clean page. Keep your canonical tag pointing at the untagged URL.",
  },
  {
    q: "Should I put UTM tags on internal links?",
    a: "No. A UTM on a link between two of your own pages starts a new session and overwrites the original acquisition source, so you lose the record of how that visitor actually found you. Use an internal event or a click-tracking parameter your analytics ignores instead.",
  },
  {
    q: "What is utm_id for?",
    a: "utm_id carries a campaign ID that GA4 matches against imported cost data, letting you report spend, ROAS and CPA next to the sessions. If you are not importing cost data you can leave it blank.",
  },
  {
    q: "Can I shorten a UTM link?",
    a: "Yes, most URL shorteners preserve the query string through the redirect, so the parameters still reach the landing page. Verify with your shortener first, and keep the full link in your campaign sheet so you know what the short link points at.",
  },
  {
    q: "Where are my saved campaigns stored?",
    a: "In your browser's local storage on this device only. They are never uploaded, so clearing site data or switching browsers removes them — export the CSV if you need a durable copy or want to share the list.",
  },
  {
    q: "Is this UTM builder free?",
    a: "Yes, completely free with no signup, no link limit and no watermark. The tool is a static page that does all of its work in your browser.",
  },
];

export default function Page() {
  return (
    <DevFrame slug="utm-builder" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
