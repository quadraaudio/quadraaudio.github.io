"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PatchbayField } from "@/components/three/PatchbayField";
import { HYDRA } from "@/data/hydra.landing";
import styles from "./HydraHero.module.scss";

/**
 * Matrix dark hero — living PatchbayField + staggered copy enter.
 */
export function HydraHero() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }
    const t = window.setTimeout(() => setRevealed(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section id="overview" className={styles.hero}>
      <div className={styles.atmosphere} aria-hidden>
        <div className={styles.glow} />
        <div className={styles.patchLayer}>
          <PatchbayField
            fallbackSrc={HYDRA.heroMedia.src}
            fallbackAlt={HYDRA.heroMedia.alt}
          />
        </div>
        <div className={styles.shade} />
      </div>

      <div className={`${styles.copy} ${revealed ? styles.revealed : ""}`}>
        <div className={`${styles.brandRow} ${styles.in1}`}>
          <Image
            src={HYDRA.brandMark}
            alt=""
            width={72}
            height={72}
            className={styles.brandMark}
            priority
          />
          <p className={styles.productName}>{HYDRA.brandLine}</p>
        </div>
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
