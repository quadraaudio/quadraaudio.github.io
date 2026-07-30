import type { Data } from "@puckeditor/core";

export const SEED_PAGES: Record<string, { title: string; data: Data }> = {
  home: {
    title: "Quadra Audio",
    data: {
      root: { props: { title: "Quadra Audio" } },
      content: [
        {
          type: "QuadraHero",
          props: {
            id: "home-hero",
            eyebrow: "QUADRA AUDIO",
            title: "Sound thinking. Boundless routing.",
            subtitle:
              "Professional virtual audio routing and spatial monitoring for macOS — built around Hydra.",
            primaryCtaText: "Explore Hydra",
            primaryCtaLink: "/hydra",
            secondaryCtaText: "Store",
            secondaryCtaLink: "/store",
            imageUrl: "/images/home_hero_quadra.jpg",
            videoUrl: "",
          },
        },
        {
          type: "QuadraHighlightGrid",
          props: {
            id: "home-grid",
            sectionTitle: "The Quadra platform",
            sectionSubtitle: "One product focus. Clear paths to buy and get help.",
            tiles: [
              {
                title: "Hydra",
                subtitle: "Virtual soundcard, AoIP matrix, spatial monitor control.",
                badge: "Product",
                imageUrl: "/images/hydra_app_icon.jpg",
                link: "/hydra",
              },
              {
                title: "Store",
                subtitle: "Licenses, downloads, perpetual ownership.",
                badge: "Shop",
                imageUrl: "/images/store_hydra_card.jpg",
                link: "/store",
              },
              {
                title: "Support",
                subtitle: "Setup guides and network audio docs.",
                badge: "Help",
                imageUrl: "/images/home_support_grid.jpg",
                link: "/support",
              },
            ],
          },
        },
        {
          type: "QuadraFinalCTA",
          props: {
            id: "home-cta",
            headline: "Start with Hydra on macOS.",
            subheadline: "Perpetual license, instant key, and a year of updates.",
            priceText: "$199.99",
            buttonText: "Buy Hydra",
            buttonLink: "/store",
          },
        },
      ],
    },
  },

  hydra: {
    title: "Hydra",
    data: {
      root: { props: { title: "Hydra" } },
      content: [
        {
          type: "QuadraLocalNav",
          props: {
            id: "hydra-nav",
            productTitle: "Hydra",
            buyText: "Buy",
            buyLink: "/store",
            items: [
              { label: "Overview", href: "#overview" },
              { label: "Tech Specs", href: "#specs" },
            ],
          },
        },
        {
          type: "QuadraHero",
          props: {
            id: "hydra-hero",
            eyebrow: "HYDRA FOR MACOS",
            title: "128 channels of pure routing power.",
            subtitle:
              "Connect DAWs, hardware, and network streams in one native Core Audio matrix.",
            primaryCtaText: "Buy — $199.99",
            primaryCtaLink: "/store",
            secondaryCtaText: "Specs",
            secondaryCtaLink: "#specs",
            imageUrl: "/images/home_hero_quadra.jpg",
            videoUrl: "",
          },
        },
        {
          type: "QuadraScrollChapter",
          props: {
            id: "hydra-ch-1",
            chapterNumber: "01",
            title: "Zero-latency core matrix",
            subtitle: "Route anything to anything.",
            description:
              "Patch between Pro Tools, Logic, Ableton, Max, and Thunderbolt interfaces with a sub-millisecond buffer path optimized for Apple Silicon.",
            imageUrl: "/images/home_store_grid.jpg",
          },
        },
        {
          type: "QuadraScrollChapter",
          props: {
            id: "hydra-ch-2",
            chapterNumber: "02",
            title: "Spatial monitor control",
            subtitle: "Hear the mix as intended.",
            description:
              "Bass management, alignment, and downmix profiles from immersive layouts to binaural headphones.",
            imageUrl: "/images/home_support_grid.jpg",
          },
        },
        {
          type: "QuadraFeatureBand",
          props: {
            id: "hydra-aoip",
            tagline: "NETWORK",
            title: "NDI, AVB, and AES67 on the LAN",
            body: "Move multichannel audio across your studio network without leaving the Hydra matrix.",
            imageUrl: "/images/home_support_grid.jpg",
            layout: "imageRight",
          },
        },
        {
          type: "QuadraSpecs",
          props: {
            id: "hydra-specs",
            title: "Technical specifications",
            subtitle: "Matrix, network, and system requirements.",
            specs: [
              {
                category: "Channels",
                detail: "Up to 128 inputs and 128 outputs (virtual Core Audio)",
              },
              {
                category: "Sample rates",
                detail: "44.1–192 kHz · 32-bit float path",
              },
              {
                category: "Network",
                detail: "NDI Audio, AVB, AES67 RTP",
              },
              {
                category: "System",
                detail: "macOS 13 Ventura or later · Apple Silicon optimized",
              },
            ],
          },
        },
        {
          type: "QuadraFinalCTA",
          props: {
            id: "hydra-cta",
            headline: "Transform your macOS audio workflow.",
            subheadline: "Instant perpetual key generation and a year of updates.",
            priceText: "$199.99",
            buttonText: "Buy Hydra",
            buttonLink: "/store",
          },
        },
      ],
    },
  },
};
