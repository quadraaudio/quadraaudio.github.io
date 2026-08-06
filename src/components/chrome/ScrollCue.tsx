"use client";

import { useEffect, useState } from "react";
import { getLenis } from "@/lib/smoothScroll";
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
    const update = () => {
      const lenis = getLenis();
      const y =
        (typeof lenis?.scroll === "number" ? lenis.scroll : null) ??
        window.scrollY ??
        document.documentElement.scrollTop ??
        0;
      setHidden(y > hideAfter);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    let unsub: (() => void) | undefined;
    let raf = 0;
    let tries = 0;

    const attachLenis = () => {
      const lenis = getLenis();
      if (!lenis) return false;
      const onScroll = () => update();
      lenis.on("scroll", onScroll);
      unsub = () => lenis.off("scroll", onScroll);
      return true;
    };

    if (!attachLenis()) {
      const tick = () => {
        tries += 1;
        if (attachLenis() || tries > 90) return;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(raf);
      unsub?.();
    };
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
