"use client";

import ThemeSetter from "@/components/ThemeSetter";
import TextIntroBlock from "@/components/blocks/TextIntroBlock";
import GridBlock from "@/components/blocks/GridBlock";
import CarouselBlock from "@/components/blocks/CarouselBlock";
import PromoHeroBlock from "@/components/blocks/PromoHeroBlock";
import PromoGridBlock from "@/components/blocks/PromoGridBlock";
import { useSiteContent } from "@/contexts/SiteContentContext";
import styles from "./page.module.scss";

export default function Hydra() {
  const { content } = useSiteContent();

  return (
    <div className={styles.hydraPage} data-theme="dark">
      {/* Force global theme state to DARK MODE for Hydra page */}
      <ThemeSetter theme="dark" />

      {/* Hydra Sub-Header / Local Nav */}
      <div className={styles.subHeader}>
        <div className={styles.subHeaderContent}>
          <span className={styles.productTitle}>Hydra</span>
          <div className={styles.subHeaderRight}>
            <span className={styles.priceTag}>$199.99</span>
            <a href="/store/hydra-pro" className={styles.buyPillBtn}>
              Buy
            </a>
          </div>
        </div>
      </div>

      <div className={styles.hydraContent}>
        {/* Template Block: Dynamic Text Intro */}
        <TextIntroBlock
          primaryText={content.hydraIntroTitle}
          secondaryText={content.hydraIntroSub}
        />

        {/* Hero Video/Visual Section */}
        <section className={styles.heroSection}>
          <div className={styles.videoPlaceholder}>
            <div className={styles.playButton}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span>Watch the film</span>
          </div>
        </section>

        {/* Grid 2x2 Feature Highlights */}
        <GridBlock
          items={[
            {
              id: "1",
              title: "32-bit Float Engine",
              description:
                "Custom-engineered AD/DA converters offering unprecedented clarity and depth for demanding ears.",
            },
            {
              id: "2",
              title: "Zero Latency Routing",
              description:
                "Direct hardware monitoring ensures you hear your performance in real time, every time.",
            },
            {
              id: "3",
              title: "Ultra-low Jitter",
              description:
                "Precision clocking algorithms sync all digital audio streams seamlessly across your setup.",
            },
            {
              id: "4",
              title: "Dynamic Headroom",
              description:
                "Intelligent gain staging prevents clipping even under extreme signal spikes.",
            },
          ]}
        />

        {/* Dynamic Carousel Section */}
        <CarouselBlock
          headline={content.hydraCarouselTitle}
          intro={content.hydraCarouselSub}
          items={content.hydraCarouselItems}
        />

        {/* Promo Hero: Software Integration */}
        <PromoHeroBlock
          headline="Designed for Quadra Silicon."
          subheadline="Engineered to harness full multi-core performance for sub-millisecond roundtrip buffer speeds."
          links={[
            { label: "Explore Architecture", href: "#", primary: true },
            { label: "Buy Hydra", href: "/store/hydra-pro" }
          ]}
        />

        {/* Promo Grid: Ecosystem & Hardware */}
        <PromoGridBlock
          items={[
            {
              id: "1",
              headline: "Core I/O Interface",
              subheadline: "The companion hardware rack built exclusively for Hydra Pro.",
              lightText: true,
              links: [
                { label: "Learn more", href: "#", primary: true },
                { label: "Notify me", href: "#" },
              ],
            },
            {
              id: "2",
              headline: "Studio Support",
              subheadline: "Get 24/7 dedicated support from audio engineers.",
              lightText: true,
              links: [
                { label: "Get help", href: "/support", primary: true },
              ],
            },
          ]}
        />

        {/* Final Performance Intro */}
        <TextIntroBlock
          primaryText={content.hydraPerfTitle}
          secondaryText={content.hydraPerfSub}
        />
      </div>
    </div>
  );
}
