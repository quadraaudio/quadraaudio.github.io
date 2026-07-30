"use client";

import type { Config, Data } from "@puckeditor/core";
import type { ReactNode } from "react";
import ProductHeroView from "@/components/marketing/ProductHero";
import StoryChapterView from "@/components/marketing/StoryChapter";

export type QuadraPuckProps = {
  ProductHero: {
    brand: string | ReactNode;
    headline: string | ReactNode;
    subheadline: string | ReactNode;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    mediaSrc: string;
    mediaAlt: string;
    mediaGradient: string;
    theme: "light" | "dark";
  };
  StoryChapter: {
    eyebrow: string | ReactNode;
    title: string | ReactNode;
    body: string | ReactNode;
    mediaSrc: string;
    mediaGradient: string;
    align: "left" | "center" | "right";
    theme: "light" | "dark";
  };
  FeatureStrip: {
    title: string | ReactNode;
    body: string | ReactNode;
    theme: "light" | "dark";
  };
};

export const puckConfig: Config<QuadraPuckProps> = {
  categories: {
    hero: { title: "Hero", components: ["ProductHero"] },
    storytelling: {
      title: "Storytelling",
      components: ["StoryChapter", "FeatureStrip"],
    },
  },
  components: {
    ProductHero: {
      label: "Product Hero",
      fields: {
        brand: { type: "text", contentEditable: true, label: "Brand" },
        headline: { type: "text", contentEditable: true, label: "Headline" },
        subheadline: {
          type: "textarea",
          contentEditable: true,
          label: "Supporting line",
        },
        primaryCtaLabel: { type: "text", label: "Primary CTA label" },
        primaryCtaHref: { type: "text", label: "Primary CTA link" },
        secondaryCtaLabel: { type: "text", label: "Secondary CTA label" },
        secondaryCtaHref: { type: "text", label: "Secondary CTA link" },
        mediaSrc: { type: "text", label: "Image path (/images/...)" },
        mediaAlt: { type: "text", label: "Image alt text" },
        mediaGradient: { type: "textarea", label: "Background gradient CSS" },
        theme: {
          type: "radio",
          label: "Theme",
          options: [
            { label: "Dark", value: "dark" },
            { label: "Light", value: "light" },
          ],
        },
      },
      defaultProps: {
        brand: "Hydra",
        headline: "Sound without boundaries.",
        subheadline:
          "A professional audio matrix for macOS. Virtual devices, network streams, spatial monitoring — one surface.",
        primaryCtaLabel: "Learn more",
        primaryCtaHref: "/hydra/",
        secondaryCtaLabel: "Try Free",
        secondaryCtaHref: "/store/",
        mediaSrc: "/images/home_hero_quadra.jpg",
        mediaAlt: "Hydra interface on Mac",
        mediaGradient:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1a1e 0%, #050506 55%, #000 100%)",
        theme: "dark",
      },
      render: (props) => <ProductHeroView {...props} />,
    },
    StoryChapter: {
      label: "Story Chapter",
      fields: {
        eyebrow: { type: "text", contentEditable: true, label: "Eyebrow" },
        title: { type: "text", contentEditable: true, label: "Title" },
        body: { type: "textarea", contentEditable: true, label: "Body" },
        mediaSrc: { type: "text", label: "Image path" },
        mediaGradient: { type: "textarea", label: "Background gradient CSS" },
        align: {
          type: "radio",
          label: "Text align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        theme: {
          type: "radio",
          label: "Theme",
          options: [
            { label: "Dark", value: "dark" },
            { label: "Light", value: "light" },
          ],
        },
      },
      defaultProps: {
        eyebrow: "Virtual Patchbay",
        title: "Route everything. Lose nothing.",
        body: "Up to 256 channels between DAWs, system audio, and hardware — uncompressed, sub-millisecond.",
        mediaSrc: "/images/store_hydra_card.jpg",
        mediaGradient:
          "radial-gradient(circle at 30% 50%, #1c2430 0%, #0a0a0c 70%)",
        align: "left",
        theme: "dark",
      },
      render: (props) => <StoryChapterView {...props} />,
    },
    FeatureStrip: {
      label: "Feature Strip",
      fields: {
        title: { type: "text", contentEditable: true, label: "Title" },
        body: { type: "textarea", contentEditable: true, label: "Body" },
        theme: {
          type: "radio",
          label: "Theme",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ],
        },
      },
      defaultProps: {
        title: "Built for professional workflows.",
        body: "Hydra follows Apple Human Interface Guidelines — clarity, deference, depth — on every surface.",
        theme: "light",
      },
      render: ({ title, body, theme }) => (
        <section
          data-theme={theme}
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            padding: "var(--space-8) var(--space-5)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: "0 0 var(--space-3)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "var(--tracking-display)",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: "0 auto",
              maxWidth: "40ch",
              color: "var(--text-secondary)",
              fontSize: "var(--text-body-lg)",
              lineHeight: "var(--leading-body)",
            }}
          >
            {body}
          </p>
        </section>
      ),
    },
  },
};

/** Default home page — used until the first visual publish */
export const defaultHomeData: Data = {
  root: { props: { title: "Quadra Home" } },
  content: [
    {
      type: "ProductHero",
      props: {
        id: "ProductHero-home",
        brand: "Hydra",
        headline: "Sound without boundaries.",
        subheadline:
          "A professional audio matrix for macOS. Virtual devices, network streams, spatial monitoring — one surface.",
        primaryCtaLabel: "Learn more",
        primaryCtaHref: "/hydra/",
        secondaryCtaLabel: "Try Free",
        secondaryCtaHref: "/store/",
        mediaSrc: "/images/home_hero_quadra.jpg",
        mediaAlt: "Hydra interface on Mac",
        mediaGradient:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1a1e 0%, #050506 55%, #000 100%)",
        theme: "dark",
      },
    },
    {
      type: "StoryChapter",
      props: {
        id: "StoryChapter-matrix",
        eyebrow: "Virtual Patchbay",
        title: "Route everything. Lose nothing.",
        body: "Up to 256 channels between DAWs, system audio, and hardware — uncompressed, sub-millisecond.",
        mediaSrc: "/images/store_hydra_card.jpg",
        mediaGradient:
          "radial-gradient(circle at 30% 50%, #1c2430 0%, #0a0a0c 70%)",
        align: "left",
        theme: "dark",
      },
    },
    {
      type: "StoryChapter",
      props: {
        id: "StoryChapter-groundcontrol",
        eyebrow: "GroundControl",
        title: "Many interfaces. One clock.",
        body: "Fuse up to eight hardware devices into a single driver. ASRC keeps every stream locked.",
        mediaSrc: "/images/hydra_app_icon.jpg",
        mediaGradient:
          "radial-gradient(circle at 70% 40%, #1a2228 0%, #050506 65%)",
        align: "left",
        theme: "dark",
      },
    },
    {
      type: "StoryChapter",
      props: {
        id: "StoryChapter-network",
        eyebrow: "Network Audio",
        title: "The studio is the network.",
        body: "NDI®, AVB, and AES67 — multichannel streams over Ethernet with broadcast-grade timing.",
        mediaSrc: "",
        mediaGradient:
          "radial-gradient(ellipse at 50% 60%, #142028 0%, #06080a 50%, #000 100%)",
        align: "left",
        theme: "dark",
      },
    },
    {
      type: "StoryChapter",
      props: {
        id: "StoryChapter-spatial",
        eyebrow: "Spatial Monitoring",
        title: "Hear the room. Anywhere.",
        body: "Monitor up to 9.4.6 Atmos with binaural HRTF and head-tracked headphone output.",
        mediaSrc: "/images/home_store_grid.jpg",
        mediaGradient:
          "radial-gradient(circle at 40% 70%, #181820 0%, #000 70%)",
        align: "left",
        theme: "dark",
      },
    },
  ],
};
