"use client";

import React, { useRef, useState, useCallback } from "react";
import styles from "./CarouselBlock.module.scss";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  mediaClass?: string;
}

export interface CarouselBlockProps {
  headline?: React.ReactNode;
  intro?: React.ReactNode;
  items: CarouselItem[];
}

export default function CarouselBlock({ headline, intro, items }: CarouselBlockProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const SCROLL_AMOUNT = 460;

  const checkBounds = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 4);
  }, []);

  const scrollPrev = () => {
    trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const scrollNext = () => {
    trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <section className={styles.carouselSection}>
      <div className={styles.sectionHeader}>
        {headline && <h2 className="typography-headline">{headline}</h2>}
        {intro && <p className="typography-intro">{intro}</p>}
      </div>

      <div className={styles.carouselWrapper}>
        <div
          className={styles.carouselTrack}
          ref={trackRef}
          onScroll={checkBounds}
        >
          {/* Leading spacer: aligns first card with the 980px text column */}
          <div aria-hidden="true" className={styles.carouselSpacer} />

          {items.map((item) => (
            <div className={styles.carouselCard} key={item.id}>
              <div className={`${styles.cardMedia} ${item.mediaClass || ""}`} />
              <div className={styles.cardText}>
                <strong>{item.title}.</strong> {item.description}
              </div>
            </div>
          ))}

          {/* Trailing spacer: mirrors the leading spacer */}
          <div aria-hidden="true" className={styles.carouselSpacer} />
        </div>
      </div>

      <div className={styles.carouselControls}>
        <button
          className={`${styles.controlBtn} ${atStart ? styles.controlBtnDisabled : ""}`}
          onClick={scrollPrev}
          aria-label="Previous"
          disabled={atStart}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          className={`${styles.controlBtn} ${atEnd ? styles.controlBtnDisabled : ""}`}
          onClick={scrollNext}
          aria-label="Next"
          disabled={atEnd}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
