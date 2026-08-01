/**
 * MATRIX marketing content — Apple product-page rhythm.
 * Media paths under /public/hydra/ are replaceable slots (legacy asset folder).
 * Store SKU slug remains `quadra-matrix` for licensing compatibility.
 */
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";

export const HYDRA = {
  name: "MATRIX",
  version: "2.1.19",
  platform: "macOS 26.0+",
  sourceUrl: "https://github.com/quadraaudio/hydra",
  storeSlug: MATRIX_PRODUCT_SLUG,
  storeHref: `/store/${MATRIX_PRODUCT_SLUG}`,
  /** Hero product line — short, like Apple. */
  headline: "Route everything.",
  lede: "A virtual hub, public bridges, and a gainful patchbay for the Mac studio.",
  ctaPrimary: { href: `/store/${MATRIX_PRODUCT_SLUG}`, label: "Buy MATRIX" },
  ctaSecondary: { href: "/support", label: "License & support" },
  heroMedia: {
    src: "/hydra/hero-studio.png",
    alt: "MATRIX hero — replace with product UI or campaign still",
    slot: "hero",
  },
} as const;

/** Preferred export name after product rename. */
export const MATRIX = HYDRA;

export const HYDRA_NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#matrix", label: "Matrix" },
  { href: "#bridges", label: "Bridges" },
  { href: "#network", label: "Network" },
  { href: "#strips", label: "Strips" },
  { href: "#control", label: "Control" },
  { href: "#specs", label: "Tech Specs" },
] as const;

/** Top highlight rail under hero — Apple “feature chips” pattern. */
export const HYDRA_HIGHLIGHTS = [
  { href: "#matrix", title: "Patch matrix", body: "Gainful cross-points and scenes." },
  { href: "#bridges", title: "Engine & bridges", body: "256-ch hub. Public I/O devices." },
  { href: "#network", title: "Capture & network", body: "Devices, apps, AES67, NDI." },
  { href: "#strips", title: "Channel strips", body: "VST3 inserts. Isolated host." },
  { href: "#control", title: "Control room", body: "Dim, mono, mute, talkback." },
  { href: "#specs", title: "Built for Mac", body: "macOS 26.0+. Version 2.1.19." },
] as const;

export type HydraMediaSlot = {
  src: string;
  alt: string;
  /** Filename contract for replacement assets. */
  slot: string;
};

export type HydraSubfeature = {
  title: string;
  body: string;
};

export type HydraChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  media: HydraMediaSlot;
  subfeatures: HydraSubfeature[];
};

export const HYDRA_CHAPTERS: HydraChapter[] = [
  {
    id: "matrix",
    eyebrow: "Patch matrix",
    title: "Every cross-point. With gain.",
    body: "Connect any source to any destination. Label channels. Save scenes. Recall the room exactly as you left it.",
    media: {
      src: "/hydra/chapter-matrix.png",
      alt: "MATRIX patch matrix — replace with real UI",
      slot: "chapter-matrix",
    },
    subfeatures: [
      {
        title: "Gainful routes",
        body: "Every connection carries precise gain — not just on or off.",
      },
      {
        title: "Scenes",
        body: "Store and apply whole patch graphs for tracking, mix, or playback.",
      },
      {
        title: "Labels",
        body: "Name channels so complex rooms stay readable across sessions.",
      },
    ],
  },
  {
    id: "bridges",
    eyebrow: "Engine & bridges",
    title: "A hidden hub. Public bridges.",
    body: "MATRIX Engine is a 256-channel CoreAudio hub. Bridge devices from 2 to 128 channels appear as ordinary interfaces to every DAW.",
    media: {
      src: "/hydra/chapter-bridges.png",
      alt: "MATRIX bridges — replace with real UI",
      slot: "chapter-bridges",
    },
    subfeatures: [
      {
        title: "MATRIX Engine",
        body: "A hidden 256-channel backplane your DAWs never have to manage.",
      },
      {
        title: "Bridge catalog",
        body: "2A, 2B, 4, 8, 16, 32, 64, and 128 — pick the width you need.",
      },
      {
        title: "Standard CoreAudio",
        body: "No custom driver gymnastics in the session. Just devices.",
      },
    ],
  },
  {
    id: "network",
    eyebrow: "Capture & network",
    title: "Local. Apps. Streams.",
    body: "Hardware, process taps, AES67, and NDI share one matrix — sources and destinations in the same patch surface.",
    media: {
      src: "/hydra/chapter-network.png",
      alt: "MATRIX network routing — replace with real UI",
      slot: "chapter-network",
    },
    subfeatures: [
      {
        title: "Devices & apps",
        body: "CoreAudio hardware and running-app capture into the same graph.",
      },
      {
        title: "AES67",
        body: "Discover and subscribe via SAP/SDP. Send when you need to.",
      },
      {
        title: "NDI",
        body: "Receive and transmit through a runtime shim — no proprietary link required at build time.",
      },
    ],
  },
  {
    id: "strips",
    eyebrow: "Channel strips",
    title: "Inserts that stay out of the way.",
    body: "Build strips with VST3. Run in-process, or isolate chains so a bad plugin cannot take down the session.",
    media: {
      src: "/hydra/chapter-control.png",
      alt: "MATRIX channel strips — replace with real UI",
      slot: "chapter-strips",
    },
    subfeatures: [
      {
        title: "VST3 inserts",
        body: "Put processing on the route, not only in the DAW.",
      },
      {
        title: "Out-of-process host",
        body: "hydra-plugin-host keeps unstable plugins off the engine thread.",
      },
      {
        title: "Safe scanning",
        body: "Bundle scans run in an isolated worker before they ever touch the room.",
      },
    ],
  },
  {
    id: "control",
    eyebrow: "Control room",
    title: "Monitor like a console.",
    body: "Dim, mono, swap, master mute, and talkback — with monitor and talkback device routing in the engine.",
    media: {
      src: "/hydra/hero-studio.png",
      alt: "MATRIX control room — replace with real UI",
      slot: "chapter-control",
    },
    subfeatures: [
      {
        title: "Monitor section",
        body: "Dim and talkback ducking in dB. Mono and L-R swap when you need them.",
      },
      {
        title: "Talkback",
        body: "Route talkback to the right device without leaving the matrix.",
      },
      {
        title: "Master mute",
        body: "One control when the room needs silence — instantly.",
      },
    ],
  },
];

export const HYDRA_SPECS = [
  { label: "Version", value: "2.1.19" },
  { label: "Platform", value: "macOS 26.0+" },
  { label: "Hub", value: "MATRIX Engine · 256 channels" },
  { label: "Bridges", value: "2A, 2B, 4, 8, 16, 32, 64, 128" },
  { label: "Formats", value: "CoreAudio HAL · VST3 inserts" },
  { label: "Network", value: "AES67 · NDI" },
  { label: "Licensing", value: "Hardware-bound activation" },
  { label: "Control", value: "Local WebSocket on loopback" },
] as const;

/** Drop final files into public/hydra/ using these names. */
export const HYDRA_MEDIA_CONTRACT = [
  "hero-studio.png|mp4 — Overview hero",
  "chapter-matrix.png|mp4 — Patch matrix",
  "chapter-bridges.png|mp4 — Engine & bridges",
  "chapter-network.png|mp4 — Capture & network",
  "chapter-strips.png|mp4 — Channel strips (currently chapter-control.png)",
  "chapter-control.png|mp4 — Control room",
] as const;
