"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./PromoHeroBlock.module.scss";

export interface PromoLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface PromoHeroBlockProps {
  headline: React.ReactNode;
  subheadline: React.ReactNode;
  links?: PromoLink[];
  mediaClass?: string;
}

export default function PromoHeroBlock({ headline, subheadline, links, mediaClass }: PromoHeroBlockProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      const q = gsap.utils.selector(heroRef);
      gsap.fromTo(q(".animate-promo"), 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  return (
    <section className={`${styles.promoHero} ${mediaClass || ''}`} ref={heroRef}>
      <div className={styles.promoContent}>
        <h1 className="typography-headline animate-promo">{headline}</h1>
        <p className="typography-intro animate-promo">{subheadline}</p>
        
        {links && links.length > 0 && (
          <div className={`${styles.ctaGroup} animate-promo`}>
            {links.map((link, i) => (
              <Link 
                key={i} 
                href={link.href} 
                className={link.primary ? styles.primaryButton : styles.linkButton}
              >
                {link.label} {link.primary ? '' : '>'}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
