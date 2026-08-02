"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HYDRA, HYDRA_NAV } from "@/data/hydra.landing";
import styles from "./HydraChrome.module.scss";

function stickyOffsetPx() {
  const root = getComputedStyle(document.documentElement);
  const nav = parseFloat(root.getPropertyValue("--nav-height")) || 64;
  const chrome =
    parseFloat(root.getPropertyValue("--matrix-chrome-height")) || 48;
  return nav + chrome;
}

function scrollToId(id: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - stickyOffsetPx();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function HydraChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#overview");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollPaddingTop;
    html.style.scrollPaddingTop =
      "calc(var(--nav-height) + var(--matrix-chrome-height))";
    return () => {
      html.style.scrollPaddingTop = previous;
    };
  }, []);

  useEffect(() => {
    const ids = HYDRA_NAV.map((n) => n.href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(`#${visible.target.id}`);
        }
      },
      {
        // Account for Quadra nav + MATRIX chrome so “active” matches what you see
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.4, 0.65],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Hash links must clear both sticky bars (GlobalNav + this chrome).
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
    // Wait a tick for layout/sticky heights
    const t = window.setTimeout(() => scrollToId(id, "auto"), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.bar} ${scrolled ? styles.scrolled : ""}`}>
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
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href={HYDRA.ctaPrimary.href} className={styles.cta}>
            {HYDRA.ctaPrimary.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
