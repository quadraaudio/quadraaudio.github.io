"use client";

import Link from "next/link";
import { MatrixFade } from "@/components/motion/MatrixFade";
import { HydraHero } from "@/components/hydra/HydraHero";
import { HydraMedia } from "@/components/hydra/HydraMedia";
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
      {chapter.subfeatures.map((sub, si) => (
        <MatrixFade key={sub.title} delay={si * 50}>
          <div className={styles.feature}>
            <h3>{sub.title}</h3>
            <p>{sub.body}</p>
          </div>
        </MatrixFade>
      ))}
    </div>
  );
}

function MediaStage({
  chapter,
  className = "",
}: {
  chapter: HydraChapter;
  className?: string;
}) {
  return (
    <div className={`${styles.mediaStage} ${className}`.trim()}>
      <HydraMedia media={chapter.media} className={styles.shot} />
    </div>
  );
}

function ChapterStage({ chapter }: { chapter: HydraChapter }) {
  return (
    <section id={chapter.id} className={`${styles.chapter} ${styles.layoutStage}`}>
      <div className={styles.statement}>
        <MatrixFade>
          <p className={styles.eyebrow}>{chapter.eyebrow}</p>
          <DisplayTitle title={chapter.title} />
          <p className={styles.lede}>{chapter.body}</p>
        </MatrixFade>
      </div>
      <MatrixFade delay={90} className={styles.mediaBleed}>
        <MediaStage chapter={chapter} />
      </MatrixFade>
      <FeatureStrip chapter={chapter} />
    </section>
  );
}

function ChapterSplit({ chapter }: { chapter: HydraChapter }) {
  return (
    <section id={chapter.id} className={`${styles.chapter} ${styles.layoutSplit}`}>
      <div className={styles.splitGrid}>
        <div className={styles.splitCopy}>
          <MatrixFade>
            <p className={styles.eyebrow}>{chapter.eyebrow}</p>
            <DisplayTitle title={chapter.title} />
            <p className={styles.lede}>{chapter.body}</p>
          </MatrixFade>
          <div className={styles.splitFeatures}>
            <FeatureStrip chapter={chapter} />
          </div>
        </div>
        <MatrixFade delay={100} className={styles.splitMedia}>
          <MediaStage chapter={chapter} />
        </MatrixFade>
      </div>
    </section>
  );
}

function ChapterInvert({ chapter }: { chapter: HydraChapter }) {
  return (
    <section id={chapter.id} className={`${styles.chapter} ${styles.layoutInvert}`}>
      <MatrixFade className={styles.mediaBleed}>
        <MediaStage chapter={chapter} />
      </MatrixFade>
      <div className={styles.statement}>
        <MatrixFade delay={80}>
          <p className={styles.eyebrow}>{chapter.eyebrow}</p>
          <DisplayTitle title={chapter.title} />
          <p className={styles.lede}>{chapter.body}</p>
        </MatrixFade>
      </div>
      <FeatureStrip chapter={chapter} />
    </section>
  );
}

function ChapterBlock({ chapter }: { chapter: HydraChapter }) {
  switch (chapter.layout) {
    case "split":
      return <ChapterSplit chapter={chapter} />;
    case "invert":
      return <ChapterInvert chapter={chapter} />;
    default:
      return <ChapterStage chapter={chapter} />;
  }
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
        <ChapterBlock key={chapter.id} chapter={chapter} />
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
          <p className={styles.lede}>
            14-day full trial on the web. Activate this Mac with your Quadra ID —
            or import a signed .qkey offline.
          </p>
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
