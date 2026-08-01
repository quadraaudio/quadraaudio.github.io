"use client";

import Link from "next/link";
import { MatrixFade } from "@/components/motion/MatrixFade";
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

      <section className={styles.highlights} aria-label="MATRIX highlights">
        <div className={styles.shell}>
          <div className={styles.highlightGrid}>
            {HYDRA_HIGHLIGHTS.map((item, i) => (
              <MatrixFade key={item.href} delay={i * 40}>
                <a href={item.href} className={styles.highlightCard}>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </a>
              </MatrixFade>
            ))}
          </div>
        </div>
      </section>

      {HYDRA_CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterAlt : ""}`}
        >
          <div className={styles.shell}>
            <MatrixFade>
              <header className={styles.chapterHeader}>
                <p className={styles.eyebrow}>{chapter.eyebrow}</p>
                <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                <p className={styles.chapterBody}>{chapter.body}</p>
              </header>
            </MatrixFade>

            <MatrixFade delay={60}>
              <div className={styles.mediaWell}>
                <HydraMedia media={chapter.media} large />
              </div>
            </MatrixFade>

            <div className={styles.subGrid}>
              {chapter.subfeatures.map((sub, si) => (
                <MatrixFade key={sub.title} delay={si * 50}>
                  <article className={styles.subCard}>
                    <h3>{sub.title}</h3>
                    <p>{sub.body}</p>
                  </article>
                </MatrixFade>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section id="specs" className={styles.specs}>
        <div className={styles.shellNarrow}>
          <MatrixFade>
            <p className={styles.eyebrow}>Tech Specs</p>
            <h2 className={styles.chapterTitle}>Built for macOS.</h2>
            <p className={styles.chapterBody}>
              MATRIX Start {HYDRA.version}. Requires {HYDRA.platform}.
            </p>
          </MatrixFade>
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

      <section className={styles.close}>
        <div className={styles.shellNarrow}>
          <MatrixFade>
            <p className={styles.productNameSm}>{HYDRA.brandLine}</p>
            <h2 className={styles.closeTitle}>Authorize. Patch. Monitor.</h2>
            <p className={styles.chapterBody}>
              14-day full trial on the web. Activate this Mac with your Quadra ID —
              or import a signed .qkey offline.
            </p>
            <div className={styles.ctaRowCenter}>
              <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
                {HYDRA.ctaPrimary.label}
              </Link>
              <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
                {HYDRA.ctaSecondary.label}
              </Link>
            </div>
          </MatrixFade>
        </div>
      </section>
    </main>
  );
}
