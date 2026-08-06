/**
 * MATRIX — Start 1.0 marketing content (cinematic product story).
 * Plain-language first; technical depth in chapters/specs.
 * Media under /public/hydra/. Store SKU slug remains `quadra-matrix`.
 */
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";
import { MATRIX_GLOSS, MATRIX_TERMS } from "@/data/brand.messaging";

export const HYDRA = {
  name: "MATRIX",
  brandLine: "MATRIX",
  version: "1.0",
  edition: "Start",
  platform: MATRIX_GLOSS.platform,
  storeSlug: MATRIX_PRODUCT_SLUG,
  storeHref: `/store/${MATRIX_PRODUCT_SLUG}`,
  brandMark: "/matrix/brand-mark.png",
  headline: "Route everything.",
  lede: MATRIX_GLOSS.oneLiner,
  ctaPrimary: { href: `/store/${MATRIX_PRODUCT_SLUG}`, label: "Buy MATRIX" },
  ctaSecondary: { href: "/activate", label: "Start free trial" },
  heroMedia: {
    src: "/hydra/hero-studio.png",
    alt: "MATRIX patch field and monitor",
    slot: "hero",
  },
  closeLede: `Try free for ${MATRIX_GLOSS.trialDays} days on your Mac. Then buy once — $179 perpetual, two seats, yours to keep.`,
} as const;

export const MATRIX = HYDRA;

export const HYDRA_NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#matrix", label: "Patch" },
  { href: "#bridges", label: "Devices" },
  { href: "#control", label: "Monitor" },
  { href: "#guard", label: "License" },
  { href: "#specs", label: "Tech Specs" },
] as const;

/** Capability strip — human labels, not internal codenames. */
export const HYDRA_CAPABILITIES = [
  { href: "#matrix", label: "Patch" },
  { href: "#bridges", label: "Virtual devices" },
  { href: "#control", label: "Monitor" },
  { href: "#guard", label: "License" },
  { href: "#specs", label: "Specs" },
] as const;

/** @deprecated use HYDRA_CAPABILITIES */
export const HYDRA_HIGHLIGHTS = HYDRA_CAPABILITIES.map((c) => ({
  href: c.href,
  title: c.label,
  body: "",
}));

export type HydraMediaSlot = {
  src: string;
  alt: string;
  slot: string;
};

export type HydraSubfeature = {
  title: string;
  body: string;
};

export type HydraChapterLayout = "stage" | "split" | "invert";

export type HydraChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  layout: HydraChapterLayout;
  media: HydraMediaSlot;
  subfeatures: HydraSubfeature[];
};

export const HYDRA_CHAPTERS: HydraChapter[] = [
  {
    id: "matrix",
    eyebrow: "Patch field",
    title: "See every connection.\nChange any level.",
    body: `${MATRIX_TERMS.patchField} Connect any source to any destination, set gain on each route, and save scenes for the next session.`,
    layout: "stage",
    media: {
      src: "/hydra/chapter-matrix.png",
      alt: "MATRIX patch field",
      slot: "chapter-matrix",
    },
    subfeatures: [
      {
        title: "Grid & List",
        body: "Work in a visual cross-point grid or channel lists — same routing underneath.",
      },
      {
        title: "Gain on every route",
        body: "Each connection has level control — not just on or off.",
      },
      {
        title: "Scenes",
        body: MATRIX_TERMS.scenes,
      },
    ],
  },
  {
    id: "bridges",
    eyebrow: "Virtual devices",
    title: "Soundcards that\nappear when needed.",
    body: `${MATRIX_TERMS.matrixBridge} Pick the channel width for each app — from stereo up to 128.`,
    layout: "split",
    media: {
      src: "/hydra/chapter-bridges.png",
      alt: "Matrix Bridge devices on the MATRIX grid",
      slot: "chapter-bridges",
    },
    subfeatures: [
      {
        title: "2A through 128",
        body: "Eight bridge sizes so each DAW or utility gets only the channels it needs.",
      },
      {
        title: "On demand",
        body: "Nothing appears in Audio MIDI Setup until you enable a bridge in MATRIX.",
      },
      {
        title: "Quadra HAL",
        body: "Our own Core Audio driver — not a third-party loopback hack.",
      },
    ],
  },
  {
    id: "control",
    eyebrow: "Monitor",
    title: "Hear the room\nlike a console.",
    body: MATRIX_TERMS.controlRoom,
    layout: "invert",
    media: {
      src: "/hydra/chapter-control.png",
      alt: "MATRIX control-room monitor",
      slot: "chapter-control",
    },
    subfeatures: [
      {
        title: "Monitor section",
        body: "Volume, meters, Dim, Mono, Mute, Talk, and Cue — the controls you expect on a console.",
      },
      {
        title: "Real speakers & headphones",
        body: "Drive your actual outputs for the room, separate from how apps are patched.",
      },
      {
        title: "Cue when you need it",
        body: "Feed Main or Cue from the matrix into the monitor path for tracking and playback.",
      },
    ],
  },
  {
    id: "guard",
    eyebrow: "License",
    title: "Authorize once.\nWork offline.",
    body: MATRIX_TERMS.quadraGuard,
    layout: "stage",
    media: {
      src: "/hydra/chapter-network.png",
      alt: "MATRIX authorization",
      slot: "chapter-guard",
    },
    subfeatures: [
      {
        title: `${MATRIX_GLOSS.trialDays}-day trial`,
        body: "One full trial per account and per Mac — started from Authorization in the app.",
      },
      {
        title: "Two seats",
        body: "Bind up to two Macs per license. Move seats from your Quadra account.",
      },
      {
        title: "Offline when needed",
        body: "Import a signed license file (.qkey) when the room has no network.",
      },
    ],
  },
];

export const HYDRA_SPECS = [
  { label: "Edition", value: "Start 1.0" },
  { label: "Platform", value: MATRIX_GLOSS.platform },
  { label: "Architecture", value: "Apple Silicon & Intel" },
  { label: "Virtual devices", value: "Matrix Bridge 2A…128 (Core Audio)" },
  { label: "Patch", value: "Grid + list · gain · scenes" },
  { label: "Monitor", value: "Dim · mono · mute · talk · cue" },
  {
    label: "Licensing",
    value: `Quadra Guard · ${MATRIX_GLOSS.trialDays}-day trial · 2 seats`,
  },
  {
    label: "Price",
    value: "$179 perpetual · updates 12 mo · $11.90 × 18 RTO",
  },
] as const;

export const HYDRA_MEDIA_CONTRACT = [
  "hero-studio.png — Overview hero",
  "chapter-matrix.png — Patch field",
  "chapter-bridges.png — Matrix Bridge",
  "chapter-control.png — Control room",
  "chapter-network.png — Guard chapter still",
] as const;
