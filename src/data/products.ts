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
    tagline: "Sound thinking. Boundless routing.",
    description:
      "The ultimate virtual soundcard, AoIP network matrix, and spatial audio monitor controller for macOS. Combine physical audio interfaces, route multi-app audio with zero latency, stream 128 NDI® / 256 AVB channels, and render 9.4.6 Dolby Atmos mixes with 32-bit float precision.",
    price: 199.99,
    priceLabel: "$199.99 (90-Day Free Trial)",
    badge: "Virtual Audio Matrix",
    badgeColor: "orange",
    category: "software",
    heroImage: "https://www.apple.com/v/logic-pro/n/images/overview/welcome/hero_endframe__dc7irycb3gia_large.jpg",
    cardImage: "/images/hydra_app_icon.jpg",
    available: true,
    availabilityStatus: "available",
    features: [
      {
        title: "256-Channel Virtual Patchbay",
        description:
          "Route uncompressed audio freely between any DAW, system application, hardware interface, or virtual driver with sub-millisecond buffer speeds.",
      },
      {
        title: "GroundControl Driver Fusion",
        description:
          "Combine up to 8 physical audio interfaces into a single unified driver without aggregate clock drift or channel loss.",
      },
      {
        title: "NDI®, AVB & AES67 Network AoIP",
        description:
          "Stream up to 128 NDI® channels, 256 AVB channels, and AES67 RTP streams over local Ethernet networks.",
      },
      {
        title: "Spatial Audio 9.4.6 & HRTF",
        description:
          "Integrated Dolby Atmos rendering with Apple Spatial Audio HRTF binaural headphone monitoring and head tracking.",
      },
      {
        title: "32-Bit Float C++ Audio Engine",
        description:
          "Pristine signal processing offering infinite dynamic headroom, zero digital clipping, and sample rates up to 384 kHz.",
      },
      {
        title: "Stream Deck, MIDI & OSC Automation",
        description:
          "Save and recall complex matrix routing snapshots via Elgato Stream Deck, EUCON, MIDI Program Changes, or OSC protocols.",
      },
    ],
    specGroups: [
      {
        title: "Virtual Driver & Routing Engine",
        specs: [
          { label: "Processing Precision", value: "32-bit float real-time engine" },
          { label: "Supported Sample Rates", value: "44.1 / 48 / 88.2 / 96 / 176.4 / 192 / 384 kHz" },
          { label: "Virtual Devices", value: "4 configurable virtual drivers (2 to 256 I/O channels per device)" },
          { label: "Added Driver Latency", value: "0ms (Core Audio System Extension)" },
        ],
      },
      {
        title: "Network & Plugin Protocols",
        specs: [
          { label: "Network Audio (AoIP)", value: "NDI® Audio (128 Ch), AVB (256 Ch), AES67 / SAP SDP" },
          { label: "Plugin Formats", value: "AU / VST3 / AAX (GroundControl LINK insert plugin)" },
          { label: "System Audio Capture", value: "Core Audio Process Tap (isolate Chrome, Zoom, Spotify, Discord)" },
          { label: "Hardware Control", value: "Elgato Stream Deck, EUCON, MIDI, OSC, iOS/Android Remote" },
        ],
      },
      {
        title: "Licensing & Support",
        specs: [
          { label: "License Type", value: "Single Purchase Perpetual License — Lifetime Access" },
          { label: "Machine Activations", value: "2 simultaneous Mac activations via Quadra ID" },
          { label: "Updates", value: "All minor & major v1.x updates included" },
          { label: "Free Trial", value: "90-day fully functional trial" },
        ],
      },
    ],
    systemRequirements: [
      "macOS Sonoma (14.0) or later",
      "Apple Silicon (M1/M2/M3/M4) or Intel Core i5/i7/i9",
      "8 GB RAM minimum (16 GB recommended)",
      "Gigabit or 10GbE network connection for NDI® / AVB AoIP streaming",
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
    description: "Hardware companion rack for Hydra Pro with 32-bit float AD/DA converters, Dante/AES67 connectivity, and ultra-quiet preamps.",
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

