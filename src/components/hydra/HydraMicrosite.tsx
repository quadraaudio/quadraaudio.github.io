"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  HYDRA,
  HYDRA_CHAPTERS,
  HYDRA_CONTROL,
  HYDRA_SPECS,
} from "@/data/hydra.landing";
import styles from "./HydraMicrosite.module.scss";

export function HydraMicrosite() {
  return (
    <main className={styles.main}>
      <section id="overview" className={styles.hero}>
        <div className={styles.heroVisual} aria-hidden>
          <Image
            src="/hydra/hero-studio.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroShade} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.brand}>{HYDRA.name}</p>
          <h1 className={styles.headline}>{HYDRA.headline}</h1>
          <p className={styles.lede}>{HYDRA.lede}</p>
          <div className={styles.ctaRow}>
            <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
              {HYDRA.ctaPrimary.label}
            </Link>
            <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
              {HYDRA.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </section>

      {HYDRA_CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterFlip : ""}`}
        >
          <div className={styles.chapterMedia}>
            <Image
              src={chapter.image}
              alt={chapter.imageAlt}
              fill
              sizes="100vw"
              className={styles.chapterImage}
            />
            <div className={styles.chapterShade} />
          </div>
          <div className={styles.chapterCopy}>
            <Reveal>
              <p className={styles.eyebrow}>{chapter.eyebrow}</p>
              <h2 className={styles.chapterTitle}>{chapter.title}</h2>
              <p className={styles.chapterBody}>{chapter.body}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className={styles.control} aria-labelledby="control-title">
        <div className={styles.controlInner}>
          <Reveal>
            <p className={styles.eyebrow}>{HYDRA_CONTROL.eyebrow}</p>
            <h2 id="control-title" className={styles.chapterTitle}>
              {HYDRA_CONTROL.title}
            </h2>
            <p className={styles.chapterBody}>{HYDRA_CONTROL.body}</p>
          </Reveal>
        </div>
      </section>

      <section id="specs" className={styles.specs}>
        <div className={styles.specsInner}>
          <Reveal>
            <p className={styles.eyebrow}>System</p>
            <h2 className={styles.chapterTitle}>Built for macOS.</h2>
          </Reveal>
          <dl className={styles.specList}>
            {HYDRA_SPECS.map((spec) => (
              <Reveal key={spec.label}>
                <div className={styles.specRow}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section id="get" className={styles.close}>
        <div className={styles.closeInner}>
          <Reveal>
            <p className={styles.brand}>{HYDRA.name}</p>
            <h2 className={styles.closeTitle}>Ready for your room.</h2>
            <p className={styles.lede}>
              Talk to Quadra for access and activation. Licenses are bound to
              your machine after you activate.
            </p>
            <div className={styles.ctaRow}>
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

      <footer className={styles.footer}>
        <p>
          <Link href="/">Quadra</Link>
          <span aria-hidden>·</span>
          <span>
            {HYDRA.name} {HYDRA.version}
          </span>
          <span aria-hidden>·</span>
          <span>{HYDRA.platform}</span>
        </p>
      </footer>
    </main>
  );
}
