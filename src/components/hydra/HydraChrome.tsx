"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HYDRA, HYDRA_NAV } from "@/data/hydra.landing";
import styles from "./HydraChrome.module.scss";

function stickyOffsetPx() {
  const root = getComputedStyle(document.documentElement);
  const raw = root.getPropertyValue("--matrix-sticky-offset").trim();
  const parsed = parseFloat(raw);
  if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  return parseFloat(root.getPropertyValue("--matrix-chrome-height")) || 48;
}

function scrollToId(id: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(id);
  if (!el) return false;
  const top =
    el.getBoundingClientRect().top + window.scrollY - stickyOffsetPx();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
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
      scrollToId(id);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = hash.slice(1);
    const t = window.setTimeout(() => {
      scrollToId(id, "auto");
    }, 50);
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
