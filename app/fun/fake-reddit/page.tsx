import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  PrivacyNote,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Fake Reddit Post Generator — Thread Screenshot Maker",
  description:
    "Free fake Reddit post generator. Build a realistic thread screenshot with upvotes, an award-free header and comments, then download it as a PNG.",
  keywords:
    "fake reddit post, fake reddit generator, reddit post generator, fake reddit screenshot, reddit thread mockup, fake reddit comment",
  path: "/fun/fake-reddit",
});

const jsonLd = softwareAppSchema({
  name: "Fake Reddit Post Generator",
  description:
    "Create a realistic Reddit post and comment thread screenshot image, in your browser.",
  path: "/fun/fake-reddit",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeReddit"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I add comments?", a: "Type one per line as 'username: comment'. It is the same grammar the fake Discord chat generator uses, so if you have used that one you already know this." },
  { q: "Can I set the upvote count?", a: "Yes. Set any number and it is formatted the way Reddit does it — 12400 becomes 12.4k. Comment scores are derived from it and decay down the thread, as real ones do." },
  { q: "Can I switch to light mode?", a: "Yes. Untick Dark mode for the light theme. Both export at 2× resolution so the PNG stays sharp when posted." },
  { q: "Does it upload anything?", a: "No. The screenshot is drawn on your device with the Canvas API, and nothing you type leaves the browser." },
  { q: "Is this okay to use?", a: "For memes and jokes, yes. Don't use it to invent quotes from a real person or to pass a made-up thread off as a genuine one." },
];

const about = (
  <>
    <p>
      A forum screenshot is one of the most-shared meme formats there is, and
      what sells it is never the post text — it is the furniture around it. A
      bare title and body reads like a blog quote. The vote column, the{" "}
      <em>Posted by u/… 7h ago</em> line and a short comment thread underneath
      are what make it read as a real screenshot, so all of them are editable
      here.
    </p>
    <p>
      Set the subreddit, username, upvotes and age, write the post, then add
      comments one per line as <code>username: comment</code>. Comment scores
      are derived from the post score and decay down the thread, which is what
      real ones do — uniform scores are a giveaway.
    </p>
    <p>
      Everything is drawn in your browser and nothing is uploaded. Also try the{" "}
      <a href="/fun/fake-tweet" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake tweet generator</a>,
      the{" "}
      <a href="/fun/fake-chatgpt" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake AI chat generator</a>{" "}
      or the{" "}
      <a href="/fun/fake-discord" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake Discord chat generator</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake Reddit Post" />
      <ToolHeader
        title="Fake Reddit Post Generator"
        description="Build a realistic thread screenshot with upvotes, post details and comments, then download it as a PNG."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The screenshot is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake Reddit post"
        steps={["Set the subreddit, username and upvotes", "Write the post title and body", "Add comments as username: comment, then download the PNG"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-reddit" />
    </div>
  );
}
