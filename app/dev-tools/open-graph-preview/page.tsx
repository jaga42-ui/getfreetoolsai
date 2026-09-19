import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Meta Tag Generator — Google & Social Preview Tool",
  description:
    "Generate title, description, canonical, Open Graph and Twitter Card tags with live Google desktop, Google mobile, Facebook and X previews. Free, no signup.",
  keywords:
    "meta tag generator, open graph preview, og tags generator, twitter card generator, serp preview tool, google snippet preview, social share preview, meta description length checker",
  path: "/dev-tools/open-graph-preview",
});

const Tool = dynamic(() => import("@/components/dev/tools/OpenGraphPreview"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      Four different systems read the same page and show four different cards. Google
      builds a search snippet from your <code>&lt;title&gt;</code> and meta description.
      Facebook, LinkedIn, WhatsApp and Slack read Open Graph tags. X reads Twitter Card
      tags, falling back to Open Graph when they are missing. This tool fills all of them
      from one form and renders each preview to that platform&apos;s own layout, so you can
      see what you are actually shipping before you publish.
    </p>

    <h3>Why the preview is by pixel width, not character count</h3>
    <p>
      Nearly every &ldquo;SEO title length&rdquo; guide gives you a character limit. Google
      does not use one. It allots a fixed pixel width to the snippet — roughly 580px for the
      desktop title and about 920px for the description — and cuts the text where the
      rendering runs out of room. That means a 55-character title in capitals can be
      truncated while a 65-character title of narrow lowercase letters fits comfortably.
      This tool measures your text in the same font Google renders it in and shows the real
      width, so the meter tells you something a character counter cannot.
    </p>

    <h3>How to use it</h3>
    <ol>
      <li>
        Write the <strong>page title</strong> and watch the width meter. Lead with the term
        people search for; a brand suffix is fine but it is the first half that earns the
        click.
      </li>
      <li>
        Write the <strong>meta description</strong>. It is not a ranking factor, but it is
        the ad copy for your result — a description that answers the query directly lifts
        click-through rate on a position you already hold.
      </li>
      <li>
        Set the <strong>canonical URL</strong> to the one authoritative address for the
        page. If the page is reachable with and without a trailing slash, with tracking
        parameters, or on both http and https, the canonical is what tells Google which one
        to index.
      </li>
      <li>
        Add an <strong>OG image</strong> at 1200×630. It must be an absolute URL —
        a relative path is the single most common reason a share card comes back blank.
      </li>
      <li>
        Choose the <strong>Twitter card type</strong>. <code>summary_large_image</code> gives
        the full-width banner most publishers want; <code>summary</code> renders a small
        square thumbnail beside the text.
      </li>
      <li>Copy the generated block into the <code>&lt;head&gt;</code> of your page.</li>
    </ol>

    <h3>What the generated block contains</h3>
    <p>
      The output is ordered the way a <code>&lt;head&gt;</code> usually reads: the title and
      description first, then the canonical link, then the Open Graph group, then the
      Twitter Card group. When you supply an image the tool also emits{" "}
      <code>og:image:width</code>, <code>og:image:height</code> and{" "}
      <code>og:image:alt</code> — the dimensions let Facebook and LinkedIn reserve the right
      space on first scrape instead of rendering a small card, and the alt text is an
      accessibility requirement people usually forget on social images.
    </p>

    <h3>Common reasons a share preview looks wrong</h3>
    <ul>
      <li>
        <strong>The platform cached the old card.</strong> Facebook and LinkedIn scrape once
        and hold the result. Re-scrape with the Facebook Sharing Debugger or the LinkedIn
        Post Inspector after you change the tags.
      </li>
      <li>
        <strong>The image URL is relative.</strong> <code>og:image</code> must be absolute
        and publicly reachable, with no login wall and no <code>robots.txt</code> block on
        the image path.
      </li>
      <li>
        <strong>The image is too small.</strong> Under roughly 600×315 most platforms fall
        back to the small card. 1200×630 is the safe size everywhere.
      </li>
      <li>
        <strong>The tags are injected by JavaScript.</strong> Social scrapers do not run
        your JavaScript. Meta tags must be present in the HTML the server returns.
      </li>
      <li>
        <strong>Duplicate tags.</strong> Two <code>og:title</code> tags on one page is
        undefined behaviour; different platforms pick different ones.
      </li>
    </ul>

    <h3>Title and description that actually earn clicks</h3>
    <p>
      Google rewrites the displayed title on a meaningful share of results, usually when
      the title is keyword-stuffed, boilerplate across the site, or does not match the page.
      The way to keep your own title is to make it specific and honest: name the thing the
      page is, in the words a person would type. For the description, front-load the answer.
      Both previews above update as you type, so you can see the truncation point move
      while you edit rather than discovering it a week after launch.
    </p>

    <p>
      Everything runs locally in your browser — nothing you type is uploaded, and the image
      preview loads directly from the URL you supply.
    </p>
  </>
);

const faqs = [
  {
    q: "How long should a title tag be?",
    a: "Aim to stay under about 580 pixels for the desktop snippet, which is roughly 55–60 characters of ordinary mixed-case text. Google truncates by rendered width rather than character count, so the pixel meter in this tool is the accurate check — capitals and wide letters run out of room sooner.",
  },
  {
    q: "How long should a meta description be?",
    a: "Around 920 pixels, which usually works out to 150–160 characters. Google frequently rewrites descriptions to match the query, so treat the length as a ceiling and put the most useful sentence first.",
  },
  {
    q: "Does the meta description affect rankings?",
    a: "Not directly — Google confirmed it is not a ranking factor. It affects click-through rate, which is why a description that answers the searcher's question is still worth writing carefully.",
  },
  {
    q: "What size should an Open Graph image be?",
    a: "1200×630 pixels, a 1.91:1 ratio, under about 5MB. That size renders as a large card on Facebook, LinkedIn, X, Slack and WhatsApp. Below roughly 600×315 most platforms downgrade to the small thumbnail layout.",
  },
  {
    q: "Do I need both Open Graph and Twitter Card tags?",
    a: "Open Graph covers Facebook, LinkedIn, WhatsApp, Slack, Discord and most chat apps. X falls back to Open Graph when Twitter tags are absent, so twitter:card is mainly about choosing between the large image and the small summary layout. This tool generates both.",
  },
  {
    q: "Why isn't my image showing when I share the link?",
    a: "The usual causes are a relative instead of absolute image URL, an image smaller than the platform minimum, an image path blocked in robots.txt, or the platform serving a cached scrape from before your change. Re-scrape with the platform's own debugger after fixing the tag.",
  },
  {
    q: "What does the canonical tag do?",
    a: "It names the one authoritative URL for a page so search engines consolidate signals there instead of treating trailing-slash, parameter and protocol variants as separate duplicate pages. Point it at the clean URL, never at a version carrying UTM parameters.",
  },
  {
    q: "Is any of this uploaded to a server?",
    a: "No. The previews and the meta tag generation run entirely in your browser. The only network request is your browser loading the preview image from the URL you enter.",
  },
];

export default function Page() {
  return (
    <DevFrame slug="open-graph-preview" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
