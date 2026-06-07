import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "UUID Generator — Free Online UUID v4 Generator",
  description:
    "Generate random UUID v4s in bulk with one-click copy, uppercase and no-hyphen options. Cryptographically random, generated in your browser. Free.",
  keywords:
    "uuid generator, generate uuid, uuid v4 generator, guid generator, random uuid online, bulk uuid generator",
  path: "/dev-tools/uuid",
});

const Tool = dynamic(() => import("@/components/dev/tools/UuidGenerator"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      This generator produces version-4 UUIDs using the browser&apos;s cryptographically secure
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">crypto.randomUUID()</code>,
      so the values are suitable for real identifiers, not just placeholders. Generate up to
      100 at once, copy any single value, or copy the whole list.
    </p>
    <p>
      Toggle uppercase or strip the hyphens to match your database or code style. Generation
      runs entirely on your device.
    </p>
  </>
);

const faqs = [
  { q: "Are these UUIDs random and safe to use?", a: "Yes. They are version-4 UUIDs from the browser's cryptographically secure random source, the same primitive used for security-sensitive values." },
  { q: "What is a UUID v4?", a: "A 128-bit identifier where most bits are random, giving an astronomically low chance of collision — ideal for database keys, request IDs and file names." },
  { q: "Can I generate them without hyphens or in uppercase?", a: "Yes. Use the Hyphens and Uppercase toggles, then click Generate to apply your formatting." },
  { q: "Is anything sent to a server?", a: "No. UUIDs are generated locally in your browser and never leave your device." },
];

export default function Page() {
  return (
    <DevFrame slug="uuid" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
