import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Hash Generator — SHA-1, SHA-256, SHA-512 Online",
  description:
    "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes from text online. Computed in your browser with the Web Crypto API — nothing is uploaded. Free, no signup.",
  keywords:
    "hash generator, sha256 generator, sha512 hash, sha1 hash online, generate hash from text, online hash tool, web crypto hash",
  path: "/dev-tools/hash-generator",
});

const Tool = dynamic(() => import("@/components/dev/tools/HashGenerator"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      A hash is a fixed-length fingerprint of your input — change a single character and the
      output changes completely. This tool computes SHA-1, SHA-256, SHA-384 and SHA-512 at once
      as you type, using the browser&apos;s built-in Web Crypto API.
    </p>
    <p>
      Use it to verify file/text integrity, compare checksums, or generate deterministic keys.
      Everything is computed locally — your input never leaves your device.
    </p>
  </>
);

const faqs = [
  { q: "Where is the hash computed?", a: "Entirely in your browser via the Web Crypto API (crypto.subtle). Nothing you type is sent to a server." },
  { q: "Why is there no MD5?", a: "MD5 is cryptographically broken and isn't supported by the browser's secure crypto API. For integrity or security use SHA-256 or stronger." },
  { q: "Which algorithm should I use?", a: "SHA-256 is the modern default for most needs. Use SHA-384/512 when you want a longer digest; SHA-1 is provided only for legacy compatibility." },
  { q: "Does the same input always give the same hash?", a: "Yes. Hashing is deterministic — identical input always produces an identical digest, which is what makes it useful for verification." },
];

export default function Page() {
  return (
    <DevFrame slug="hash-generator" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
