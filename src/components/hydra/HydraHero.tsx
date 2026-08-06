"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PatchbayField } from "@/components/three/PatchbayField";
import { HYDRA } from "@/data/hydra.landing";
import styles from "./HydraHero.module.scss";

gsap.registerPlugin(ScrollTrigger);

/**
 * Single hero composition: brand + statement over a living full-bleed field.
 * No second boxed animation — scroll carries into chapters.
 */
export function HydraHero() {
  const [revealed, setRevealed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

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
    const hero = heroRef.current;
    const field = fieldRef.current;
    const shade = shadeRef.current;
    if (!hero || !field) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(field, {
        scale: 1.12,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      if (shade) {
        gsap.to(shade, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "center top",
            end: "bottom top",
            scrub: 0.4,
          },
        });
      }
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={heroRef} className={styles.hero}>
      <div className={styles.firstView}>
        <div className={styles.atmosphere} aria-hidden>
          <div ref={fieldRef} className={styles.patchLayer}>
            <PatchbayField />
          </div>
          <div ref={shadeRef} className={styles.shade} />
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
    </section>
  );
}
