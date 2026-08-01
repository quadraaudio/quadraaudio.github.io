/**
 * Quadra Matrix — Start 1.0 marketing content.
 * Media paths under /public/hydra/ are legacy slots (replace with app UI stills when ready).
 * Store SKU slug remains `quadra-matrix` for licensing.
 */
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";

export const HYDRA = {
  name: "MATRIX",
  brandLine: "QUADRA MATRIX",
  version: "1.0",
  edition: "Start",
  platform: "macOS 14+",
  storeSlug: MATRIX_PRODUCT_SLUG,
  storeHref: `/store/${MATRIX_PRODUCT_SLUG}`,
  brandMark: "/matrix/brand-mark.png",
  headline: "Patch. Monitor. Route.",
  lede: "A software patch matrix and control-room monitor for Mac — with Matrix Bridge virtual devices you activate when you need them.",
  ctaPrimary: { href: `/store/${MATRIX_PRODUCT_SLUG}`, label: "Buy MATRIX" },
  ctaSecondary: { href: "/activate", label: "Start trial" },
  heroMedia: {
    src: "/hydra/hero-studio.png",
    alt: "Quadra Matrix — patch field and monitor",
    slot: "hero",
  },
} as const;

/** Preferred export name after product rename. */
export const MATRIX = HYDRA;

export const HYDRA_NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#matrix", label: "Patch" },
  { href: "#bridges", label: "Bridges" },
  { href: "#control", label: "Monitor" },
  { href: "#guard", label: "Guard" },
  { href: "#specs", label: "Tech Specs" },
] as const;

/** Highlight rail under hero — Start 1.0 surfaces only. */
export const HYDRA_HIGHLIGHTS = [
  { href: "#matrix", title: "Patch field", body: "Grid and list. Gainful routes. Scenes A/B/C." },
  { href: "#bridges", title: "Matrix Bridge", body: "2A…128 ch HAL devices. Activate from the app." },
  { href: "#control", title: "Control room", body: "Dim, mono, mute, talkback, cue — real devices." },
  { href: "#guard", title: "Quadra Guard", body: "14-day web trial. Activate with Quadra ID." },
  { href: "#specs", title: "Start 1.0", body: "macOS 14+. Clean-room HAL. SIP on." },
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
    eyebrow: "Patch field",
    title: "Every cross-point. With gain.",
    body: "Route any Tx to any Rx in Grid or List. Paint connections, label channels, and recall scenes A, B, and C.",
    media: {
      src: "/hydra/chapter-matrix.png",
      alt: "Quadra Matrix patch field",
      slot: "chapter-matrix",
    },
    subfeatures: [
      {
        title: "Grid & List",
        body: "Dante-style matrix grid or multi-select Tx/Rx tables — same patch graph.",
      },
      {
        title: "Gainful routes",
        body: "Every connection carries precise gain — not just on or off.",
      },
      {
        title: "Scenes",
        body: "Store and apply whole patch graphs for tracking, mix, or playback.",
      },
    ],
  },
  {
    id: "bridges",
    eyebrow: "Matrix Bridge",
    title: "Virtual devices. Real Core Audio.",
    body: "Matrix Bridge HAL devices appear in Audio MIDI Setup only when you acquire them in Settings — from 2A to 128 channels.",
    media: {
      src: "/hydra/chapter-bridges.png",
      alt: "Matrix Bridge devices",
      slot: "chapter-bridges",
    },
    subfeatures: [
      {
        title: "Bridge catalog",
        body: "2A, 2B, 4, 8, 16, 32, 64, and 128 — pick the width you need.",
      },
      {
        title: "Activate in-app",
        body: "Nothing shows in AMS until you enable a bridge in Quadra Matrix.",
      },
      {
        title: "Clean-room HAL",
        body: "Own driver under SIP. No BlackHole. Manufacturer Quadra.",
      },
    ],
  },
  {
    id: "control",
    eyebrow: "Control room",
    title: "Monitor like a console.",
    body: "Dim, mono, mute, talkback, and cue on your real speakers and headphones — separate from the patch matrix.",
    media: {
      src: "/hydra/chapter-control.png",
      alt: "Quadra Matrix control-room monitor",
      slot: "chapter-control",
    },
    subfeatures: [
      {
        title: "Monitor section",
        body: "L/R meters, volume, Dim, Mono, Mute, Talk, and Cue soft pads.",
      },
      {
        title: "Real I/O",
        body: "Pick speakers, headphones, talk mic, and source — control-room path, not matrix taps alone.",
      },
      {
        title: "Capture taps",
        body: "Main and Cue capture from Matrix Bridge into the room when you need them.",
      },
    ],
  },
  {
    id: "guard",
    eyebrow: "Quadra Guard",
    title: "Authorize on the web. Work offline.",
    body: "Start a 14-day full trial or activate a seat with your Quadra ID. The Mac receives a signed license — same as offline .qkey.",
    media: {
      src: "/hydra/chapter-network.png",
      alt: "Quadra Matrix authorization and studio routing",
      slot: "chapter-guard",
    },
    subfeatures: [
      {
        title: "Web trial",
        body: "One full trial per account and per Mac — started from Authorization in the app.",
      },
      {
        title: "Two seats",
        body: "Bind up to two Macs per license. Manage seats on quadraaudio.com/account.",
      },
      {
        title: "Offline .qkey",
        body: "Import a signed license file when the room has no network.",
      },
    ],
  },
];

export const HYDRA_SPECS = [
  { label: "Edition", value: "Start 1.0" },
  { label: "Platform", value: "macOS 14+" },
  { label: "Architecture", value: "Apple Silicon & Intel" },
  { label: "Bridges", value: "Matrix Bridge 2A…128 (HAL)" },
  { label: "Patch", value: "NxN grid + list · gain · scenes" },
  { label: "Monitor", value: "Dim · mono · mute · talk · cue" },
  { label: "Licensing", value: "Quadra Guard · 14-day trial · 2 seats" },
  { label: "Price", value: "$179 perpetual · $11.90 × 18 RTO" },
] as const;

/** Drop final files into public/hydra/ using these names (1536×1024). */
export const HYDRA_MEDIA_CONTRACT = [
  "hero-studio.png — Overview hero",
  "chapter-matrix.png — Patch field",
  "chapter-bridges.png — Matrix Bridge",
  "chapter-control.png — Control room",
  "chapter-network.png — Guard chapter still",
] as const;
