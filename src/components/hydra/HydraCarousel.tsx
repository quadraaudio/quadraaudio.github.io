"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HYDRA_CHAPTERS } from "@/data/hydra.landing";
import styles from "./HydraCarousel.module.scss";

type Chapter = (typeof HYDRA_CHAPTERS)[number];

export function HydraCarousel({
  items,
  onLearnMore,
}: {
  items: readonly Chapter[];
  onLearnMore: (item: Chapter) => void;
}) {
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);
  const item = items[index];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pauseRef.current) return;
      setIndex((i) => (i + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (!item) return null;

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
    >
      <div className={styles.tabs} role="tablist" aria-label="Hydra capabilities">
        {items.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? styles.tabActive : styles.tab}
            onClick={() => setIndex(i)}
          >
            {entry.eyebrow}
          </button>
        ))}
      </div>

      <article className={styles.stage} key={item.id}>
        <div className={styles.media}>
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 920px"
            className={styles.image}
            priority={index === 0}
          />
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{item.eyebrow}</p>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <button
            type="button"
            className={styles.learn}
            onClick={() => onLearnMore(item)}
          >
            Learn more
          </button>
        </div>
      </article>

      <div className={styles.dots}>
        {items.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            aria-label={`Show ${entry.eyebrow}`}
            className={i === index ? styles.dotActive : styles.dot}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
