"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroBlock.module.scss";

// Register ScrollTrigger so animations work
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroBlockProps {
  headline: React.ReactNode;
  mediaPlaceholderClass?: string; // We'll pass the CSS module class for the placeholder background
}

export default function HeroBlock({ headline, mediaPlaceholderClass }: HeroBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const q = gsap.utils.selector(containerRef);
      const elements = q(".animate-hero");
      
      elements.forEach((el) => {
        gsap.fromTo(el, 
          { y: 60, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
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
    <div className={styles.heroSection} ref={containerRef}>
      <div className={`${styles.heroTextContainer} animate-hero`}>
        <h1 className="typography-headline">{headline}</h1>
      </div>
      <div className={`${styles.heroMediaContainer} animate-hero`}>
        <div className={`${styles.mediaPlaceholder} ${mediaPlaceholderClass || ""}`}></div>
      </div>
    </div>
  );
}
