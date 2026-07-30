/**
 * Content schema for the Quadra marketing site.
 * UI components are presentation-only — all copy, media, and section
 * order come from typed page configs (see src/content/).
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
  /** Path under /public or absolute URL */
  src?: string;
  poster?: string;
  alt?: string;
  /** CSS gradient used when type === "gradient" or as media fallback */
  gradient?: string;
}

/** Full-bleed product / brand hero */
export interface HeroSection {
  kind: "hero";
  id: string;
  theme?: ThemeMode;
  /** Product or company name — primary brand signal */
  brand: string;
  headline: string;
  subheadline: string;
  ctas: CTA[];
  media: MediaAsset;
}

/**
 * One beat in a pinned scroll narrative.
 * Layout and animation stay in the component; only content changes here.
 */
export interface StoryChapter {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  media: MediaAsset;
  /** Text alignment within the sticky frame */
  align?: "left" | "center" | "right";
}

/** Apple-style scroll storytelling — chapters drive pin/scrub UI */
export interface ScrollStorySection {
  kind: "scroll-story";
  id: string;
  theme?: ThemeMode;
  chapters: StoryChapter[];
}

/** Discriminated union — extend with new kinds without touching old data */
export type PageSection = HeroSection | ScrollStorySection;

export interface MarketingPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  theme?: ThemeMode;
  sections: PageSection[];
}

export interface ProductCatalogEntry {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  pageId: string;
}
