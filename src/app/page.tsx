"use client";

import Link from "next/link";
import ThemeSetter from "@/components/ThemeSetter";
import ProductTile from "@/components/ProductTile";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div>
      <ThemeSetter theme="dark" />

      <section className={styles.hero}>
        <img
          src="/images/hydra_hero_engineer.jpg"
          alt="Audio engineer using Hydra on macOS"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Hydra</p>
          <h1 className={styles.heroHeadline}>The complete virtual audio patchbay.</h1>
          <p className={styles.heroSub}>
            Eight audio bridges. One Matrix Grid. Every app, every plugin, every
            network stream, routed exactly where you want it.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/hydra" className={styles.heroLink}>
              Learn more &gt;
            </Link>
            <Link href="/store/buy-hydra" className={styles.heroLink}>
              Buy &gt;
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="section-container-wide">
          <div className={styles.grid}>
            <ProductTile
              eyebrow="Hydra"
              headline="Route anything, to anything."
              image="/images/hydra_mixing_hands.jpg"
              learnMoreHref="/hydra"
              buyHref="/store/buy-hydra"
            />
            <ProductTile
              eyebrow="Hydra Pro"
              headline="Pure spatial matrix routing."
              image="/images/hydra_control_room_wide.jpg"
              learnMoreHref="/store/hydra-pro"
              buyHref="/store/hydra-pro"
            />
            <ProductTile
              eyebrow="Quadra Core I/O"
              headline="The studio interface. Coming soon."
              image="/images/hydra_patch_cables.jpg"
              learnMoreHref="/store/quadra-core-io"
            />
          </div>
        </div>
      </section>

      <section className={styles.trustBand}>
        <div className="section-container">
          <p className="eyebrow">Quadra Guard 2.0</p>
          <h2 className={`headline ${styles.trustHeadline}`}>
            Licensed once. Yours for good.
          </h2>
          <p className="body-text" style={{ maxWidth: 560, margin: "0 auto 24px" }}>
            Every Quadra license is a single purchase with lifetime updates —
            hardware-bound activation that works fully offline, once activated.
          </p>
          <Link href="/hydra#faq" className="apple-button-secondary">
            Learn about licensing &gt;
          </Link>
        </div>
      </section>
    </div>
  );
}
