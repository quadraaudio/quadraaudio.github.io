"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PatchbayField } from "@/components/three/PatchbayField";
import { HYDRA } from "@/data/hydra.landing";
import styles from "./HydraHero.module.scss";

/**
 * Logic-style hero: statement typography over living field,
 * then the product UI as the dominant stage below the first view.
 */
export function HydraHero() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }
    const t = window.setTimeout(() => setRevealed(true), 60);
    const failsafe = window.setTimeout(() => setRevealed(true), 1200);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <section id="overview" className={styles.hero}>
      <div className={styles.firstView}>
        <div className={styles.atmosphere} aria-hidden>
          <div className={styles.patchLayer}>
            <PatchbayField
              fallbackSrc={HYDRA.heroMedia.src}
              fallbackAlt={HYDRA.heroMedia.alt}
            />
          </div>
          <div className={styles.shade} />
        </div>

        <div className={`${styles.masthead} ${revealed ? styles.revealed : ""}`}>
          <p className={`${styles.productName} ${styles.in1}`}>{HYDRA.brandLine}</p>
          <h1 className={`${styles.headline} ${styles.in2}`}>{HYDRA.headline}</h1>
          <p className={`${styles.lede} ${styles.in3}`}>{HYDRA.lede}</p>
          <div className={`${styles.ctaRow} ${styles.in4}`}>
            <Link href={HYDRA.ctaPrimary.href} className={styles.ctaBuy}>
              {HYDRA.ctaPrimary.label}
            </Link>
            <Link href={HYDRA.ctaSecondary.href} className={styles.ctaTrial}>
              {HYDRA.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </div>

      <div className={`${styles.productStage} ${revealed ? styles.revealed : ""}`}>
        <div className={`${styles.stageFrame} ${styles.in5}`}>
          <Image
            src={HYDRA.heroMedia.src}
            alt={HYDRA.heroMedia.alt}
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 900px) 100vw, 1200px"
            className={styles.stageImage}
          />
        </div>
      </div>
    </section>
  );
}
