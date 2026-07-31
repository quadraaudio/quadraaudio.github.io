// ─────────────────────────────────────────────
// Quadra Product Catalog
// Standalone Software: Hydra
// ─────────────────────────────────────────────

export interface ProductFeature {
  title: string;
  description: string;
  mediaClass?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSpecGroup {
  title: string;
  specs: ProductSpec[];
}

export type AvailabilityStatus = "available" | "sold_out" | "coming_soon";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceLabel?: string;
  badge?: string;
  badgeColor?: "orange" | "gray" | "blue" | "red";
  category: "software" | "hardware";
  heroImage?: string;
  cardImage?: string;
  available: boolean;
  availabilityStatus?: AvailabilityStatus;
  features: ProductFeature[];
  specGroups?: ProductSpecGroup[];
  systemRequirements?: string[];
}

export const products: Product[] = [
  {
    slug: "hydra",
    name: "Hydra",
    tagline: "The complete virtual audio patchbay for macOS.",
    description:
      "Hydra is a high-performance virtual audio patchbay for macOS: eight selectable Hydra Audio Bridges (2 to 128 channels each) that any app can pick as input or output, routed freely between apps, hardware, out-of-process VST3 plugins, and network audio — all in one visual Matrix Grid.",
    price: 199.99,
    priceLabel: "$199.99 (90-Day Free Trial)",
    badge: "Virtual Audio Patchbay",
    badgeColor: "orange",
    category: "software",
    heroImage: "/images/hydra_hero_engineer.jpg",
    cardImage: "/images/hydra_app_icon.jpg",
    available: true,
    availabilityStatus: "available",
    features: [
      {
        title: "Eight Hydra Audio Bridges",
        description:
          "2‑A, 2‑B, 4, 8, 16, 32, 64 and 128‑channel virtual soundcards — up to 256 channels of routing headroom — any app can select as its input or output.",
      },
      {
        title: "The Matrix Grid",
        description:
          "A visual cross-point routing matrix. Click a cross-point to connect a transmitter to a receiver; a glowing indicator shows active audio flow.",
      },
      {
        title: "Flux Capture & Process Taps",
        description:
          "Tap any application's audio output continuously via macOS Core Audio process taps — the app keeps playing normally while Hydra gets a copy of the stream.",
      },
      {
        title: "Out-of-Process VST3 Hosting",
        description:
          "Host third-party VST3 plugins in isolated worker processes. If a plugin crashes, your DAW and the Hydra engine keep running.",
      },
      {
        title: "AES67 & NDI Network Audio",
        description:
          "PTP-synced AES67 AoIP streams and NDI audio sources over the local network, subscribed directly into the Matrix Grid.",
      },
      {
        title: "Control Room Monitor",
        description:
          "DIM, MONO, SWAP L/R, MUTE and a dedicated TALKBACK MIC, plus a floating always-on-top Studio HUD for at-a-glance monitor control.",
      },
    ],
    specGroups: [
      {
        title: "Audio Bridges & Routing Engine",
        specs: [
          { label: "Driver Architecture", value: "Native Core Audio AudioServerPlugIn (HAL), SIP-compliant" },
          { label: "Hydra Audio Bridges", value: "8 bridges — 2‑A, 2‑B, 4, 8, 16, 32, 64, 128 channels" },
          { label: "Routing Surface", value: "Cross-point Matrix Grid — apps, hardware, plugins, network" },
          { label: "Hardware Clock Sync", value: "Built-in ASRC drift correction across independent clocks" },
        ],
      },
      {
        title: "Network & Plugin Protocols",
        specs: [
          { label: "Network Audio (AoIP)", value: "AES67 (PTPv2, SAP/SDP) and NDI audio, RX/TX" },
          { label: "Plugin Hosting", value: "Out-of-process VST3 workers with automatic crash recovery" },
          { label: "System Audio Capture", value: "Per-app Core Audio Process Taps (macOS 14.4+ API)" },
          { label: "Remote Control", value: "OSC (Stream Deck via Companion, TouchOSC) and DAW control-surface MIDI (HUI)" },
        ],
      },
      {
        title: "Licensing & Support",
        specs: [
          { label: "License Type", value: "Single Purchase Perpetual License — Lifetime Access" },
          { label: "Security", value: "Quadra Guard 2.0 — HWID-bound Ed25519 offline activation" },
          { label: "Machine Activations", value: "2 simultaneous Mac activations via Quadra ID" },
          { label: "Free Trial", value: "90-day fully functional trial" },
        ],
      },
    ],
    systemRequirements: [
      "macOS 26 (Tahoe) or later",
      "Apple Silicon (M1/M2/M3/M4) or Intel (x86_64)",
      "8 GB RAM minimum (16 GB recommended for high channel counts)",
      "Administrator privileges for one-time HAL driver installation",
    ],
  },
  {
    slug: "hydra-pro",
    name: "Hydra Pro",
    tagline: "Pure spatial audio matrix routing.",
    description: "The premier 128-channel virtual audio router engineered for macOS with multi-stage DSP inserts and remote OSC matrix control.",
    price: 199.99,
    priceLabel: "$199.99",
    badge: "New Software",
    badgeColor: "blue",
    category: "software",
    cardImage: "/images/hydra_app_icon.jpg",
    available: true,
    availabilityStatus: "available",
    features: [
      { title: "128 Channels", description: "Ultra-low latency virtual routing matrix." },
    ],
  },
  {
    slug: "quadra-core-io",
    name: "Quadra Core I/O",
    tagline: "Studio Thunderbolt audio interface.",
    description: "Hardware companion rack for Hydra Pro with 32-bit float AD/DA converters, AES67 AoIP connectivity, and ultra-quiet preamps.",
    price: 0,
    priceLabel: "Coming Soon",
    badge: "Hardware Rack",
    badgeColor: "gray",
    category: "hardware",
    available: false,
    availabilityStatus: "coming_soon",
    features: [
      { title: "32-Bit Float Converters", description: "Pristine dynamic range for professional recording." },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug) || products[0];
}

