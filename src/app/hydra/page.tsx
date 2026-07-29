"use client";

import ThemeSetter from "@/components/ThemeSetter";
import LocalNav from "@/components/LocalNav";
import ProductRibbon from "@/components/ProductRibbon";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Hydra() {
  return (
    <div className={styles.hydraPage} data-theme="dark">
      {/* Force global theme state to DARK MODE for Hydra Pro page */}
      <ThemeSetter theme="dark" />

      {/* Apple Sticky LocalNav (Same spec as apple.com/logic-pro) */}
      <LocalNav
        title="Hydra Pro"
        price="$199.99"
        buyUrl="/store"
        links={[
          { label: "Visão Geral", href: "#overview", active: true },
          { label: "Ferramentas", href: "#tools" },
          { label: "Sons e Plugins", href: "#sounds" },
          { label: "Áudio Espacial", href: "#spatial" },
          { label: "Especificações", href: "#specs" },
        ]}
      />

      {/* Model Family Ribbon */}
      <ProductRibbon />

      <div className={styles.hydraContent}>
        
        {/* =========================================
           1. SECTION WELCOME (Apple Hero)
           ========================================= */}
        <section className={styles.sectionWelcome} id="overview">
          <div className={styles.appIconBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className={styles.welcomeEyebrow}>Hydra Pro</h1>
          <h2 className={styles.welcomeHeadline}>Engenharia de som. Sem limites.</h2>
          <p className={styles.welcomeBody}>
            Hydra Pro é a experiência definitiva de criação e roteamento de áudio profissional para Mac e iPad.
            Conta com uma coleção extensa de algoritmos DSP de 32-bit float, controle com latência zero e integração profunda com o Quadra Silicon.
          </p>

          <div className={styles.welcomeHeroMedia}>
            <div className={styles.playButton}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span>Assista ao filme de lançamento</span>
          </div>
        </section>


        {/* =========================================
           2. SECTION BANNER (Quadra Creator Studio)
           ========================================= */}
        <section className={styles.sectionBanner}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerCopy}>
              <span className={styles.bannerBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Quadra Creator Studio
              </span>
              <h2 className={styles.bannerHeadline}>O pacote essencial para qualquer produtor.</h2>
              <p className={styles.bannerDescription}>
                O Hydra Pro faz parte do Quadra Creator Studio, a coleção completa de ferramentas criativas de áudio que inclui o Quadra OS, Core I/O Manager e Studio FX.
              </p>
              <div className={styles.bannerCtas}>
                <Link href="/store" className="apple-button-primary">
                  Testar grátis por 90 dias
                </Link>
                <Link href="#specs" className="apple-button-secondary">
                  Saiba mais
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================
           3. SECTION HIGHLIGHTS ("Get to know Hydra Pro")
           ========================================= */}
        <section className={styles.sectionHighlights}>
          <h2 className={styles.sectionHeaderHeadline}>Conheça o Hydra Pro.</h2>
          
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>Estúdio de Criação Completo</h3>
                <p className={styles.highlightBody}>
                  Um ambiente único para roteamento de canais, gravação com latência zero, edição cirúrgica e mixagem multicanal.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="M6 12h12M12 6v12" />
                </svg>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>Ferramentas Inteligentes Quadra</h3>
                <p className={styles.highlightBody}>
                  Algoritmos automáticos cuidam do alinhamento de fase e ganho dinâmico para você focar apenas na expressão musical.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>Engine de 32-bit Float</h3>
                <p className={styles.highlightBody}>
                  Garante fidelidade sem perdas e alcance dinâmico infinito para gravações sem estouro ou clipping.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div>
                <h3 className={styles.highlightHeadline}>Coleção de Plugins & Efeitos</h3>
                <p className={styles.highlightBody}>
                  Timbres lendários, reverbs por resposta ao impulso e compressores vintage prontos para usar.
                </p>
              </div>
              <div className={styles.highlightVisual}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13M9 9l12-2" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================
           4. SECTION BEAT-MAKING / PROCESSING TOOLS
           ========================================= */}
        <section className={`${styles.sectionApp}`} id="tools">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Ferramentas de Processamento</span>
            <h2 className={styles.appHeadline}>Domine cada canal.</h2>
            <p className={styles.appCopy}>
              Construa a cadeia de sinal ideal, <strong>programe roteamentos matriciais</strong> e transforme a resposta dos seus microfones e instrumentos. É tudo o que você precisa para criar timbres únicos e dar vida às suas produções.
            </p>
          </div>

          <div className={styles.captionTileRow}>
            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <circle cx="15" cy="15" r="2" />
                </svg>
              </div>
              <h3>Drum Synthesizer</h3>
              <p>Crie timbres de percussão sintetizados com controle dedicado de transientes e frequências graves.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </div>
              <h3>Quick Sampler</h3>
              <p>Grave, fatie e transforme trechos de áudio instantaneamente em instrumentos tocáveis.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v18M3 12h18" />
                </svg>
              </div>
              <h3>Sequenciador de Passos</h3>
              <p>Inspirado em caixas de ritmo clássicas com controle preciso de variação e aleatoriedade.</p>
            </div>
          </div>
        </section>


        {/* =========================================
           5. SECTION SOUNDS, INSTRUMENTS & EFFECTS
           ========================================= */}
        <section className={styles.sectionApp} id="sounds">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Sons, Plugins e Efeitos</span>
            <h2 className={styles.appHeadline}>Sons em quantidade industrial.</h2>
            <p className={styles.appCopy}>
              O Hydra Pro alimenta sua criatividade com uma biblioteca vasta de instrumentos, efeitos e sintetizadores de alta tecnologia para <strong>moldar qualquer estilo musical.</strong>
            </p>
          </div>

          <div className={styles.captionTileRow}>
            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              </div>
              <h3>Chroma Glow & Saturation</h3>
              <p>Adicione calor de válvulas analógicas e textura rica a vocais, guitarras e sintetizadores.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                </svg>
              </div>
              <h3>Space Designer Reverb</h3>
              <p>Simulação convolucional com respostas de impulso gravadas nos melhores estúdios do mundo.</p>
            </div>

            <div className={styles.captionTileCard}>
              <div className={styles.tileMedia}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="7" cy="12" r="2" />
                  <circle cx="17" cy="12" r="2" />
                </svg>
              </div>
              <h3>Mastering Suite Pro</h3>
              <p>Limitadores e equalizadores lineares para deixar sua faixa pronta para distribuição global.</p>
            </div>
          </div>
        </section>


        {/* =========================================
           6. SECTION SPATIAL AUDIO & RECORDING
           ========================================= */}
        <section className={styles.sectionApp} id="spatial">
          <div className={styles.appHeaderCopy}>
            <span className={styles.appEyebrow}>Gravação & Áudio Espacial</span>
            <h2 className={styles.appHeadline}>Áudio Espacial. Envolva-se na música.</h2>
            <p className={styles.appCopy}>
              Renderize e monitore mixagens imersivas em <strong>Dolby Atmos 9.1.6</strong> com suporte nativo a 128 canais e roteamento NDI de ultra-baixa latência pela rede.
            </p>
          </div>
        </section>


        {/* =========================================
           7. TRIAL FOOTER CTA
           ========================================= */}
        <section className={styles.trialSection}>
          <h2 className={styles.trialTitle}>Experimente o Hydra Pro grátis por 90 dias.</h2>
          <p className={styles.trialSub}>
            Disponível para Mac e iPad na Loja Quadra.
          </p>
          <div className={styles.trialCtas}>
            <Link href="/store" className="apple-button-primary">
              Testar grátis por 90 dias
            </Link>
            <Link href="/store" className="apple-button-secondary">
              Comprar Hydra Pro
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
