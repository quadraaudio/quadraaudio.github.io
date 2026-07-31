"use client";

import Link from "next/link";
import { useTheme } from "./ThemeContext";
import styles from "./GlobalFooter.module.scss";

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop and Learn",
    links: [
      { label: "Hydra", href: "/hydra" },
      { label: "Hydra Pro", href: "/store/hydra-pro" },
      { label: "Quadra Core I/O", href: "/store/quadra-core-io" },
      { label: "Store", href: "/store" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Manage Your Quadra ID", href: "/account" },
      { label: "Quadra Store Account", href: "/account" },
      { label: "My Licenses", href: "/account" },
    ],
  },
  {
    title: "Quadra Store",
    links: [
      { label: "Buy Hydra", href: "/store/buy-hydra" },
      { label: "Shopping Bag", href: "/store/bag" },
      { label: "Checkout", href: "/store/checkout" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Support Home", href: "/support" },
      { label: "Contact Us", href: "/support/contact" },
      { label: "Sitemap", href: "/sitemap-page" },
    ],
  },
  {
    title: "About Quadra",
    links: [
      { label: "Newsroom", href: "/" },
      { label: "Careers", href: "/" },
    ],
  },
  {
    title: "Quadra Values",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Refunds", href: "/legal/refunds" },
    ],
  },
];

export default function GlobalFooter() {
  const { theme } = useTheme();

  return (
    <footer className={`${styles.footer} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.inner}>
        <div className={styles.disclaimer}>
          <p>
            Hydra requires macOS 26 or later. Some features require an active internet
            connection for activation. Pricing and availability may vary by region.
          </p>
        </div>

        <div className={styles.columns}>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className={styles.columnTitle}>{col.title}</p>
              {col.links.map((link) => (
                <Link key={link.label} href={link.href} className={styles.columnLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>Copyright © {new Date().getFullYear()} Quadra Audio. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/legal/privacy">Privacy Policy</Link>
            <span>|</span>
            <Link href="/legal/terms">Terms of Use</Link>
            <span>|</span>
            <Link href="/sitemap-page">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
