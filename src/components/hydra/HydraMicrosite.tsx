"use client";

import Link from "next/link";
import { MatrixFade } from "@/components/motion/MatrixFade";
import { HydraHero } from "@/components/hydra/HydraHero";
import { MatrixChapterPin } from "@/components/hydra/MatrixChapterPin";
import {
  MatrixChapterVisual,
  type MatrixVisualVariant,
} from "@/components/three/MatrixChapterVisual";
import {
  HYDRA,
  HYDRA_CAPABILITIES,
  HYDRA_CHAPTERS,
  HYDRA_SPECS,
  type HydraChapter,
} from "@/data/hydra.landing";
import styles from "./HydraMicrosite.module.scss";

function DisplayTitle({
  title,
  className = styles.display,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2 className={className}>
      {title.split("\n").map((line) => (
        <span key={line} className={styles.titleLine}>
          {line}
        </span>
      ))}
    </h2>
  );
}

function FeatureStrip({ chapter }: { chapter: HydraChapter }) {
  return (
    <div className={styles.features}>
      {chapter.subfeatures.map((sub) => (
        <div key={sub.title} className={styles.feature}>
          <h3>{sub.title}</h3>
          <p>{sub.body}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * One immersive chapter: full-bleed scroll-driven visual behind copy.
 * No media card / GIF frame — the scene IS the section.
 */
function ImmersiveChapter({ chapter }: { chapter: HydraChapter }) {
  const variant = chapter.id as MatrixVisualVariant;

  return (
    <section
      id={chapter.id}
      className={`${styles.chapter} ${styles.chapterPin} ${styles.immersive}`}
    >
      <MatrixChapterPin>
        <div data-mx-scene className={styles.pinScene}>
          <div data-mx-visual className={styles.visualBleed} aria-hidden>
            <MatrixChapterVisual variant={variant} label={chapter.media.alt} />
          </div>

          <div className={styles.overlay}>
            <div data-mx-copy className={styles.statement}>
              <p className={styles.eyebrow}>{chapter.eyebrow}</p>
              <DisplayTitle title={chapter.title} />
              <p className={styles.lede}>{chapter.body}</p>
            </div>
            <div data-mx-features className={styles.featureWrap}>
              <FeatureStrip chapter={chapter} />
            </div>
          </div>
        </div>
      </MatrixChapterPin>
    </section>
  );
}

export function HydraMicrosite() {
  return (
    <main className={styles.main}>
      <HydraHero />

      <nav className={styles.capabilities} aria-label="MATRIX capabilities">
        <div className={styles.capTrack}>
          {HYDRA_CAPABILITIES.map((item) => (
            <a key={item.href} href={item.href} className={styles.capLink}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {HYDRA_CHAPTERS.map((chapter) => (
        <ImmersiveChapter key={chapter.id} chapter={chapter} />
      ))}

      <section id="specs" className={styles.specs}>
        <MatrixFade>
          <p className={styles.eyebrow}>Tech Specs</p>
          <DisplayTitle title={"Built for\nmacOS."} className={styles.displaySm} />
        </MatrixFade>
        <dl className={styles.specList}>
          {HYDRA_SPECS.map((spec) => (
            <div key={spec.label} className={styles.specRow}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.close}>
        <MatrixFade>
          <p className={styles.closeProduct}>{HYDRA.brandLine}</p>
          <DisplayTitle title={"Authorize. Patch.\nMonitor."} />
          <p className={styles.lede}>{HYDRA.closeLede}</p>
          <div className={styles.closeCtas}>
            <Link href={HYDRA.ctaPrimary.href} className={styles.ctaBuy}>
              {HYDRA.ctaPrimary.label}
            </Link>
            <Link href={HYDRA.ctaSecondary.href} className={styles.ctaTrial}>
              {HYDRA.ctaSecondary.label}
            </Link>
          </div>
        </MatrixFade>
      </section>
    </main>
  );
}
