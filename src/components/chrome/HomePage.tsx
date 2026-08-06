"use client";

import Link from "next/link";
import { TypedHeader } from "@/components/motion/TypedHeader";
import { Reveal } from "@/components/motion/Reveal";
import { HeroParticles } from "@/components/three/HeroParticles";
import { SpectrumCascade } from "@/components/three/SpectrumCascade";
import { ScrollCue } from "@/components/chrome/ScrollCue";
import { formatPrice } from "@/lib/products";
import { useCatalog } from "@/components/providers/CatalogProvider";
import {
  HOME_COPY,
  MATRIX_GLOSS,
  QUADRA_CTAS,
} from "@/data/brand.messaging";
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";
import styles from "./HomePage.module.scss";

export function HomePage() {
  const { getBySlug } = useCatalog();
  const matrix = getBySlug(MATRIX_PRODUCT_SLUG);

  return (
    <main className={styles.pageEnter}>
      <section className={styles.hero}>
        <div className={styles.heroVisual} aria-hidden>
          <div className={styles.heroGlow} />
          <HeroParticles />
        </div>
        <div className={`page-shell ${styles.heroContent}`}>
          <p className={styles.brandSignal}>{HOME_COPY.brandSignal}</p>
          <h1 className={`display display-xl ${styles.headline}`}>
            <TypedHeader text={HOME_COPY.headline} />
          </h1>
          <p className={`lede ${styles.sub}`}>{HOME_COPY.lede}</p>
          <div className={styles.ctaRow}>
            <Link href={QUADRA_CTAS.exploreMatrix.href} className="btn btn-primary">
              {QUADRA_CTAS.exploreMatrix.label}
            </Link>
            <Link href={QUADRA_CTAS.buyMatrix.href} className="btn btn-secondary">
              {QUADRA_CTAS.buyMatrix.label}
            </Link>
          </div>
        </div>
        <ScrollCue label="Scroll" />
      </section>

      <section className={styles.hydraTeaser}>
        <Link href="/products/matrix" className={styles.hydraTeaserLink}>
          <div className={styles.hydraTeaserMedia} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hydra/hero-studio.png" alt="" />
            <div className={styles.hydraTeaserShade} />
          </div>
          <div className={`page-shell ${styles.hydraTeaserCopy}`}>
            <Reveal>
              <p className={styles.hydraTeaserBrand}>
                {HOME_COPY.matrixBlock.eyebrow}
              </p>
              <p className={styles.hydraTeaserProduct}>
                {HOME_COPY.matrixBlock.brand}
              </p>
              <h2 className="display display-lg">{HOME_COPY.matrixBlock.title}</h2>
              <p className={styles.hydraTeaserLede}>
                {HOME_COPY.matrixBlock.body}
              </p>
              <p className={styles.hydraTeaserDetail}>
                {HOME_COPY.matrixBlock.detail}
              </p>
              <span className={styles.hydraTeaserCta}>
                {QUADRA_CTAS.exploreMatrix.label}
              </span>
            </Reveal>
          </div>
        </Link>
      </section>

      <section className={styles.features}>
        <div className="page-shell">
          <Reveal>
            <p className="eyebrow">Why Quadra</p>
            <h2 className="display display-lg">Clear path from try to own.</h2>
          </Reveal>
          <div className={styles.featureList}>
            {HOME_COPY.why.map((feature, index) => (
              <Reveal key={feature.title}>
                <article className={styles.featureItem}>
                  <span className={styles.featureIndex}>0{index + 1}</span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.audience}>
        <div className="page-shell">
          <Reveal>
            <p className="eyebrow">Built for sessions</p>
            <h2 className="display display-lg">What MATRIX helps you do.</h2>
          </Reveal>
          <div className={styles.sessionGrid}>
            {HOME_COPY.sessions.map((item) => (
              <Reveal key={item.title}>
                <article className={styles.sessionCard}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className={styles.sessionCtas}>
            <Link href={QUADRA_CTAS.exploreMatrix.href} className="btn btn-secondary">
              {QUADRA_CTAS.exploreMatrix.label}
            </Link>
            <Link href={QUADRA_CTAS.buyMatrix.href} className="btn btn-primary">
              {QUADRA_CTAS.buyMatrix.label}
              {matrix
                ? ` — ${formatPrice(matrix.price, matrix.currency)}`
                : ""}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.storeTeaser}>
        <div className={`page-shell ${styles.storeInner}`}>
          <div className={styles.storeBackdrop} aria-hidden>
            <SpectrumCascade />
          </div>
          <Reveal>
            <p className={styles.storeBrand}>{HOME_COPY.storeClose.eyebrow}</p>
            <h2 className="display display-lg">{HOME_COPY.storeClose.title}</h2>
            <p className={styles.storeLede}>{HOME_COPY.storeClose.lede}</p>
            <p className={styles.storeNote}>{MATRIX_GLOSS.who}</p>
            <Link href={QUADRA_CTAS.buyMatrix.href} className="btn btn-inverse">
              {QUADRA_CTAS.buyMatrix.label}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
