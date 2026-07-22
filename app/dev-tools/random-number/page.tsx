import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Random Number Generator — Free, Secure & Customizable",
  description:
    "Free random number generator. Pick a range, choose integers or decimals, generate unique numbers, sort them, and copy the list. Cryptographically secure, in your browser.",
  keywords:
    "random number generator, random number, number generator, random integer, generate random numbers, random number picker, rng, unique random numbers",
  path: "/dev-tools/random-number",
});

const Tool = dynamic(() => import("@/components/dev/tools/RandomNumberGenerator"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      This random number generator produces numbers in any range you set. Choose
      whole <strong>integers</strong> or <strong>decimals</strong> with a set
      number of places, generate one number or thousands at once, keep them{" "}
      <strong>unique</strong>, and optionally <strong>sort</strong> the result.
    </p>
    <h3>Genuinely random</h3>
    <p>
      Numbers come from the browser&apos;s cryptographically secure random source
      (<code>crypto.getRandomValues</code>) using unbiased sampling — not the
      predictable <code>Math.random()</code> — so the distribution is even across
      your range.
    </p>
    <p>
      Everything runs on your device, so it works offline and nothing is sent to a
      server.
    </p>
  </>
);

const faqs = [
  { q: "How does this generate random numbers?", a: "It uses the browser's cryptographically secure random number generator with rejection sampling, which avoids the slight bias a plain modulo would introduce, so every value in your range is equally likely." },
  { q: "Can I generate numbers without repeats?", a: "Yes. Turn on 'Unique' and the generator returns distinct numbers. If you ask for more unique integers than the range allows, it tells you and returns as many as fit." },
  { q: "Can it generate decimals?", a: "Yes. Switch to Decimals and set how many decimal places you want — useful for random prices, coordinates or test data." },
  { q: "What can I use it for?", a: "Drawing raffle or lottery numbers, picking a winner, sampling data, seeding tests, choosing a random item by index, or any time you need an unbiased number in a range." },
  { q: "Is it private?", a: "Yes. Generation happens entirely in your browser and nothing is uploaded or logged." },
];

export default function Page() {
  return (
    <DevFrame slug="random-number" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
