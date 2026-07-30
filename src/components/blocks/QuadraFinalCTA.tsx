"use client";

import styles from "./quadra.module.scss";

export interface QuadraFinalCTAProps {
  headline?: string;
  subheadline?: string;
  priceText?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function QuadraFinalCTA({
  headline = "Upgrade your audio engine today.",
  subheadline = "Perpetual license, instant download, and a year of updates.",
  priceText = "$199.99",
  buttonText = "Buy Hydra",
  buttonLink = "/store",
}: QuadraFinalCTAProps) {
  return (
    <section className={styles.finalCta}>
      <div className={styles.finalInner}>
        <h2 className={styles.finalHeadline}>{headline}</h2>
        <p className={styles.finalSub}>{subheadline}</p>
        {priceText ? <p className={styles.finalPrice}>{priceText}</p> : null}
        <a className={styles.btnPrimary} href={buttonLink}>
          {buttonText}
        </a>
      </div>
    </section>
  );
}
