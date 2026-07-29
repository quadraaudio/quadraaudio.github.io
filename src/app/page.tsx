"use client";

import ThemeSetter from "@/components/ThemeSetter";
import PromoHeroBlock from "@/components/blocks/PromoHeroBlock";
import PromoGridBlock from "@/components/blocks/PromoGridBlock";
import ProductRibbon from "@/components/ProductRibbon";
import { useSiteContent } from "@/contexts/SiteContentContext";
import styles from "./page.module.scss";

export default function Home() {
  const { content } = useSiteContent();

  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />

      {/* Apple Model Family Ribbon Header */}
      <ProductRibbon />

      {/* Main Flagship Hero: Hydra Pro */}
      <PromoHeroBlock
        headline={content.homeHeroTitle || "Hydra Pro"}
        subheadline={content.homeHeroSub || "Áudio de altíssima precisão. Potencializado pelo Quadra Silicon."}
        mediaClass={styles.heroModule}
        links={[
          { label: "Saiba mais", href: "/hydra", primary: true },
          { label: "Comprar", href: "/store" },
        ]}
      />

      {/* Secondary Hero: Quadra Silicon */}
      <PromoHeroBlock
        headline="Quadra Silicon."
        subheadline="O motor DSP de 32-bit Float projetado para estúdios exigentes."
        mediaClass={styles.heroSecondary}
        links={[
          { label: "Conheça a Arquitetura", href: "/hydra#specs", primary: true },
          { label: "Ver Modelos", href: "/hydra" },
        ]}
      />

      {/* Bento Grid 2x2 (Apple Grid) */}
      <PromoGridBlock
        items={[
          {
            id: "quadra-os",
            headline: "Quadra OS 3.0",
            subheadline: "Controle e roteamento em tempo real sem latência.",
            mediaClass: styles.quadraOsModule,
            lightText: true,
            links: [{ label: "Saiba mais", href: "/hydra", primary: true }],
          },
          {
            id: "hydra-duo",
            headline: "Hydra Duo",
            subheadline: "Qualidade Pro de gravação em formato ultra-portátil.",
            mediaClass: styles.hydraDuoModule,
            lightText: true,
            links: [{ label: "Comprar", href: "/store", primary: true }],
          },
          {
            id: "store",
            headline: "Loja Quadra",
            subheadline: "Garanta seu Hydra com frete grátis e suporte direto.",
            mediaClass: styles.storeModule,
            lightText: false,
            links: [{ label: "Explorar Loja", href: "/store", primary: true }],
          },
          {
            id: "support",
            headline: "Quadra Care",
            subheadline: "Suporte técnico 24/7 especializado para engenheiros de áudio.",
            mediaClass: styles.supportModule,
            lightText: false,
            links: [{ label: "Obter Ajuda", href: "/support", primary: true }],
          },
        ]}
      />
    </div>
  );
}

