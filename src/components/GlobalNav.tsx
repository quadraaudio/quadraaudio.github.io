"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeContext";
import styles from "./GlobalNav.module.scss";

const NAV_LINKS = [
  { label: "Store", href: "/store" },
  { label: "Hydra", href: "/hydra" },
  { label: "Hydra Pro", href: "/store/hydra-pro" },
  { label: "Quadra Core I/O", href: "/store/quadra-core-io" },
  { label: "Support", href: "/support" },
];

export default function GlobalNav() {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`${styles.nav} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo} aria-label="Quadra Audio Home">
          <Image
            src="/images/hydra_app_icon.jpg"
            alt=""
            width={22}
            height={22}
            style={{ borderRadius: 6 }}
          />
        </Link>

        <nav className={styles.links}>
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/support" className={styles.iconBtn} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/store/bag" className={styles.iconBtn} aria-label="Bag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
          </Link>
          <button
            className={styles.menuBtn}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
