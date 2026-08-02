"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HYDRA, HYDRA_NAV } from "@/data/hydra.landing";
import styles from "./HydraChrome.module.scss";

function navHeightPx() {
  const root = getComputedStyle(document.documentElement);
  return parseFloat(root.getPropertyValue("--nav-height")) || 64;
}

function chromeHeightPx() {
  const root = getComputedStyle(document.documentElement);
  return parseFloat(root.getPropertyValue("--matrix-chrome-height")) || 48;
}

function stickyOffsetPx(chromeVisible: boolean) {
  return navHeightPx() + (chromeVisible ? chromeHeightPx() : 0);
}

function scrollToId(
  id: string,
  chromeVisible: boolean,
  behavior: ScrollBehavior = "smooth",
) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top =
    el.getBoundingClientRect().top + window.scrollY - stickyOffsetPx(chromeVisible);
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function HydraChrome() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("#overview");
  const lastY = useRef(0);

  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollPaddingTop = hidden
      ? "var(--nav-height)"
      : "calc(var(--nav-height) + var(--matrix-chrome-height))";
    html.dataset.matrixChrome = hidden ? "away" : "visible";
  }, [hidden]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 24) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.scrollPaddingTop = "";
      delete document.documentElement.dataset.matrixChrome;
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
      // Jump with chrome visible so section clears both bars, then it can hide again
      setHidden(false);
      scrollToId(id, true);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = hash.slice(1);
    const t = window.setTimeout(() => {
      setHidden(false);
      scrollToId(id, true, "auto");
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={`${styles.bar} ${hidden ? styles.away : ""}`}
      aria-hidden={hidden}
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
              tabIndex={hidden ? -1 : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            href={HYDRA.ctaPrimary.href}
            className={styles.cta}
            tabIndex={hidden ? -1 : undefined}
          >
            {HYDRA.ctaPrimary.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
