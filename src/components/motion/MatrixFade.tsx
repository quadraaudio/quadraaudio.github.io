"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MatrixFade.module.scss";

/**
 * Opacity fade matching Matrix RootShell (`QuadraTheme.fadeIn` 0.55s).
 * Prefer this over Apple-style rise on the MATRIX microsite.
 */
export function MatrixFade({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add(styles.on);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.on);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    io.observe(el);
    // If IntersectionObserver never fires (odd layouts / iframe), still reveal.
    const failsafe = window.setTimeout(() => {
      el.classList.add(styles.on);
      io.disconnect();
    }, 2500);
    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.fade} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
