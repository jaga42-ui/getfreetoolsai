import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "QR Code Generator — Free, No Watermark",
  description:
    "Free QR code generator for URLs, text, Wi-Fi, email and phone. Custom colours, high-res PNG or SVG download, no watermark — made in your browser.",
  keywords:
    "qr code generator, free qr code, qr code maker, wifi qr code generator, url qr code, qr code png svg, custom qr code",
  path: "/dev-tools/qr-code",
});

const Tool = dynamic(() => import("@/components/dev/tools/QrCodeGenerator"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      Generate a QR code for whatever you need to share — a website link, plain
      text, a <strong>Wi-Fi login</strong>, an email address or a phone number.
      Pick the content type and the correct QR format is built for you, including
      the special <code>WIFI:</code> and <code>tel:</code> schemes that phones
      recognise automatically.
    </p>
    <p>
      Tune the size, quiet-zone margin, foreground and background colours, and the
      error-correction level (higher levels stay scannable even if the code is
      partly damaged or has a logo over it). Download a crisp{" "}
      <strong>PNG</strong> for screens or an infinitely-scalable{" "}
      <strong>SVG</strong> for print. Everything is generated locally in your
      browser, so private links and Wi-Fi passwords never leave your device, and
      there is never a watermark.
    </p>
  </>
);

const faqs = [
  {
    q: "Is this QR code generator really free with no watermark?",
    a: "Yes. There's no signup, no limit and nothing is stamped on your code. Download as many as you like as PNG or SVG.",
  },
  {
    q: "Do the QR codes expire?",
    a: "No. These are static QR codes — the content is encoded directly into the image, so they work forever and don't depend on our servers. (We don't offer trackable/dynamic codes precisely because those would require a server redirect.)",
  },
  {
    q: "How do I make a Wi-Fi QR code?",
    a: "Choose the Wi-Fi type, enter your network name (SSID), security type and password. Scanning the code lets a phone join the network without typing the password.",
  },
  {
    q: "PNG or SVG — which should I download?",
    a: "Use PNG for screens, documents and social posts. Use SVG for print or large formats (posters, packaging) because it scales to any size with no blur.",
  },
  {
    q: "What does error correction do?",
    a: "It adds redundancy so the code still scans if it's smudged or partly covered. Higher levels (Q/H) are more robust but make the code denser — useful if you place a logo in the middle.",
  },
  {
    q: "Is my data sent anywhere?",
    a: "No. The QR code is generated entirely in your browser, so even Wi-Fi passwords and private URLs stay on your device.",
  },
];

export default function Page() {
  return (
    <DevFrame slug="qr-code" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
