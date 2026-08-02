"use client";

import Link from "next/link";
import { MatrixFade } from "@/components/motion/MatrixFade";
import { HydraHero } from "@/components/hydra/HydraHero";
import { HydraMedia } from "@/components/hydra/HydraMedia";
import {
  HYDRA,
  HYDRA_CHAPTERS,
  HYDRA_SPECS,
} from "@/data/hydra.landing";
import styles from "./HydraMicrosite.module.scss";

export function HydraMicrosite() {
  return (
    <main className={styles.main}>
      <HydraHero />

      {HYDRA_CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterFlip : ""}`}
        >
          <div className={styles.chapterIntro}>
            <MatrixFade>
              <p className={styles.eyebrow}>{chapter.eyebrow}</p>
              <h2 className={styles.chapterTitle}>{chapter.title}</h2>
              <p className={styles.lede}>{chapter.body}</p>
            </MatrixFade>
          </div>

          <MatrixFade delay={80} className={styles.mediaBleed}>
            <HydraMedia media={chapter.media} />
          </MatrixFade>

          <div className={styles.featureRow}>
            {chapter.subfeatures.map((sub, si) => (
              <MatrixFade key={sub.title} delay={si * 60}>
                <div className={styles.feature}>
                  <h3>{sub.title}</h3>
                  <p>{sub.body}</p>
                </div>
              </MatrixFade>
            ))}
          </div>
        </section>
      ))}

      <section id="specs" className={styles.specs}>
        <div className={styles.specsIntro}>
          <MatrixFade>
            <p className={styles.eyebrow}>Tech Specs</p>
            <h2 className={styles.chapterTitle}>Built for macOS.</h2>
            <p className={styles.lede}>
              MATRIX Start {HYDRA.version}. Requires {HYDRA.platform}.
            </p>
          </MatrixFade>
        </div>
        <dl className={styles.specList}>
          {HYDRA_SPECS.map((spec, i) => (
            <MatrixFade key={spec.label} delay={i * 30}>
              <div className={styles.specRow}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            </MatrixFade>
          ))}
        </dl>
      </section>

      <section className={styles.close}>
        <MatrixFade>
          <p className={styles.productName}>{HYDRA.brandLine}</p>
          <h2 className={styles.closeTitle}>Authorize. Patch. Monitor.</h2>
          <p className={styles.lede}>
            14-day full trial on the web. Activate this Mac with your Quadra ID —
            or import a signed .qkey offline.
          </p>
          <div className={styles.ctaRow}>
            <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
              {HYDRA.ctaPrimary.label}
            </Link>
            <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
              {HYDRA.ctaSecondary.label}
            </Link>
          </div>
        </MatrixFade>
      </section>
    </main>
  );
}
