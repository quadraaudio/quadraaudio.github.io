// ─────────────────────────────────────────────
// Quadra Product Catalog
// Add a new product here and it appears everywhere on the site.
// No UI code needs to change.
// ─────────────────────────────────────────────

export interface ProductFeature {
  title: string;
  description: string;
  mediaClass?: string; // CSS class for carousel card image
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSpecGroup {
  title: string;
  specs: ProductSpec[];
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceLabel?: string; // e.g. "From $199.99" or "Starting at $499"
  badge?: string; // "New Software", "Coming Soon", etc.
  badgeColor?: "orange" | "gray" | "blue";
  category: "software" | "hardware" | "accessory";
  heroImage?: string; // /images/...
  cardImage?: string; // image shown on the store listing card
  available: boolean;
  features: ProductFeature[];
  specGroups?: ProductSpecGroup[];
  systemRequirements?: string[];
}

export const products: Product[] = [
  {
    slug: "hydra-pro",
    name: "Hydra Pro",
    tagline: "No limits.",
    description:
      "The first ever 32-bit float audio routing engine with infinite digital headroom. Designed for professionals who demand absolute clarity.",
    price: 199.99,
    priceLabel: "From $199.99",
    badge: "New Software",
    badgeColor: "orange",
    category: "software",
    heroImage: "/images/hydra_app_icon.jpg",
    cardImage: "/images/hydra_app_icon.jpg",
    available: true,
    features: [
      {
        title: "192kHz / 32-bit Float",
        description:
          "Pristine audio engine preserving full dynamic range without clipping.",
      },
      {
        title: "System-wide Capture",
        description:
          "Isolate and capture audio from any specific app on your machine.",
      },
      {
        title: "Hardware Inserts",
        description:
          "Route outboard gear into your DAW like virtual plugins instantly.",
      },
      {
        title: "MIDI Translation",
        description:
          "Map and route complex MIDI CC messages alongside audio streams.",
      },
      {
        title: "Format Conversion",
        description:
          "Bridge Dante, AVB, and AES67 endpoints natively without hardware converters.",
      },
      {
        title: "Immersive Ready",
        description:
          "Native support for up to 9.1.6 Dolby Atmos environments and HRTF.",
      },
    ],
    specGroups: [
      {
        title: "Audio Engine",
        specs: [
          { label: "Bit Depth", value: "32-bit float" },
          { label: "Sample Rates", value: "44.1 / 48 / 88.2 / 96 / 176.4 / 192 kHz" },
          { label: "Max Channels", value: "Unlimited (system RAM dependent)" },
          { label: "Latency", value: "Sub-millisecond (Core Audio native)" },
        ],
      },
      {
        title: "Compatibility",
        specs: [
          { label: "macOS", value: "13 Ventura or later" },
          { label: "Chip", value: "Apple Silicon or Intel" },
          { label: "DAW Support", value: "All Core Audio compatible DAWs" },
          { label: "Protocol Support", value: "Dante, AVB, AES67, NDI" },
        ],
      },
      {
        title: "Licensing",
        specs: [
          { label: "License Type", value: "Perpetual — buy once, own forever" },
          { label: "Activations", value: "2 machines simultaneously" },
          { label: "Updates", value: "1 year of free major updates included" },
          { label: "Trial", value: "30-day full-featured trial" },
        ],
      },
    ],
    systemRequirements: [
      "macOS 13 Ventura or later",
      "Apple Silicon (M1 or later) or Intel Core i5 or better",
      "8 GB RAM minimum, 16 GB recommended",
      "500 MB available storage",
      "Core Audio compatible audio interface",
    ],
  },
  {
    slug: "quadra-core-io",
    name: "Quadra Core I/O",
    tagline: "Hear everything.",
    description:
      "A professional rackmount audio interface engineered from the ground up for the Quadra ecosystem.",
    price: 0,
    priceLabel: "Coming Soon",
    badge: "Coming Soon",
    badgeColor: "gray",
    category: "hardware",
    heroImage: "/images/home_hero_quadra.jpg",
    cardImage: "/images/home_store_grid.jpg",
    available: false,
    features: [
      {
        title: "32 Channels",
        description: "32 analog inputs and outputs with studio-grade preamps.",
      },
      {
        title: "Hydra Integration",
        description: "Plug-and-play with Hydra Pro. Zero configuration.",
      },
      {
        title: "Dante Built-in",
        description: "Native AoIP streaming without external hardware.",
      },
    ],
  },
];

/** Helper: find a product by its slug. Returns undefined if not found. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
