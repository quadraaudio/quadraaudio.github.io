"use client";

import styles from "./quadra.module.scss";

export interface QuadraFeatureBandProps {
  tagline?: string;
  title: string;
  body: string;
  layout?: "imageLeft" | "imageRight";
  imageUrl?: string;
}

export function QuadraFeatureBand({
  tagline,
  title,
  body,
  layout = "imageRight",
  imageUrl = "/images/home_support_grid.jpg",
}: QuadraFeatureBandProps) {
  return (
    <section className={styles.feature}>
      <div
        className={`${styles.featureInner} ${layout === "imageLeft" ? styles.flip : ""}`}
      >
        <div>
          {tagline ? <p className={styles.featureTag}>{tagline}</p> : null}
          <h2 className={styles.featureTitle}>{title}</h2>
          <p className={styles.featureBody}>{body}</p>
        </div>
        {imageUrl ? (
          <div className={styles.featureMedia}>
            <img src={imageUrl} alt="" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
