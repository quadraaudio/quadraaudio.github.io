"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PromoGridBlock.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PromoLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface PromoGridItem {
  id: string;
  headline: React.ReactNode;
  subheadline: React.ReactNode;
  links?: PromoLink[];
  mediaClass?: string;
  lightText?: boolean;
}

export interface PromoGridBlockProps {
  items: PromoGridItem[];
}

export default function PromoGridBlock({ items }: PromoGridBlockProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const q = gsap.utils.selector(gridRef);
      const elements = q(".animate-grid-promo");
      
      elements.forEach((el) => {
        gsap.fromTo(el, 
          { y: 30, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }
  }, []);

  return (
    <section className={styles.promoGrid} ref={gridRef}>
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`${styles.promoBox} ${item.mediaClass || ''} ${item.lightText ? styles.lightText : styles.darkText}`}
        >
          <div className={`${styles.promoContent} animate-grid-promo`}>
            <h2 className="typography-intro">{item.headline}</h2>
            <p className="typography-body">{item.subheadline}</p>
            
            {item.links && item.links.length > 0 && (
              <div className={styles.ctaGroup}>
                {item.links.map((link, i) => (
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
        </div>
      ))}
    </section>
  );
}
