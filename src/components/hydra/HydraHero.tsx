"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PatchbayField } from "@/components/three/PatchbayField";
import { HYDRA } from "@/data/hydra.landing";
import styles from "./HydraHero.module.scss";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-bleed MATRIX hero: living patch field + brand statement,
 * then product UI plane with scroll-driven scale.
 */
export function HydraHero() {
  const [revealed, setRevealed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { scale: 0.88, opacity: 0.55 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top 92%",
            end: "top 28%",
            scrub: 0.55,
          },
        },
      );
    }, stage);

    return () => ctx.revert();
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

      <div
        ref={stageRef}
        className={`${styles.productStage} ${revealed ? styles.revealed : ""}`}
      >
        <div ref={frameRef} className={`${styles.stageFrame} ${styles.in5}`}>
          <Image
            src={HYDRA.heroMedia.src}
            alt={HYDRA.heroMedia.alt}
            width={1536}
            height={1024}
            priority
            sizes="100vw"
            className={styles.stageImage}
          />
        </div>
      </div>
    </section>
  );
}
