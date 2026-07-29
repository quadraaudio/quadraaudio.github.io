"use client";

import Link from "next/link";
import styles from "./ProductRibbon.module.scss";

interface RibbonItem {
  id: string;
  name: string;
  badge?: string;
  icon: "pro" | "duo" | "core" | "io";
  href: string;
}

const defaultItems: RibbonItem[] = [
  { id: "pro", name: "Hydra Pro", badge: "Novo", icon: "pro", href: "/hydra" },
  { id: "duo", name: "Hydra Duo", badge: "Novo", icon: "duo", href: "/hydra" },
  { id: "core", name: "Hydra Core", icon: "core", href: "/hydra" },
  { id: "io", name: "Core I/O Interface", icon: "io", href: "/store" },
];

export default function ProductRibbon({ items = defaultItems }: { items?: RibbonItem[] }) {
  return (
    <div className={styles.ribbonContainer}>
      <div className={styles.ribbonContent}>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className={styles.ribbonCard}>
            <div className={styles.iconWrapper}>
              {item.icon === "pro" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <rect x="6" y="10" width="36" height="28" rx="6" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="16" cy="24" r="4" fill="currentColor" />
                  <circle cx="24" cy="24" r="4" fill="currentColor" />
                  <circle cx="32" cy="24" r="4" fill="currentColor" />
                </svg>
              )}
              {item.icon === "duo" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <rect x="10" y="12" width="28" height="24" rx="5" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="18" cy="24" r="3.5" fill="currentColor" />
                  <circle cx="30" cy="24" r="3.5" fill="currentColor" />
                </svg>
              )}
              {item.icon === "core" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <rect x="14" y="14" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="24" cy="24" r="3" fill="currentColor" />
                </svg>
              )}
              {item.icon === "io" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <rect x="4" y="16" width="40" height="16" rx="4" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="12" y1="24" x2="36" y2="24" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              )}
            </div>
            <span className={styles.modelName}>{item.name}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
