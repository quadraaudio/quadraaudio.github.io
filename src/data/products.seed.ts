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
 * Offline fallback catalog when Supabase is unavailable.
 * Live storefront reads from the `products` table — edit there (or /admin/products).
 */
export const PRODUCTS_SEED: Product[] = [
  {
    slug: "quadra-matrix",
    name: "MATRIX",
    tagline: "The complete virtual audio patchbay for macOS.",
    description:
      "Eight selectable MATRIX Audio Bridges (2 to 128 channels each) that any app can pick as input or output, routed freely between apps, hardware, out-of-process VST3 plugins, and network audio — all in one visual Matrix Grid.",
    price: 179.0,
    currency: "USD",
    category: "software",
    badge: "Virtual Audio Patchbay",
    availabilityStatus: "available",
    features: [
      {
        title: "Eight Audio Bridges",
        description:
          "2‑A, 2‑B, 4, 8, 16, 32, 64 and 128‑channel virtual soundcards — up to 256 channels of routing headroom.",
      },
      {
        title: "The Matrix Grid",
        description: "Visual cross-point routing with gainful connections and scenes.",
      },
      {
        title: "Quadra Guard",
        description:
          "14-day trial, then activate this Mac with your Quadra ID (2 seats).",
      },
    ],
    systemRequirements: [
      "macOS 26+",
      "Apple Silicon or Intel",
      "Admin install for HAL drivers",
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
