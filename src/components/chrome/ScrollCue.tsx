"use client";

import { useEffect, useState } from "react";
import { getLenis } from "@/lib/smoothScroll";
import styles from "./ScrollCue.module.scss";

type Props = {
  label?: string;
  /** Re-show the cue after scrolling stops for this many ms. */
  idleMs?: number;
  /** Keep hidden when within this many px of the page bottom. */
  bottomHidePx?: number;
  className?: string;
};

function readScrollY() {
  const lenis = getLenis();
  if (typeof lenis?.scroll === "number") return lenis.scroll;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function nearPageBottom(y: number, bottomHidePx: number) {
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return y >= max - bottomHidePx;
}

/**
 * Persistent “scroll to explore” cue: hides while scrolling, returns after idle.
 * Fixed to the viewport so it stays available past the hero.
 */
export function ScrollCue({
  label = "Scroll",
  idleMs = 1600,
  bottomHidePx = 120,
  className = "",
}: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let idleTimer = 0;
    let raf = 0;
    let unsub: (() => void) | undefined;
    let lastY = readScrollY();

    const scheduleShow = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        const y = readScrollY();
        setHidden(nearPageBottom(y, bottomHidePx));
      }, idleMs);
    };

    const onScroll = () => {
      const y = readScrollY();
      const moved = Math.abs(y - lastY) > 1;
      lastY = y;

      if (nearPageBottom(y, bottomHidePx)) {
        window.clearTimeout(idleTimer);
        setHidden(true);
        return;
      }

      if (moved) {
        setHidden(true);
        scheduleShow();
      }
    };

    // Initial: show unless already near the end.
    setHidden(nearPageBottom(lastY, bottomHidePx));
    scheduleShow();

    window.addEventListener("scroll", onScroll, { passive: true });

    const attachLenis = () => {
      const lenis = getLenis();
      if (!lenis) return false;
      const handler = () => onScroll();
      lenis.on("scroll", handler);
      unsub = () => lenis.off("scroll", handler);
      return true;
    };

    if (!attachLenis()) {
      let tries = 0;
      const tick = () => {
        tries += 1;
        if (attachLenis() || tries > 90) return;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
      unsub?.();
    };
  }, [idleMs, bottomHidePx]);

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
