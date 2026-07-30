"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./quadra.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface QuadraScrollChapterProps {
  chapterNumber?: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
}

export function QuadraScrollChapter({
  chapterNumber = "01",
  title,
  subtitle,
  description,
  imageUrl = "/images/home_store_grid.jpg",
}: QuadraScrollChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-chapter-copy]",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        "[data-chapter-media]",
        { opacity: 0, scale: 1.04 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.chapter} ref={sectionRef}>
      <div className={styles.chapterInner}>
        <div data-chapter-copy>
          {chapterNumber ? (
            <p className={styles.chapterIndex}>Chapter {chapterNumber}</p>
          ) : null}
          <h2 className={styles.chapterTitle}>{title}</h2>
          <h3 className={styles.chapterSubtitle}>{subtitle}</h3>
          <p className={styles.chapterBody}>{description}</p>
        </div>
        {imageUrl ? (
          <div className={styles.chapterMedia} data-chapter-media>
            <img src={imageUrl} alt="" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
