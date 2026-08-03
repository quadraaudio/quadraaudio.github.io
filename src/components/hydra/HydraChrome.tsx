"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HYDRA, HYDRA_NAV } from "@/data/hydra.landing";
import { scrollToElement, scrollToTop } from "@/lib/smoothScroll";
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

/** MATRIX chrome is fixed, so section jumps always clear that bar. */
function scrollToSection(id: string, immediate = false) {
  if (id === "overview") {
    scrollToTop(immediate);
    return true;
  }
  // Prefer fixed chrome height so we don't lag one frame behind swap state.
  const offset = chromeHeightPx();
  return scrollToElement(id, { offset, immediate });
}

type Props = {
  /** When false, chrome is off-screen — Quadra GlobalNav owns the top slot. */
  visible: boolean;
};

export function HydraChrome({ visible }: Props) {
  const [active, setActive] = useState("#overview");

  useEffect(() => {
    const ids = HYDRA_NAV.map((n) => n.href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target?.id) {
          setActive(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.4, 0.65],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
