"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HYDRA, HYDRA_NAV } from "@/data/hydra.landing";
import styles from "./HydraChrome.module.scss";

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
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.4, 0.65] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.bar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="#overview" className={styles.wordmark} aria-label="Hydra">
          {HYDRA.name}
        </a>

        <nav className={styles.nav} aria-label="Hydra sections">
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
