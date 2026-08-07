/**
 * Canonical Quadra / MATRIX marketing voice.
 * Plain-language first; technical detail only after the visitor understands the value.
 */
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";

export const QUADRA_BRAND = {
  name: "Quadra",
  /** One-line company purpose for strangers. */
  purpose: "Professional audio software for Mac.",
  /** Slightly longer brand story. */
  story:
    "Quadra builds tools that stay installed for years — clear licensing, Mac-native craft, and software that respects the session.",
  /** Honest catalog framing while MATRIX is the only SKU. */
  catalogNote: "Starting with MATRIX.",
  tagline: "Professional audio software for Mac studios.",
} as const;

export const MATRIX_GLOSS = {
  /** One sentence a stranger can understand. */
  oneLiner:
    "MATRIX is a software patchbay and monitor controller for Mac — connect apps, interfaces, and speakers without extra boxes.",
  /** Problem → solution for PDPs and teasers. */
  problem:
    "On a Mac studio, routing between DAWs, plugins, interfaces, and monitors usually means juggling virtual cables, extra apps, or hardware.",
  solution:
    "MATRIX gives you one visual patch field, virtual Core Audio bridges you turn on only when you need them, and a proper control-room monitor section.",
  who: "Built for producers, engineers, and rooms that work on Mac.",
  priceLine: "$179 perpetual · 14-day full trial · 2 Mac seats",
  platform: "macOS 14+",
  trialDays: 14,
} as const;

/** Short glosses for technical terms used in product copy. */
export const MATRIX_TERMS = {
  patchField:
    "A visual board where you connect any source to any destination — like a hardware patchbay, on screen.",
  matrixBridge:
    "Virtual soundcards that appear in Audio MIDI Setup only when you enable them in MATRIX (from stereo up to 128 channels).",
  controlRoom:
    "Speaker and headphone volume, dim, mute, talkback, and cue — separate from how you patch apps together.",
  quadraGuard:
    "Sign in with your Quadra ID, try free for 14 days, then activate this Mac. Work offline after that.",
  scenes: "Saved routing layouts you can recall for tracking, mix, or playback.",
} as const;

export const QUADRA_CTAS = {
  exploreMatrix: {
    href: "/products/matrix",
    label: "Explore MATRIX",
  },
  buyMatrix: {
    href: `/store/${MATRIX_PRODUCT_SLUG}`,
    label: "Buy MATRIX",
  },
  startTrial: {
    href: "/activate",
    label: "Start free trial",
  },
  store: {
    href: "/store",
    label: "Open store",
  },
  account: {
    href: "/account",
    label: "Account",
  },
  /** Installer builds — linked from footer + account, not main nav. */
  releases: {
    href: "/releases",
    label: "Downloads",
  },
} as const;

export const HOME_COPY = {
  brandSignal: "QUADRA",
  headline: "Audio software that earns its place in the studio.",
  lede: `${QUADRA_BRAND.purpose} ${QUADRA_BRAND.catalogNote} ${MATRIX_GLOSS.oneLiner}`,
  matrixBlock: {
    eyebrow: "Featured product",
    brand: "MATRIX",
    title: "Route your Mac studio from one place.",
    body: MATRIX_GLOSS.oneLiner,
    detail: MATRIX_GLOSS.solution,
  },
  why: [
    {
      title: "You own the license",
      body: "Buy once, activate with your Quadra ID, and keep working offline after authorization.",
    },
    {
      title: "Built for Mac sessions",
      body: "Native Core Audio bridges and a monitor section designed for real tracking and mix rooms — not demo toys.",
    },
    {
      title: "Try before you buy",
      body: `A full ${MATRIX_GLOSS.trialDays}-day trial on your Mac. Same workflow as the paid seat.`,
    },
  ],
  sessions: [
    {
      title: "Route apps and interfaces",
      body: "Patch DAWs, utility apps, and hardware through one visual matrix instead of a pile of virtual cables.",
    },
    {
      title: "Monitor like a console",
      body: "Dim, mute, talkback, and cue on your real speakers and headphones — without fighting the patch.",
    },
    {
      title: "Bring devices online on demand",
      body: "Enable Matrix Bridge virtual soundcards only when the session needs them. Hide them when it does not.",
    },
  ],
  storeClose: {
    eyebrow: "Quadra Store",
    title: "Own MATRIX.",
    lede: `${MATRIX_GLOSS.priceLine}. Checkout with Google and PayPal.`,
  },
} as const;
