/**
 * Shared marketing content types.
 * Puck is the visual source of truth at runtime; these types document the shape.
 */

export type ThemeMode = "light" | "dark";

export type CTAVariant = "primary" | "secondary" | "link";

export interface CTA {
  label: string;
  href: string;
  variant?: CTAVariant;
}

export type MediaType = "image" | "video" | "gradient";

export interface MediaAsset {
  type: MediaType;
  src?: string;
  poster?: string;
  alt?: string;
  gradient?: string;
}
