import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "JWT Decoder & Inspector — Decode JWT Online | GetFreeToolsAI",
  description:
    "Decode and inspect a JWT's header, payload and claims online. Your token is decoded locally and never sent to a server. Free, no signup.",
  keywords:
    "jwt decoder, decode jwt, jwt inspector, jwt parser, json web token decoder, jwt expiration, jwt debugger",
  path: "/dev-tools/jwt-decoder",
});

const Tool = dynamic(() => import("@/components/dev/tools/JwtDecoder"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      A JSON Web Token has three Base64URL parts — header, payload and signature — separated by
      dots. This inspector decodes the header and payload into readable JSON and translates the
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">exp</code>
      claim into a human date so you can immediately see whether a token has expired.
    </p>
    <p>
      Crucially, decoding happens entirely in your browser and the token is never transmitted —
      which is exactly what you want when debugging real access tokens.
    </p>
  </>
);

const faqs = [
  { q: "Does this verify the JWT signature?", a: "No. It only decodes the header and payload so you can read the claims. Verifying the signature requires the secret or public key and should be done server-side." },
  { q: "Is my token sent anywhere?", a: "Never. The token is decoded locally in your browser, which is why it is safe to paste real access tokens here." },
  { q: "How do I know if a token is expired?", a: "If the payload has an exp claim, the tool converts it to a date and shows a green “valid until” or a red “expired” badge." },
  { q: "Why can't my token be decoded?", a: "A JWT must have at least a header and payload separated by dots, each valid Base64URL-encoded JSON. Truncated or malformed tokens can't be parsed." },
];

export default function Page() {
  return (
    <DevFrame slug="jwt-decoder" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
