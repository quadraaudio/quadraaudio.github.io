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
    tagline: "Patch matrix + monitor for Mac.",
    description:
      "Start edition: Matrix Bridge HAL devices (2A…128), NxN patch field (grid and list), control-room monitor, scenes, and Quadra Guard activation via Quadra ID.",
    price: 179.0,
    currency: "USD",
    category: "software",
    badge: "Start 1.0",
    availabilityStatus: "available",
    features: [
      {
        title: "Patch field",
        description: "Grid and list routing with gainful cross-points, paint mode, and scenes.",
      },
      {
        title: "Matrix Bridge",
        description: "Activate 2A…128 channel virtual devices in Audio MIDI Setup from the app.",
      },
      {
        title: "Quadra Guard",
        description: "14-day web trial, then activate this Mac with your Quadra ID (2 seats).",
      },
    ],
    systemRequirements: ["macOS 14+", "Apple Silicon or Intel", "Admin install for HAL"],
    cardGradient: "linear-gradient(145deg, #0e1218 0%, #1c4f4d 55%, #00a3a0 120%)",
    sortOrder: 10,
  },
];

export function getSeedProduct(slug: string): Product | undefined {
  return PRODUCTS_SEED.find((p) => p.slug === slug);
}

/** Canonical store slug for the MATRIX product (licensing + deep links). */
export const MATRIX_PRODUCT_SLUG = "quadra-matrix";
