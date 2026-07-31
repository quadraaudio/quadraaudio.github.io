export type AvailabilityStatus = "available" | "sold_out" | "coming_soon";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  category: "software" | "bundle";
  badge?: string;
  availabilityStatus: AvailabilityStatus;
  features: { title: string; description: string }[];
  systemRequirements: string[];
  cardGradient: string;
}

/** Placeholder catalog — generic Quadra software SKUs (no product-line spoilers). */
export const PRODUCTS_SEED: Product[] = [
  {
    slug: "quadra-channel",
    name: "Quadra Channel",
    tagline: "A modern channel strip for demanding sessions.",
    description:
      "EQ, dynamics, and saturation shaped for pro tracking and mix buses. Low-latency processing with recall-safe presets for studio and live workflows.",
    price: 149.0,
    currency: "USD",
    category: "software",
    badge: "Channel Strip",
    availabilityStatus: "available",
    features: [
      {
        title: "Precision EQ",
        description: "Musical curves with surgical mid-band focus and shelf air.",
      },
      {
        title: "Adaptive Dynamics",
        description: "Compressor and gate tuned for vocals, buses, and aggressive sources.",
      },
      {
        title: "Recall Safe",
        description: "Session presets that travel cleanly across machines and DAWs.",
      },
    ],
    systemRequirements: [
      "macOS 13+ or Windows 10+",
      "VST3 / AU / AAX",
      "8 GB RAM recommended",
    ],
    cardGradient: "linear-gradient(145deg, #0e1218 0%, #1c4f4d 55%, #00a3a0 120%)",
  },
  {
    slug: "quadra-dynamics",
    name: "Quadra Dynamics",
    tagline: "Compression and transient control with studio polish.",
    description:
      "A focused dynamics suite for mix engineers who need transparent leveling and character on demand — from invisible glue to punchy transient shaping.",
    price: 129.0,
    currency: "USD",
    category: "software",
    badge: "Dynamics",
    availabilityStatus: "available",
    features: [
      {
        title: "Dual Character",
        description: "Clean digital path or warmer transformer-inspired color.",
      },
      {
        title: "Transient Designer",
        description: "Shape attack and sustain without wrecking the bus.",
      },
      {
        title: "Sidechain Tools",
        description: "Flexible detection filters for modern mix moves.",
      },
    ],
    systemRequirements: [
      "macOS 13+ or Windows 10+",
      "VST3 / AU / AAX",
      "8 GB RAM recommended",
    ],
    cardGradient: "linear-gradient(145deg, #121820 0%, #2a3a55 50%, #e8a54b 130%)",
  },
  {
    slug: "quadra-studio-bundle",
    name: "Quadra Studio Bundle",
    tagline: "Core tools for tracking, mixing, and delivery.",
    description:
      "A curated starter set of Quadra processors for producers and engineers building a professional toolkit — available now as a placeholder catalog entry.",
    price: 249.0,
    currency: "USD",
    category: "bundle",
    badge: "Bundle",
    availabilityStatus: "available",
    features: [
      {
        title: "Channel + Dynamics",
        description: "The essential Quadra Channel and Dynamics processors together.",
      },
      {
        title: "Shared Preset Library",
        description: "Cross-plugin presets for faster session starts.",
      },
      {
        title: "Lifetime Updates",
        description: "Licensed once. Updates included for the life of the product.",
      },
    ],
    systemRequirements: [
      "macOS 13+ or Windows 10+",
      "VST3 / AU / AAX",
      "8 GB RAM recommended",
    ],
    cardGradient: "linear-gradient(145deg, #0e1218 0%, #243041 45%, #8b95a5 120%)",
  },
];

export function getSeedProduct(slug: string): Product | undefined {
  return PRODUCTS_SEED.find((p) => p.slug === slug);
}
