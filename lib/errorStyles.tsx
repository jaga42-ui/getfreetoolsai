import type { ReactNode } from "react";

/**
 * Per-OS variants of the fake error dialog (/fun/fake-error/windows-xp, …).
 *
 * Why these exist as separate pages: /fun/fake-error is the site's only page
 * that reached page one, and it is currently absorbing ~25 distinct query
 * variants on its own — "windows 10 error message generator" ranks 13 with no
 * dedicated page behind it. Each version is a genuinely different artefact
 * (Luna vs Aero vs Fluent chrome is not a skin, it is what the searcher is
 * actually looking for), so each gets its own renderer preset and its own
 * copy rather than a templated doorway.
 *
 * These are deliberately NOT entries in `funTools`. The contextual link graph
 * in lib/tools.ts allocates exactly four related links per tool, and adding six
 * near-identical siblings there would dilute it — the same failure mode the
 * August link-distribution fix corrected. They cross-link to each other and up
 * to the hub instead, mirroring how `sizePresets` handles /pdf/compress/*.
 */

/** Canvas chrome spec — everything the renderer needs to draw one era's dialog. */
export type ErrorChrome = {
  /** "win": icon left, message right, buttons bottom-right. "mac": centred stack. */
  layout: "win" | "mac";
  width: number;
  radius: number;
  body: string;
  border: string;
  /** Desktop colour behind the dialog in the on-page preview. */
  desktop: string;
  titleBar: {
    height: number;
    from: string;
    to: string;
    text: string;
    bold: boolean;
  } | null;
  close: "win-red" | "win-dark" | "xp" | "bevel" | "none";
  font: string;
  titleFontPx: number;
  bodyFontPx: number;
  bodyText: string;
  button: {
    style: "flat" | "aero" | "bevel" | "mac";
    fill: string;
    border: string;
    text: string;
    accentFill: string;
    accentBorder: string;
    accentText: string;
    radius: number;
    height: number;
    minWidth: number;
  };
  icon: "modern" | "classic";
};

export type ErrorStyle = {
  slug: string;
  /** Short label for the cross-link chips and the hub grid. */
  label: string;
  /** Era, shown under the label on the hub. */
  era: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  intro: ReactNode;
  uses: string[];
  faqs: { q: string; a: string }[];
  /** Seed values for the generator, era-appropriate. */
  defaults: { title: string; message: string; buttons: string };
  chrome: ErrorChrome;
};

/* ------------------------------------------------------------------ chrome */

const winButton = (
  over: Partial<ErrorChrome["button"]> = {}
): ErrorChrome["button"] => ({
  style: "flat",
  fill: "#fdfdfd",
  border: "#adadad",
  text: "#1a1a1a",
  accentFill: "#e5f1fb",
  accentBorder: "#0078d7",
  accentText: "#1a1a1a",
  radius: 0,
  height: 26,
  minWidth: 75,
  ...over,
});

const win11: ErrorChrome = {
  layout: "win",
  width: 440,
  radius: 8,
  body: "#f3f3f3",
  border: "#d9d9d9",
  desktop: "#0a3d62",
  titleBar: { height: 34, from: "#f3f3f3", to: "#f3f3f3", text: "#1a1a1a", bold: false },
  close: "win-dark",
  font: "Segoe UI Variable, Segoe UI, Arial",
  titleFontPx: 13,
  bodyFontPx: 13,
  bodyText: "#1a1a1a",
  button: winButton({
    radius: 4,
    height: 30,
    minWidth: 96,
    fill: "#fbfbfb",
    border: "#d1d1d1",
    accentFill: "#0067c0",
    accentBorder: "#0067c0",
    accentText: "#ffffff",
  }),
  icon: "modern",
};

const win10: ErrorChrome = {
  layout: "win",
  width: 440,
  radius: 0,
  body: "#f0f0f0",
  border: "#b4b4b4",
  desktop: "#0a3d62",
  titleBar: { height: 32, from: "#ffffff", to: "#ffffff", text: "#1a1a1a", bold: false },
  close: "win-red",
  font: "Segoe UI, Arial",
  titleFontPx: 13,
  bodyFontPx: 13,
  bodyText: "#1a1a1a",
  button: winButton(),
  icon: "modern",
};

const win7: ErrorChrome = {
  layout: "win",
  width: 440,
  radius: 7,
  body: "#f0f0f0",
  border: "#9bb7cd",
  desktop: "#1b4b6b",
  titleBar: { height: 34, from: "#f5fbff", to: "#d3e9fb", text: "#0b3d63", bold: false },
  close: "xp",
  font: "Segoe UI, Arial",
  titleFontPx: 13,
  bodyFontPx: 13,
  bodyText: "#1a1a1a",
  button: winButton({
    radius: 3,
    height: 27,
    fill: "#f2f6f9",
    border: "#8894a0",
    accentFill: "#e3f1fb",
    accentBorder: "#3c7fb1",
  }),
  icon: "modern",
};

const winxp: ErrorChrome = {
  layout: "win",
  width: 420,
  radius: 8,
  body: "#ece9d8",
  border: "#0831d9",
  desktop: "#3a6ea5",
  titleBar: { height: 30, from: "#0058ee", to: "#3a93ff", text: "#ffffff", bold: true },
  close: "xp",
  font: "Tahoma, Verdana, Arial",
  titleFontPx: 12.5,
  bodyFontPx: 12,
  bodyText: "#000000",
  button: winButton({
    radius: 3,
    height: 24,
    minWidth: 76,
    fill: "#ece9d8",
    border: "#7f9db9",
    accentFill: "#ece9d8",
    accentBorder: "#316ac5",
  }),
  icon: "classic",
};

const win98: ErrorChrome = {
  layout: "win",
  width: 400,
  radius: 0,
  body: "#c0c0c0",
  border: "#000000",
  desktop: "#008080",
  titleBar: { height: 26, from: "#000080", to: "#1084d0", text: "#ffffff", bold: true },
  close: "bevel",
  font: "MS Sans Serif, Tahoma, Arial",
  titleFontPx: 12,
  bodyFontPx: 12,
  bodyText: "#000000",
  button: winButton({
    style: "bevel",
    height: 23,
    minWidth: 75,
    fill: "#c0c0c0",
    border: "#000000",
    accentFill: "#c0c0c0",
    accentBorder: "#000000",
  }),
  icon: "classic",
};

const macos: ErrorChrome = {
  layout: "mac",
  width: 320,
  radius: 12,
  body: "#ececec",
  border: "#c9c9c9",
  desktop: "#2c2c34",
  titleBar: null,
  close: "none",
  font: "-apple-system, Helvetica Neue, Helvetica, Arial",
  titleFontPx: 13.5,
  bodyFontPx: 11.5,
  bodyText: "#1d1d1f",
  button: {
    style: "mac",
    fill: "#fdfdfd",
    border: "#c6c6c6",
    text: "#1d1d1f",
    accentFill: "#0a64f0",
    accentBorder: "#0a64f0",
    accentText: "#ffffff",
    radius: 6,
    height: 22,
    minWidth: 90,
  },
  icon: "modern",
};

/* ----------------------------------------------------------------- content */

export const errorStyles: ErrorStyle[] = [
  {
    slug: "windows-11",
    label: "Windows 11",
    era: "2021 · Fluent",
    title: "Windows 11 Error Message Generator — Free PNG",
    h1: "Windows 11 Error Message Generator",
    description:
      "Make a custom Windows 11 error popup with rounded Fluent chrome, your own text and buttons. Downloads as a PNG. Free, no signup, runs in your browser.",
    keywords:
      "windows 11 error message generator, windows 11 error popup, fake windows 11 error, win11 dialog generator",
    intro: (
      <>
        <p>
          Windows 11 redrew the classic dialog: rounded corners, a flat
          title bar with no gradient, a solid accent-blue default button and the
          Segoe UI Variable typeface. This generator reproduces that Fluent
          chrome exactly, so a screenshot reads as a current-build Windows box
          rather than a decade-old one.
        </p>
        <p>
          Type your own title, message and buttons, pick an icon, and download
          the result as a PNG. Nothing is uploaded — the dialog is drawn on a
          canvas on your own device.
        </p>
      </>
    ),
    uses: [
      "Memes and joke screenshots that need to look like a current Windows build",
      "UI mockups and slide decks that need a placeholder dialog",
      "Bug-report illustrations where the real error can't be reproduced",
    ],
    faqs: [
      { q: "How do I make a fake Windows 11 error message?", a: "Type your title bar text and message, choose an icon and the buttons you want, then click Download PNG. The dialog is drawn with Windows 11's rounded corners and accent-filled default button." },
      { q: "Why does this look different from the Windows 10 generator?", a: "Windows 11 uses rounded corners, a flat title bar and a solid blue default button. Windows 10 uses square corners and an outlined default button. Each generator draws its own era's chrome." },
      { q: "Is this a real error?", a: "No. It is a cosmetic image you create — nothing is wrong with your computer and no system dialog is triggered." },
      { q: "Is anything uploaded?", a: "No. The image is drawn in your browser and never leaves your device." },
    ],
    defaults: {
      title: "Error",
      message:
        "This app can't run on your PC.\n\nTo find a version for your PC, check with the software publisher.",
      buttons: "Close",
    },
    chrome: win11,
  },
  {
    slug: "windows-10",
    label: "Windows 10",
    era: "2015 · Metro",
    title: "Windows 10 Error Message Generator — Free PNG",
    h1: "Windows 10 Error Message Generator",
    description:
      "Make a custom Windows 10 error popup with your own title, message, icon and buttons. Downloads as a PNG. Free, no signup, runs in your browser.",
    keywords:
      "windows 10 error message generator, windows 10 error popup generator, fake windows 10 error, win10 error maker",
    intro: (
      <>
        <p>
          The Windows 10 dialog is the one most people picture when they think
          &ldquo;Windows error&rdquo;: square corners, a plain white title bar,
          a red close button and a flat default button outlined in accent blue.
          This generator draws that chrome precisely.
        </p>
        <p>
          Set the title bar text, the message body, the icon and any number of
          buttons, then download a PNG. Everything runs on your device.
        </p>
      </>
    ),
    uses: [
      "Meme screenshots and harmless desktop pranks",
      "Documentation and tutorials that need an illustrative error",
      "Design mockups where a realistic system dialog is needed",
    ],
    faqs: [
      { q: "How do I make a fake Windows 10 error message?", a: "Enter your title and message, pick an icon and buttons, then click Download PNG. The result is a square-cornered Windows 10 dialog with a red close button." },
      { q: "Can I add a custom error code?", a: "Yes. The message box accepts multiple lines, so you can add something like \"Error code: 0x8007000E\" on its own line beneath the main text." },
      { q: "Is this a real error?", a: "No. It is purely cosmetic — nothing is wrong with your computer and nothing is triggered on your system." },
      { q: "Is anything uploaded?", a: "No. The dialog is drawn in your browser and never leaves your device." },
    ],
    defaults: {
      title: "Error",
      message:
        "A fatal error has occurred and the operation could not be completed.\n\nError code: 0x000000FF",
      buttons: "OK, Cancel",
    },
    chrome: win10,
  },
  {
    slug: "windows-7",
    label: "Windows 7",
    era: "2009 · Aero",
    title: "Windows 7 Error Message Generator — Aero Popup",
    h1: "Windows 7 Error Message Generator",
    description:
      "Make a custom Windows 7 Aero error popup with your own title, message and buttons. Downloads as a PNG. Free, no signup, runs in your browser.",
    keywords:
      "windows 7 error message generator, aero error popup, fake windows 7 error, win7 dialog generator",
    intro: (
      <>
        <p>
          Windows 7&rsquo;s Aero dialogs used a pale blue glass title bar, softly
          rounded corners and gradient buttons with a blue focus glow. It is a
          distinctive look, and a Windows 10 or 11 screenshot will not pass for
          it — so this version draws real Aero chrome.
        </p>
        <p>
          Useful for anything set in the 2009–2014 era, or for nostalgia memes
          where the exact vintage is the joke.
        </p>
      </>
    ),
    uses: [
      "Nostalgia memes where the Windows version is the punchline",
      "Screenshots for articles about older software",
      "Retro UI mockups and presentations",
    ],
    faqs: [
      { q: "How do I make a fake Windows 7 error message?", a: "Type your title and message, choose an icon and buttons, then click Download PNG. The dialog is drawn with the Aero glass title bar and rounded gradient buttons." },
      { q: "What is Aero?", a: "Aero was the Windows Vista and Windows 7 visual style, characterised by translucent glass window frames, soft gradients and rounded corners. Windows 8 replaced it with a flat design." },
      { q: "Is this a real error?", a: "No. It is a cosmetic image only — nothing on your computer is affected." },
      { q: "Is anything uploaded?", a: "No. Everything is drawn in your browser." },
    ],
    defaults: {
      title: "Windows Explorer",
      message:
        "Windows Explorer has stopped working.\n\nWindows is checking for a solution to the problem…",
      buttons: "OK, Cancel",
    },
    chrome: win7,
  },
  {
    slug: "windows-xp",
    label: "Windows XP",
    era: "2001 · Luna",
    title: "Windows XP Error Message Generator — Free PNG",
    h1: "Windows XP Error Message Generator",
    description:
      "Make a custom Windows XP error popup in the classic Luna blue style, with your own text and buttons. Downloads as a PNG. Free and runs in your browser.",
    keywords:
      "windows xp error message generator, xp error popup, fake windows xp error, luna error dialog, retro windows error",
    intro: (
      <>
        <p>
          The Windows XP dialog — the Luna blue title bar, the beige{" "}
          <code>#ECE9D8</code> body and Tahoma text — is the single most
          recognisable error box ever shipped, and the one most meme templates
          are built on. This generator draws it faithfully, down to the rounded
          top corners and the round red close button.
        </p>
        <p>
          Type whatever you like into it and download a PNG. Nothing is
          uploaded.
        </p>
      </>
    ),
    uses: [
      "Retro and nostalgia memes — the classic error-box template",
      "Screenshots for articles about legacy software",
      "Y2K-aesthetic design work and thumbnails",
    ],
    faqs: [
      { q: "How do I make a fake Windows XP error message?", a: "Enter your title bar text and message, pick an icon and buttons, then click Download PNG. The dialog is drawn in the XP Luna style with the blue gradient title bar and beige body." },
      { q: "Why is the XP one so popular for memes?", a: "XP shipped for over a decade and its dialog is instantly recognisable, so it reads as \"a computer error\" to almost anyone without needing explanation." },
      { q: "Is this a real error?", a: "No. It is a cosmetic image you create — nothing on your computer is affected." },
      { q: "Is anything uploaded?", a: "No. The image is generated entirely in your browser." },
    ],
    defaults: {
      title: "Error",
      message:
        "This program has performed an illegal operation and will be shut down.\n\nIf the problem persists, contact the program vendor.",
      buttons: "OK, Cancel",
    },
    chrome: winxp,
  },
  {
    slug: "windows-98",
    label: "Windows 98",
    era: "1998 · Classic",
    title: "Windows 98 Error Message Generator — Retro PNG",
    h1: "Windows 98 Error Message Generator",
    description:
      "Make a custom Windows 98 error popup with the classic grey bevel and navy title bar. Downloads as a PNG. Free, no signup, runs in your browser.",
    keywords:
      "windows 98 error message generator, windows 95 error generator, retro error popup, classic windows error maker",
    intro: (
      <>
        <p>
          Windows 95 and 98 shared the same dialog: a flat navy title bar, a grey{" "}
          <code>#C0C0C0</code> body and buttons drawn with a hard 3D bevel — two
          light edges, two dark. It is the look every &ldquo;retro computing&rdquo;
          meme reaches for, and it needs the bevel to be right or it reads as a
          modern box in grey.
        </p>
        <p>
          This generator draws real bevelled chrome and the era&rsquo;s square
          icons.
        </p>
      </>
    ),
    uses: [
      "Retro computing memes and vaporwave visuals",
      "Game and app UI mockups in a 90s style",
      "Illustrations for articles about early Windows",
    ],
    faqs: [
      { q: "How do I make a fake Windows 98 error message?", a: "Type your title and message, choose an icon and buttons, then click Download PNG. The dialog is drawn with the classic grey bevel and navy title bar." },
      { q: "Does this work for Windows 95 too?", a: "Yes. Windows 95, 98 and ME used essentially the same dialog chrome, so the same generator covers all three." },
      { q: "Is this a real error?", a: "No. It is purely a cosmetic image." },
      { q: "Is anything uploaded?", a: "No. Everything is drawn on your device." },
    ],
    defaults: {
      title: "Error",
      message:
        "This program has performed an illegal operation and will be terminated.",
      buttons: "OK, Details",
    },
    chrome: win98,
  },
  {
    slug: "macos",
    label: "macOS",
    era: "Aqua · alert",
    title: "Mac Error Message Generator — macOS Alert Maker",
    h1: "Mac Error Message Generator",
    description:
      "Make a custom macOS error alert with your own text and buttons — centred icon, rounded corners, blue default button. Downloads as a PNG, free.",
    keywords:
      "mac error message generator, macos alert generator, fake mac error, apple error popup maker, osx error generator",
    intro: (
      <>
        <p>
          A macOS alert is laid out completely differently from a Windows
          dialog: there is no title bar, the icon sits centred at the top, the
          headline is bold and centred above smaller body text, and the buttons
          sit centred at the bottom with the default one filled in blue.
        </p>
        <p>
          Getting that layout right is the whole point — a Windows dialog recoloured
          grey does not read as a Mac. This generator uses the real Aqua alert
          geometry.
        </p>
      </>
    ),
    uses: [
      "Memes and screenshots aimed at Mac users",
      "App UI mockups and App Store screenshots",
      "Design work that needs a believable macOS alert",
    ],
    faqs: [
      { q: "How do I make a fake Mac error message?", a: "Type your headline and message, choose an icon and buttons, then click Download PNG. The alert is drawn with macOS's centred layout and blue default button." },
      { q: "Why does it have no title bar?", a: "macOS alerts genuinely have no title bar — the icon and bold headline sit at the top instead. That layout difference is the main thing that makes a Mac alert read as a Mac alert." },
      { q: "Is this a real error?", a: "No. It is a cosmetic image only; nothing on your computer is affected." },
      { q: "Is anything uploaded?", a: "No. The alert is drawn in your browser and never leaves your device." },
    ],
    defaults: {
      title: "The application quit unexpectedly.",
      message:
        "Click Reopen to open the application again. Click Report to see more details or send a report to Apple.",
      buttons: "Reopen, Report…, OK",
    },
    chrome: macos,
  },
];

export function getErrorStyle(slug: string): ErrorStyle | undefined {
  return errorStyles.find((s) => s.slug === slug);
}
