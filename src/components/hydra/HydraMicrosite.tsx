"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { HydraHero } from "@/components/hydra/HydraHero";
import { HydraMedia } from "@/components/hydra/HydraMedia";
import {
  HYDRA,
  HYDRA_CHAPTERS,
  HYDRA_HIGHLIGHTS,
  HYDRA_SPECS,
} from "@/data/hydra.landing";
import styles from "./HydraMicrosite.module.scss";

export function HydraMicrosite() {
  return (
    <main className={styles.main}>
      <HydraHero />

      {/* Highlight rail */}
      <section className={styles.highlights} aria-label="Hydra highlights">
        <div className={styles.shell}>
          <div className={styles.highlightGrid}>
            {HYDRA_HIGHLIGHTS.map((item) => (
              <a key={item.href} href={item.href} className={styles.highlightCard}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature chapters — Apple one-job sections */}
      {HYDRA_CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterAlt : ""}`}
        >
          <div className={styles.shell}>
            <Reveal>
              <header className={styles.chapterHeader}>
                <p className={styles.eyebrow}>{chapter.eyebrow}</p>
                <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                <p className={styles.chapterBody}>{chapter.body}</p>
              </header>
            </Reveal>

            <Reveal y={48}>
              <HydraMedia media={chapter.media} large />
            </Reveal>

            <div className={styles.subGrid}>
              {chapter.subfeatures.map((sub) => (
                <Reveal key={sub.title}>
                  <article className={styles.subCard}>
                    <h3>{sub.title}</h3>
                    <p>{sub.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Tech specs — Apple utility block */}
      <section id="specs" className={styles.specs}>
        <div className={styles.shellNarrow}>
          <Reveal>
            <p className={styles.eyebrow}>Tech Specs</p>
            <h2 className={styles.chapterTitle}>Built for macOS.</h2>
            <p className={styles.chapterBody}>
              Hydra {HYDRA.version}. Requires {HYDRA.platform}.
            </p>
          </Reveal>
          <dl className={styles.specList}>
            {HYDRA_SPECS.map((spec) => (
              <div key={spec.label} className={styles.specRow}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Close */}
      <section className={styles.close}>
        <div className={styles.shellNarrow}>
          <Reveal>
            <p className={styles.productNameSm}>{HYDRA.name}</p>
            <h2 className={styles.closeTitle}>Get Hydra for your room.</h2>
            <p className={styles.chapterBody}>
              Contact Quadra for access. Activate on your machine when you are
              ready.
            </p>
            <div className={styles.ctaRowCenter}>
              <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
                {HYDRA.ctaPrimary.label}
              </Link>
              <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
                {HYDRA.ctaSecondary.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
