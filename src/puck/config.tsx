import type { Config } from "@puckeditor/core";
import { QuadraHero, type QuadraHeroProps } from "@/components/blocks/QuadraHero";
import {
  QuadraLocalNav,
  type QuadraLocalNavProps,
} from "@/components/blocks/QuadraLocalNav";
import {
  QuadraScrollChapter,
  type QuadraScrollChapterProps,
} from "@/components/blocks/QuadraScrollChapter";
import {
  QuadraFeatureBand,
  type QuadraFeatureBandProps,
} from "@/components/blocks/QuadraFeatureBand";
import {
  QuadraHighlightGrid,
  type QuadraHighlightGridProps,
} from "@/components/blocks/QuadraHighlightGrid";
import { QuadraSpecs, type QuadraSpecsProps } from "@/components/blocks/QuadraSpecs";
import {
  QuadraFinalCTA,
  type QuadraFinalCTAProps,
} from "@/components/blocks/QuadraFinalCTA";

export type Props = {
  QuadraHero: QuadraHeroProps;
  QuadraLocalNav: QuadraLocalNavProps;
  QuadraScrollChapter: QuadraScrollChapterProps;
  QuadraFeatureBand: QuadraFeatureBandProps;
  QuadraHighlightGrid: QuadraHighlightGridProps;
  QuadraSpecs: QuadraSpecsProps;
  QuadraFinalCTA: QuadraFinalCTAProps;
};

export const config: Config<Props> = {
  components: {
    QuadraHero: {
      label: "Hero (full-bleed)",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        primaryCtaText: { type: "text", label: "Primary CTA" },
        primaryCtaLink: { type: "text", label: "Primary CTA link" },
        secondaryCtaText: { type: "text", label: "Secondary CTA" },
        secondaryCtaLink: { type: "text", label: "Secondary CTA link" },
        imageUrl: { type: "text", label: "Background image URL" },
        videoUrl: { type: "text", label: "Background video URL (optional)" },
      },
      defaultProps: {
        eyebrow: "HYDRA",
        title: "Sound thinking. Boundless routing.",
        subtitle:
          "Virtual soundcard, AoIP matrix, and spatial monitor controller for macOS.",
        primaryCtaText: "Buy",
        primaryCtaLink: "/store",
        secondaryCtaText: "Learn more",
        secondaryCtaLink: "/hydra",
        imageUrl: "/images/home_hero_quadra.jpg",
        videoUrl: "",
      },
      render: QuadraHero,
    },

    QuadraLocalNav: {
      label: "Product local nav",
      fields: {
        productTitle: { type: "text", label: "Product title" },
        buyText: { type: "text", label: "Buy label" },
        buyLink: { type: "text", label: "Buy link" },
        items: {
          type: "array",
          label: "Links",
          getItemSummary: (item) => item.label || "Link",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Href" },
          },
          defaultItemProps: { label: "Overview", href: "#overview" },
        },
      },
      defaultProps: {
        productTitle: "Hydra",
        buyText: "Buy",
        buyLink: "/store",
        items: [
          { label: "Overview", href: "#overview" },
          { label: "Tech Specs", href: "#specs" },
        ],
      },
      render: QuadraLocalNav,
    },

    QuadraScrollChapter: {
      label: "Scroll chapter",
      fields: {
        chapterNumber: { type: "text", label: "Chapter number" },
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        description: { type: "textarea", label: "Description" },
        imageUrl: { type: "text", label: "Image URL" },
      },
      defaultProps: {
        chapterNumber: "01",
        title: "Zero-latency matrix",
        subtitle: "128 channels. One engine.",
        description:
          "Route audio between DAWs, hardware, and network streams with a native macOS Core Audio path.",
        imageUrl: "/images/home_store_grid.jpg",
      },
      render: QuadraScrollChapter,
    },

    QuadraFeatureBand: {
      label: "Feature band",
      fields: {
        tagline: { type: "text", label: "Tagline" },
        title: { type: "text", label: "Title" },
        body: { type: "textarea", label: "Body" },
        imageUrl: { type: "text", label: "Image URL" },
        layout: {
          type: "radio",
          label: "Layout",
          options: [
            { label: "Image right", value: "imageRight" },
            { label: "Image left", value: "imageLeft" },
          ],
        },
      },
      defaultProps: {
        tagline: "MONITOR",
        title: "Spatial monitoring built in",
        body: "Bass management, alignment, and downmix profiles for stereo through immersive formats.",
        imageUrl: "/images/home_support_grid.jpg",
        layout: "imageRight",
      },
      render: QuadraFeatureBand,
    },

    QuadraHighlightGrid: {
      label: "Highlight tiles",
      fields: {
        sectionTitle: { type: "text", label: "Section title" },
        sectionSubtitle: { type: "textarea", label: "Section subtitle" },
        tiles: {
          type: "array",
          label: "Tiles",
          getItemSummary: (item) => item.title || "Tile",
          arrayFields: {
            title: { type: "text", label: "Title" },
            subtitle: { type: "textarea", label: "Subtitle" },
            badge: { type: "text", label: "Badge" },
            imageUrl: { type: "text", label: "Image URL" },
            link: { type: "text", label: "Link" },
          },
          defaultItemProps: {
            title: "Hydra",
            subtitle: "Learn more",
            badge: "Product",
            imageUrl: "/images/hydra_app_icon.jpg",
            link: "/hydra",
          },
        },
      },
      defaultProps: {
        sectionTitle: "Explore Quadra",
        sectionSubtitle: "Software and support built around Hydra.",
        tiles: [
          {
            title: "Hydra",
            subtitle: "Virtual soundcard and AoIP matrix for macOS.",
            badge: "Product",
            imageUrl: "/images/hydra_app_icon.jpg",
            link: "/hydra",
          },
          {
            title: "Store",
            subtitle: "Licenses and downloads.",
            badge: "Shop",
            imageUrl: "/images/store_hydra_card.jpg",
            link: "/store",
          },
          {
            title: "Support",
            subtitle: "Guides and documentation.",
            badge: "Help",
            imageUrl: "/images/home_support_grid.jpg",
            link: "/support",
          },
        ],
      },
      render: QuadraHighlightGrid,
    },

    QuadraSpecs: {
      label: "Tech specs",
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        specs: {
          type: "array",
          label: "Rows",
          getItemSummary: (item) => item.category || "Spec",
          arrayFields: {
            category: { type: "text", label: "Category" },
            detail: { type: "textarea", label: "Detail" },
          },
          defaultItemProps: {
            category: "System",
            detail: "macOS 13 or later",
          },
        },
      },
      defaultProps: {
        title: "Technical specifications",
        subtitle: "Hydra system and matrix capabilities.",
        specs: [
          {
            category: "Channels",
            detail: "Up to 128 in / 128 out virtual Core Audio matrix",
          },
          {
            category: "Network",
            detail: "NDI Audio, AVB, AES67",
          },
          {
            category: "System",
            detail: "macOS 13+ · Apple Silicon optimized",
          },
        ],
      },
      render: QuadraSpecs,
    },

    QuadraFinalCTA: {
      label: "Final CTA",
      fields: {
        headline: { type: "text", label: "Headline" },
        subheadline: { type: "textarea", label: "Subheadline" },
        priceText: { type: "text", label: "Price" },
        buttonText: { type: "text", label: "Button" },
        buttonLink: { type: "text", label: "Button link" },
      },
      defaultProps: {
        headline: "Get Hydra for macOS.",
        subheadline: "Perpetual license with instant download.",
        priceText: "$199.99",
        buttonText: "Buy",
        buttonLink: "/store",
      },
      render: QuadraFinalCTA,
    },
  },
};
