"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PatchbayField } from "@/components/three/PatchbayField";
import { HYDRA } from "@/data/hydra.landing";
import styles from "./HydraHero.module.scss";

/**
 * First-viewport Apple-style hero: staggered type + living patchbay stage.
 * Swap in muted looping video later via HYDRA.heroMedia + videoSrc when ready.
 */
export function HydraHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        root.querySelectorAll("[data-hero-in]"),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 },
      ).fromTo(
        root.querySelector("[data-hero-stage]"),
        { autoAlpha: 0, y: 40, scale: 1.06 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.15, ease: "power2.out" },
        "-=0.45",
      );

      gsap.to(root.querySelector("[data-hero-stage-inner]"), {
        y: -10,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" className={styles.hero} ref={rootRef}>
      <div className={styles.copy}>
        <p className={styles.productName} data-hero-in>
          {HYDRA.name}
        </p>
        <h1 className={styles.headline} data-hero-in>
          {HYDRA.headline}
        </h1>
        <p className={styles.lede} data-hero-in>
          {HYDRA.lede}
        </p>
        <div className={styles.ctaRow} data-hero-in>
          <Link href={HYDRA.ctaPrimary.href} className={styles.btnPrimary}>
            {HYDRA.ctaPrimary.label}
          </Link>
          <Link href={HYDRA.ctaSecondary.href} className={styles.btnGhost}>
            {HYDRA.ctaSecondary.label}
          </Link>
        </div>
      </div>

      <div className={styles.stageWrap} data-hero-stage>
        <div className={styles.stage} data-hero-stage-inner>
          <div className={styles.stageGlow} aria-hidden />
          <PatchbayField />
          <div className={styles.stageShade} aria-hidden />
        </div>
      </div>
    </section>
  );
}
