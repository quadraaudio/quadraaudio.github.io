"use client";

import Link from "next/link";
import { PatchbayField } from "@/components/three/PatchbayField";
import { HYDRA } from "@/data/hydra.landing";
import styles from "./HydraHero.module.scss";

/**
 * First viewport — living patchbay as full-bleed atmosphere behind the copy,
 * same continuity pattern as the Quadra home hero (not a framed media card).
 */
export function HydraHero() {
  return (
    <section id="overview" className={styles.hero}>
      <div className={styles.heroVisual} aria-hidden>
        <div className={styles.heroGlow} />
        <PatchbayField
          fallbackSrc={HYDRA.heroMedia.src}
          fallbackAlt={HYDRA.heroMedia.alt}
        />
        <div className={styles.heroShade} />
      </div>

      <div className={styles.copy}>
        <p className={`${styles.productName} ${styles.in1}`}>{HYDRA.name}</p>
        <h1 className={`${styles.headline} ${styles.in2}`}>{HYDRA.headline}</h1>
        <p className={`${styles.lede} ${styles.in3}`}>{HYDRA.lede}</p>
        <div className={`${styles.ctaRow} ${styles.in4}`}>
          <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
            {HYDRA.ctaPrimary.label}
          </Link>
          <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
            {HYDRA.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
