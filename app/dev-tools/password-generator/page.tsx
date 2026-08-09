import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Password Generator — Free Strong Random Password Maker",
  description:
    "Generate strong random passwords free. Pick length and character sets, exclude lookalikes and check strength — cryptographically secure, in-browser.",
  keywords:
    "password generator, strong password generator, random password generator, secure password generator, create password, password maker, generate password online",
  path: "/dev-tools/password-generator",
});

const Tool = dynamic(() => import("@/components/dev/tools/PasswordGenerator"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      This password generator builds strong, unpredictable passwords using the
      browser&apos;s cryptographically secure random source (
      <code>crypto.getRandomValues</code>) — not the predictable{" "}
      <code>Math.random()</code> many generators rely on. It draws each character
      without modulo bias, guarantees at least one character from every set you
      enable, then shuffles the result so the password is uniformly random.
    </p>
    <h3>Choosing a strong password</h3>
    <ul>
      <li><strong>Length matters most.</strong> Every extra character multiplies the number of possible passwords. 16+ characters is a good default; 20+ for anything critical.</li>
      <li><strong>Mix character sets.</strong> Uppercase, lowercase, numbers and symbols together enlarge the pool and raise entropy.</li>
      <li><strong>Use a unique password per account</strong>, ideally stored in a password manager, so one breach can&apos;t unlock everything.</li>
    </ul>
    <p>
      The strength meter shows the estimated <strong>entropy in bits</strong> —
      the higher the number, the harder the password is to guess or brute-force.
      Above 60 bits is strong; above 80 bits is very strong.
    </p>
  </>
);

const faqs = [
  { q: "Are these passwords safe and truly random?", a: "Yes. They are generated with the browser's cryptographically secure random number generator (crypto.getRandomValues) using unbiased sampling — the same class of randomness used for security keys. Weak generators that use Math.random() are predictable; this one is not." },
  { q: "Is my password sent anywhere?", a: "No. Passwords are generated entirely in your browser on your device and are never transmitted, logged or stored on any server. Reload the page and they're gone." },
  { q: "What length should my password be?", a: "For most accounts, 16 characters with mixed character sets is strong. For high-value accounts (email, banking, crypto) use 20 or more. Length increases strength faster than any other setting." },
  { q: "What does 'exclude similar characters' do?", a: "It removes easily-confused characters like the letter O and the number 0, or lowercase l and the number 1. This is handy when a password has to be read aloud or typed by hand, at a small cost to the character pool." },
  { q: "What do the 'bits' in the strength meter mean?", a: "Bits measure entropy — roughly, how many yes/no guesses it would take to find the password. Each extra bit doubles the difficulty. Under 40 bits is weak, 60+ is strong, and 80+ is very strong." },
  { q: "Should I use a password manager?", a: "Yes. The safest approach is to generate a unique, long password for every account and store them in a reputable password manager, so you only need to remember one master password." },
];

export default function Page() {
  return (
    <DevFrame slug="password-generator" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
