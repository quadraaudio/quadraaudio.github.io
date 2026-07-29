"use client";

import React from "react";
import styles from "./GridBlock.module.scss";

export interface GridItem {
  id: string;
  title: string;
  description: string;
  mediaClass?: string;
}

export interface GridBlockProps {
  headline?: React.ReactNode;
  items: GridItem[];
  columns?: 2 | 3 | 4; // Allow flexibility for different grid sizes
}

export default function GridBlock({ headline, items, columns = 2 }: GridBlockProps) {
  return (
    <section className={styles.gridSection}>
      {headline && (
        <div className={styles.gridHeader}>
          <h2 className="typography-headline">{headline}</h2>
        </div>
      )}
      <div 
        className={styles.gridContainer} 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {items.map((item) => (
          <div className={styles.gridBox} key={item.id}>
            <div className={styles.gridBoxText}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className={`${styles.gridBoxMedia} ${item.mediaClass || ""}`}></div>
          </div>
        ))}
      </div>
    </section>
  );
}
