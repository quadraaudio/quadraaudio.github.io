"use client";

import ThemeSetter from "@/components/ThemeSetter";
import PromoHeroBlock from "@/components/blocks/PromoHeroBlock";
import PromoGridBlock from "@/components/blocks/PromoGridBlock";
import ProductRibbon from "@/components/ProductRibbon";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />

      {/* Feature Capabilities Ribbon */}
      <ProductRibbon />

      {/* Flagship Hero: Hydra Virtual Soundcard & Audio Matrix */}
      <PromoHeroBlock
        headline="Hydra"
        subheadline="Virtual soundcard and audio matrix software for Mac."
        mediaClass={styles.heroModule}
        links={[
          { label: "Learn more", href: "/hydra", primary: true },
          { label: "Try Free", href: "/store" },
        ]}
      />

      {/* Secondary Hero: Quadra Silicon Audio Engine */}
      <PromoHeroBlock
        headline="Quadra Core Audio Engine."
        subheadline="32-bit Float processing for sub-millisecond multi-app patching."
        mediaClass={styles.heroSecondary}
        links={[
          { label: "Explore Architecture", href: "/hydra#specs", primary: true },
          { label: "View System Specs", href: "/hydra#specs" },
        ]}
      />

      {/* Apple Bento Grid 2x2 */}
      <PromoGridBlock
        items={[
          {
            id: "patchbay",
            headline: "Virtual Patchbay",
            subheadline: "Route audio seamlessly between Logic Pro, Pro Tools, OBS, Zoom, and system audio.",
            mediaClass: styles.quadraOsModule,
            lightText: true,
            links: [{ label: "Learn more", href: "/hydra#tools", primary: true }],
          },
          {
            id: "network-audio",
            headline: "NDI® & AVB Streaming",
            subheadline: "Stream up to 256 multichannel audio streams over local Ethernet with zero loss.",
            mediaClass: styles.hydraDuoModule,
            lightText: true,
            links: [{ label: "Explore NDI Features", href: "/hydra#network", primary: true }],
          },
          {
            id: "spatial-monitoring",
            headline: "Spatial Audio 9.1.6",
            subheadline: "Monitor Dolby Atmos renders directly with head-tracked binaural headphone output.",
            mediaClass: styles.storeModule,
            lightText: false,
            links: [{ label: "Learn Spatial Routing", href: "/hydra#spatial", primary: true }],
          },
          {
            id: "support",
            headline: "Quadra Care Support",
            subheadline: "24/7 technical support from professional audio and broadcast engineers.",
            mediaClass: styles.supportModule,
            lightText: false,
            links: [{ label: "Get Support", href: "/support", primary: true }],
          },
        ]}
      />
    </div>
  );
}
