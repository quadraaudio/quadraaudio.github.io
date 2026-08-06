"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollCue.module.scss";

type Props = {
  label?: string;
  /** Hide after the user scrolls past this Y (px). */
  hideAfter?: number;
  className?: string;
};

/**
 * Soft “scroll to explore” cue for full-viewport heroes.
 */
export function ScrollCue({
  label = "Scroll",
  hideAfter = 48,
  className = "",
}: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > hideAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideAfter]);

  return (
    <div
      className={`${styles.cue} ${hidden ? styles.hidden : ""} ${className}`.trim()}
      aria-hidden={hidden || undefined}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.chevron} />
    </div>
  );
}
