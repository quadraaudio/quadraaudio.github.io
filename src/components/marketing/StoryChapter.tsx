"use client";

import type { ReactNode } from "react";
import styles from "./StoryChapter.module.scss";

export interface StoryChapterViewProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  body: ReactNode;
  mediaSrc?: string;
  mediaGradient?: string;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
}

export default function StoryChapterView({
  eyebrow,
  title,
  body,
  mediaSrc,
  mediaGradient = "radial-gradient(circle at 30% 50%, #1c2430 0%, #0a0a0c 70%)",
  align = "left",
  theme = "dark",
}: StoryChapterViewProps) {
  return (
    <section className={styles.chapter} data-theme={theme}>
      <div
        className={styles.media}
        style={{ backgroundImage: mediaGradient }}
        aria-hidden
      >
        {mediaSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaSrc} alt="" className={styles.mediaImage} />
        ) : null}
        <div className={styles.mediaGlass} />
      </div>

      <div className={`${styles.copy} ${styles[`align_${align}`]}`}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.body}>{body}</div>
      </div>
    </section>
  );
}
