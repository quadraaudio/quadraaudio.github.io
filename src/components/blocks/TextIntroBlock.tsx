"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TextIntroBlock.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TextIntroBlockProps {
  primaryText: string;
  secondaryText: string;
}

export default function TextIntroBlock({ primaryText, secondaryText }: TextIntroBlockProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current, 
        { y: 60, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <section className={styles.introTextSection}>
      <h2 className="typography-intro" ref={textRef}>
        {primaryText} <span className={styles.secondaryText}>{secondaryText}</span>
      </h2>
    </section>
  );
}
