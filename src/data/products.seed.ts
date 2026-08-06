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
  sortOrder?: number;
}

/**
 * Offline fallback only when Supabase is unreachable.
 * Live price / availability / copy always come from the `products` table
 * (edit in Supabase or /admin/products) via CatalogProvider.
 */
export const PRODUCTS_SEED: Product[] = [
  {
    slug: "quadra-matrix",
    name: "MATRIX",
    tagline: "Software patchbay + monitor control for Mac.",
    description:
      "MATRIX connects apps, interfaces, and speakers on your Mac through one visual patch field. Enable Matrix Bridge virtual soundcards only when you need them, monitor like a console, and activate with your Quadra ID — 14-day full trial, then a perpetual license for two Macs.",
    price: 179.0,
    currency: "USD",
    category: "software",
    badge: "Start 1.0",
    availabilityStatus: "available",
    features: [
      {
        title: "Visual patch field",
        description:
          "Route any source to any destination with gain on every connection. Save scenes for tracking, mix, or playback.",
      },
      {
        title: "Matrix Bridge devices",
        description:
          "Virtual Core Audio soundcards (2A…128 channels) that appear in Audio MIDI Setup only when you enable them.",
      },
      {
        title: "Control-room monitor",
        description:
          "Dim, mono, mute, talkback, and cue on your real speakers and headphones — separate from the patch.",
      },
      {
        title: "Quadra Guard",
        description:
          "14-day web trial, then activate this Mac with your Quadra ID. Two seats. Works offline after authorization.",
      },
    ],
    systemRequirements: [
      "macOS 14 or later",
      "Apple Silicon or Intel",
      "Admin rights to install the audio driver",
    ],
    cardGradient: "linear-gradient(145deg, #0e1218 0%, #1c4f4d 55%, #00a3a0 120%)",
    sortOrder: 10,
  },
];

export function getSeedProduct(slug: string): Product | undefined {
  return PRODUCTS_SEED.find((p) => p.slug === slug);
}

/** Canonical store slug for the MATRIX product (licensing + deep links). */
export const MATRIX_PRODUCT_SLUG = "quadra-matrix";
