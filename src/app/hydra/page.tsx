"use client";

import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import ProductRibbon from "@/components/ProductRibbon";
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
      {/* Force global theme state to DARK MODE for Hydra Pro page */}
      <ThemeSetter theme="dark" />

      {/* Apple Sticky LocalNav */}
      <LocalNav title="Hydra Pro" price="$199.99" buyUrl="/store" />

      {/* Model Selector Ribbon */}
      <ProductRibbon />

      <div className={styles.hydraContent}>
        {/* Apple Dynamic Text Intro */}
        <TextIntroBlock
          primaryText={content.hydraIntroTitle || "Engenharia de áudio sem concessões."}
          secondaryText={content.hydraIntroSub || "Desenvolvido para extrair o máximo do Quadra Silicon com latência imperceptível e fidelidade de 32-bit Float."}
        />

        {/* Hero Video Section */}
        <section className={styles.heroSection}>
          <div className={styles.videoPlaceholder}>
            <div className={styles.playButton}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span>Assista ao filme de lançamento</span>
          </div>
        </section>

        {/* Apple 2x2 Tech Highlights Grid */}
        <GridBlock
          items={[
            {
              id: "1",
              title: "Engine de 32-bit Float",
              description:
                "Conversores AD/DA de alta fidelidade que garantem alcance dinâmico sem clipping ou perda de amplitude.",
            },
            {
              id: "2",
              title: "Roteamento com Latência Zero",
              description:
                "Monitoramento direto via hardware para você ouvir cada nuances em tempo real durante a gravação.",
            },
            {
              id: "3",
              title: "Clocking Ultra-low Jitter",
              description:
                "Algoritmos de sincronização de precisão cirúrgica para múltiplos canais digitais simultâneos.",
            },
            {
              id: "4",
              title: "Headroom Dinâmico Inteligente",
              description:
                "Ajuste automático de ganho para proteger o sinal mesmo em picos de volume extremos.",
            },
          ]}
        />

        {/* Dynamic Carousel Section */}
        <CarouselBlock
          headline={content.hydraCarouselTitle || "Projetado para estúdios modernos."}
          intro={content.hydraCarouselSub || "Construído em alumínio usinado monobloco com conectores de precisão."}
          items={content.hydraCarouselItems}
        />

        {/* Software Integration Hero */}
        <PromoHeroBlock
          headline="Projetado para Quadra Silicon."
          subheadline="Aproveite o poder multi-core nativo para rodar centenas de plugins com buffers mínimos."
          mediaClass={styles.softwareModule}
          links={[
            { label: "Explorar Arquitetura", href: "#specs", primary: true },
            { label: "Comprar Hydra Pro", href: "/store" },
          ]}
        />

        {/* Ecosystem & Hardware Grid */}
        <PromoGridBlock
          items={[
            {
              id: "1",
              headline: "Interface Core I/O",
              subheadline: "O rack de expansão de hardware exclusivo para o Hydra Pro.",
              mediaClass: styles.hardwareModule,
              lightText: true,
              links: [
                { label: "Saiba mais", href: "#", primary: true },
              ],
            },
            {
              id: "2",
              headline: "Suporte Studio Pro",
              subheadline: "Atendimento dedicado 24/7 diretamente com engenheiros de som.",
              mediaClass: styles.studioSupportModule,
              lightText: true,
              links: [
                { label: "Obter Suporte", href: "/support", primary: true },
              ],
            },
          ]}
        />

        {/* Performance Footer Intro */}
        <TextIntroBlock
          primaryText={content.hydraPerfTitle || "O novo padrão em interfaces de áudio."}
          secondaryText={content.hydraPerfSub || "Experimente o Hydra Pro na sua cadeia de produção hoje mesmo."}
        />
      </div>
    </div>
  );
}

