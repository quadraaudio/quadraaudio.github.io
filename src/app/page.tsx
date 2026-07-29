"use client";

import ThemeSetter from "@/components/ThemeSetter";
import PromoHeroBlock from "@/components/blocks/PromoHeroBlock";
import PromoGridBlock from "@/components/blocks/PromoGridBlock";
import { useSiteContent } from "@/contexts/SiteContentContext";
import styles from "./page.module.scss";

export default function Home() {
  const { content } = useSiteContent();

  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />

      {/* Template Block: Promo Hero */}
      <PromoHeroBlock
        headline={content.homeHeroTitle}
        subheadline={content.homeHeroSub}
        mediaClass={styles.heroModule}
        links={[
          { label: "Learn more", href: "/hydra", primary: true },
          { label: "Buy", href: "/store" },
        ]}
      />

      {/* Template Block: Promo Grid (Bento Boxes) */}
      <PromoGridBlock
        items={[
          {
            id: "store",
            headline: "Store",
            subheadline: "Get Hydra today and revolutionize your workflow.",
            mediaClass: styles.storeModule,
            lightText: true,
            links: [{ label: "Shop", href: "/store", primary: true }],
          },
          {
            id: "support",
            headline: "Quadra Support",
            subheadline: "Expert help for your professional audio setup.",
            mediaClass: styles.supportModule,
            lightText: false,
            links: [{ label: "Get help", href: "/support" }],
          },
        ]}
      />
    </div>
  );
}
