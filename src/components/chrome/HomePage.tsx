"use client";

import { useState } from "react";
import Link from "next/link";
import { TypedHeader } from "@/components/motion/TypedHeader";
import { Reveal } from "@/components/motion/Reveal";
import { HeroParticles } from "@/components/three/HeroParticles";
import { SpectrumCascade } from "@/components/three/SpectrumCascade";
import { LogoMark } from "@/components/chrome/LogoMark";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { formatPrice } from "@/lib/products";
import styles from "./HomePage.module.scss";

const FEATURES = [
  {
    title: "Built for real sessions",
    body: "Low-latency processors designed for tracking, mixing, and delivery — not demos.",
  },
  {
    title: "Licensed once",
    body: "Buy tools you own. Activate with your Quadra account and keep working offline after activation.",
  },
  {
    title: "Studio-grade polish",
    body: "Interfaces and sound designed with the same care as the signal path.",
  },
];

const AUDIENCES = [
  {
    title: "Mixing engineers",
    body: "Recall-safe tools that stay out of the way until you need character.",
  },
  {
    title: "Producers",
    body: "Fast presets and musical defaults for writing sessions that turn into masters.",
  },
  {
    title: "Studios",
    body: "Consistent installs across rooms with account-backed licensing.",
  },
];

export function HomePage() {
  const { products, loading } = useCatalog();
  const [modalOpen, setModalOpen] = useState(false);
  const [audience, setAudience] = useState(0);

  return (
    <main className={styles.pageEnter}>
      <section className={styles.hero}>
        <div className={styles.heroVisual} aria-hidden>
          <div className={styles.heroGlow} />
          <HeroParticles />
        </div>
        <div className={`page-shell ${styles.heroContent}`}>
          <LogoMark size="hero" className={styles.brandMark} />
          <h1 className={`display display-xl ${styles.headline}`}>
            <TypedHeader text="Professional audio software for the modern studio." />
          </h1>
          <p className={`lede ${styles.sub}`}>
            Processors and tools for engineers, producers, and studios who need
            reliable sound — not noise.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/store" className="btn btn-primary">
              Shop software
            </Link>
            <Link href="/products" className="btn btn-secondary">
              Explore products
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className="page-shell">
          <Reveal>
            <button
              type="button"
              className={styles.videoCard}
              onClick={() => setModalOpen(true)}
            >
              <span className={styles.videoLabel}>Watch overview</span>
              <span className={styles.play}>Play</span>
            </button>
          </Reveal>
        </div>
      </section>

      {modalOpen && (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <button
            type="button"
            className={styles.modalBackdrop}
            aria-label="Close"
            onClick={() => setModalOpen(false)}
          />
          <div className={styles.modalPanel}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
            <div className={styles.modalBody}>
              <p className="display display-md">Quadra overview</p>
              <p className="lede">
                Placeholder demo reel. Replace with product footage when ready.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className={styles.products}>
        <div className="page-shell">
          <Reveal>
            <p className="eyebrow">Products</p>
            <h2 className="display display-lg">Tools that earn a permanent slot.</h2>
          </Reveal>
          <div className={styles.productGrid}>
            {loading ? (
              <p className="lede" role="status">
                Loading catalog…
              </p>
            ) : (
              products.map((product) => (
              <Reveal key={product.slug}>
                <Link href={`/store/${product.slug}`} className={styles.productCard}>
                  <div
                    className={styles.productArt}
                    style={{ background: product.cardGradient }}
                  />
                  <div className={styles.productCopy}>
                    <p className={styles.badge}>{product.badge}</p>
                    <h3>{product.name}</h3>
                    <p>{product.tagline}</p>
                    <span>{formatPrice(product.price, product.currency)}</span>
                  </div>
                </Link>
              </Reveal>
              ))
            )}
          </div>
        </div>
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
              <p className={styles.hydraTeaserBrand}>MATRIX</p>
              <h2 className="display display-lg">
                The routing matrix for the modern Mac studio.
              </h2>
              <p className={styles.hydraTeaserLede}>
                Virtual bridges, a gainful patchbay, and monitor control — built for Mac.
              </p>
              <span className={styles.hydraTeaserCta}>Explore MATRIX</span>
            </Reveal>
          </div>
        </Link>
      </section>

      <section className={styles.features}>
        <div className="page-shell">
          <Reveal>
            <p className="eyebrow">Why Quadra</p>
            <h2 className="display display-lg">Built for professionals.</h2>
          </Reveal>
          <div className={styles.featureList}>
            {FEATURES.map((feature, index) => (
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
            <p className="eyebrow">Use cases</p>
            <h2 className="display display-lg">One toolkit. Many rooms.</h2>
          </Reveal>
          <div className={styles.audiencePanel}>
            <div className={styles.audienceTabs}>
              {AUDIENCES.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={index === audience ? styles.activeTab : ""}
                  onClick={() => setAudience(index)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <Reveal key={audience}>
              <div className={styles.audienceCopy}>
                <h3>{AUDIENCES[audience].title}</h3>
                <p>{AUDIENCES[audience].body}</p>
                <Link href="/store" className="btn btn-secondary">
                  Browse the store
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.storeTeaser}>
        <div className={`page-shell ${styles.storeInner}`}>
          <div className={styles.storeBackdrop} aria-hidden>
            <SpectrumCascade />
          </div>
          <Reveal>
            <p className={styles.storeBrand}>Quadra Store</p>
            <h2 className="display display-lg">Own your tools.</h2>
            <p className={styles.storeLede}>
              Perpetual licenses, account-backed checkout, and PayPal support from
              day one.
            </p>
            <Link href="/store" className="btn btn-inverse">
              Open store
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
