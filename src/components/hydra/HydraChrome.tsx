"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HYDRA, HYDRA_NAV } from "@/data/hydra.landing";
import { getLenis, scrollToMatrixSection } from "@/lib/smoothScroll";
import styles from "./HydraChrome.module.scss";

function chromeHeightPx() {
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--matrix-chrome-height",
      ),
    ) || 48
  );
}

/** MATRIX chrome is fixed; section jumps use ScrollTrigger pin starts. */
function scrollToSection(id: string, immediate = false) {
  return scrollToMatrixSection(id, {
    offset: chromeHeightPx(),
    immediate,
    // Specs has no pin — pinProgress ignored; chapters land mid-reveal.
    pinProgress: id === "specs" ? 0 : 0.16,
  });
}

type Props = {
  /** When false, chrome is off-screen — Quadra GlobalNav owns the top slot. */
  visible: boolean;
};

export function HydraChrome({ visible }: Props) {
  const [active, setActive] = useState("#overview");

  useEffect(() => {
    const ids = HYDRA_NAV.map((n) => n.href.slice(1));

    const readY = () => getLenis()?.scroll ?? window.scrollY ?? 0;

    const updateActive = () => {
      const y = readY();
      let current = "#overview";

      for (const id of ids) {
        if (id === "overview") continue;
        const st = ScrollTrigger.getById(`matrix-chapter-${id}`);
        if (st && y >= st.start - 8) {
          current = `#${id}`;
          continue;
        }
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + (window.scrollY || 0);
        if (y >= top - chromeHeightPx() - 24) {
          current = `#${id}`;
        }
      }

      setActive(current);
    };

    // Defer until chapter pins register.
    const boot = window.setTimeout(updateActive, 120);
    window.addEventListener("scroll", updateActive, { passive: true });

    let unsub: (() => void) | undefined;
    const lenis = getLenis();
    if (lenis) {
      const onScroll = () => updateActive();
      lenis.on("scroll", onScroll);
      unsub = () => lenis.off("scroll", onScroll);
    }

    return () => {
      window.clearTimeout(boot);
      window.removeEventListener("scroll", updateActive);
      unsub?.();
    };
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const id = hash.slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      history.pushState(null, "", hash);
      setActive(hash);
      scrollToSection(id);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = hash.slice(1);
    if (!document.getElementById(id)) return;
    const t = window.setTimeout(() => {
      scrollToSection(id, true);
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={`${styles.bar} ${visible ? "" : styles.away}`}
      aria-hidden={!visible}
    >
      <div className={styles.inner}>
        <a href="#overview" className={styles.wordmark} aria-label="MATRIX">
          {HYDRA.brandLine}
        </a>

        <nav className={styles.nav} aria-label="MATRIX sections">
          {HYDRA_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={active === item.href ? styles.active : undefined}
              tabIndex={visible ? undefined : -1}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            href={HYDRA.ctaPrimary.href}
            className={styles.cta}
            tabIndex={visible ? undefined : -1}
          >
            {HYDRA.ctaPrimary.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
