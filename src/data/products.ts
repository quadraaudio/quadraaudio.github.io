// ─────────────────────────────────────────────
// Quadra Product Catalog
// Single Standalone Software: Hydra
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

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceLabel?: string;
  badge?: string;
  badgeColor?: "orange" | "gray" | "blue";
  category: "software";
  heroImage?: string;
  cardImage?: string;
  available: boolean;
  features: ProductFeature[];
  specGroups?: ProductSpecGroup[];
  systemRequirements?: string[];
}

export const products: Product[] = [
  {
    slug: "hydra",
    name: "Hydra",
    tagline: "Sound thinking. Endless routing.",
    description:
      "The premier virtual soundcard and multichannel audio routing software for macOS. Combine hardware interfaces, route multi-app audio with zero latency, and stream NDI® or AVB network audio with 32-bit float precision.",
    price: 199.99,
    priceLabel: "$199.99 (90-Day Free Trial)",
    badge: "Virtual Audio Matrix",
    badgeColor: "orange",
    category: "software",
    heroImage: "/images/hydra_app_icon.jpg",
    cardImage: "/images/hydra_app_icon.jpg",
    available: true,
    features: [
      {
        title: "256-Channel Virtual Patchbay",
        description:
          "Route uncompressed audio freely between any DAW, system application, or virtual driver.",
      },
      {
        title: "GroundControl Driver Fusion",
        description:
          "Combine multiple physical audio interfaces into a single unified driver without aggregate clock drift.",
      },
      {
        title: "NDI® & AVB Network Streaming",
        description:
          "Stream up to 128 NDI channels and 256 AVB channels over local Ethernet networks.",
      },
      {
        title: "Spatial Audio 9.1.6 Monitoring",
        description:
          "Integrated Dolby Atmos rendering with Apple Spatial Audio HRTF binaural headphone monitoring.",
      },
      {
        title: "32-Bit Float Audio Engine",
        description:
          "Pristine signal quality offering infinite dynamic headroom up to 384 kHz sample rates.",
      },
      {
        title: "External Controller Automation",
        description:
          "Automate routing snapshots using Stream Deck, Eucon, MIDI, or OSC control.",
      },
    ],
    specGroups: [
      {
        title: "Virtual Routing Engine",
        specs: [
          { label: "Bit Depth", value: "32-bit float processing" },
          { label: "Sample Rates", value: "44.1 / 48 / 88.2 / 96 / 176.4 / 192 / 384 kHz" },
          { label: "Channel Capacity", value: "Up to 256 I/O virtual channels per device" },
          { label: "Added Latency", value: "0ms (Native macOS Core Audio Kernel/System Extension)" },
        ],
      },
      {
        title: "Protocol & Compatibility",
        specs: [
          { label: "macOS", value: "macOS Sonoma (14.0) or later" },
          { label: "Architecture", value: "Universal Binary (Apple Silicon M1/M2/M3/M4 & Intel)" },
          { label: "Network Protocols", value: "NDI® Audio (128 Ch), AVB (256 Ch)" },
          { label: "Plugin Format", value: "AU / VST3 / AAX (GroundControl LINK)" },
        ],
      },
      {
        title: "Licensing & Support",
        specs: [
          { label: "License Type", value: "Single Purchase License — Lifetime Access" },
          { label: "Activations", value: "2 simultaneous machine activations via Quadra ID" },
          { label: "Updates", value: "Free minor & major updates included" },
          { label: "Trial", value: "90-day fully functional trial" },
        ],
      },
    ],
    systemRequirements: [
      "macOS Sonoma 14.0 or later",
      "Apple Silicon (M1 or later) or Intel Core i5/i7/i9",
      "8 GB RAM minimum (16 GB recommended)",
      "Gigabit or 10GbE network connection for NDI® / AVB streaming",
    ],
  },
];

/** Helper: find a product by its slug. Returns Hydra software as default fallback. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug) || products[0];
}
