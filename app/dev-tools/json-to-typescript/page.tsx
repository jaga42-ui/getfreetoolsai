import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "JSON to TypeScript — Generate Interfaces Online",
  description:
    "Convert JSON into clean, nested TypeScript interfaces instantly. Handles nested objects, arrays and optional keys. Runs in your browser, free, no signup.",
  keywords:
    "json to typescript, json to ts interface, generate typescript from json, json to interface, typescript type generator, json to type",
  path: "/dev-tools/json-to-typescript",
});

const Tool = dynamic(() => import("@/components/dev/tools/JsonToTypescript"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      Paste a JSON sample — typically an API response — and get back ready-to-use TypeScript
      interfaces. The generator walks the structure recursively, creating named interfaces for
      nested objects, inferring element types for arrays, and marking keys that don&apos;t appear
      in every array item as optional.
    </p>
    <p>
      It saves you from hand-typing types for an unfamiliar payload. Conversion runs entirely in
      your browser, so internal API responses stay private.
    </p>
  </>
);

const faqs = [
  { q: "How are arrays of objects handled?", a: "The tool merges the keys of every object in the array into one interface, marking keys that are missing from some items as optional with a ? — so the type covers the whole array." },
  { q: "Does it infer optional fields?", a: "Yes. Within an array of objects, any key not present in every element becomes optional. Null values are typed as null so you can refine them." },
  { q: "Is my JSON uploaded?", a: "No. Parsing and type generation happen entirely in your browser; nothing is sent to a server." },
  { q: "What name do the interfaces get?", a: "The root interface is named Root, and nested interfaces are named after their key (PascalCased). Rename them to taste after copying." },
];

export default function Page() {
  return (
    <DevFrame slug="json-to-typescript" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
