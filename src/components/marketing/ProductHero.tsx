"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./ProductHero.module.scss";

export interface ProductHeroViewProps {
  brand: ReactNode;
  headline: ReactNode;
  subheadline: ReactNode;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  mediaSrc?: string;
  mediaAlt?: string;
  mediaGradient?: string;
  theme?: "light" | "dark";
}

export default function ProductHeroView({
  brand,
  headline,
  subheadline,
  primaryCtaLabel = "Learn more",
  primaryCtaHref = "/hydra/",
  secondaryCtaLabel = "Try Free",
  secondaryCtaHref = "/store/",
  mediaSrc,
  mediaAlt = "",
  mediaGradient = "radial-gradient(ellipse 80% 60% at 50% 40%, #1a1a1e 0%, #050506 55%, #000 100%)",
  theme = "dark",
}: ProductHeroViewProps) {
  return (
    <section className={styles.hero} data-theme={theme} aria-label="Product hero">
      <div
        className={styles.mediaPlane}
        style={{ backgroundImage: mediaGradient }}
        aria-hidden={!mediaSrc}
      >
        {mediaSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.mediaImage} src={mediaSrc} alt={mediaAlt} />
        ) : null}
        <div className={styles.mediaVeil} />
      </div>

      <div className={styles.copy}>
        <h1 className={styles.brand}>{brand}</h1>
        <div className={styles.headline}>{headline}</div>
        <div className={styles.subheadline}>{subheadline}</div>
        <div className={styles.ctas}>
          {primaryCtaLabel ? (
            <Link href={primaryCtaHref || "#"} className={styles.ctaPrimary}>
              {primaryCtaLabel}
            </Link>
          ) : null}
          {secondaryCtaLabel ? (
            <Link href={secondaryCtaHref || "#"} className={styles.ctaLink}>
              {secondaryCtaLabel}
              <span aria-hidden> ›</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
