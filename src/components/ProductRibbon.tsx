"use client";

import Link from "next/link";
import styles from "./ProductRibbon.module.scss";

interface RibbonItem {
  id: string;
  name: string;
  badge?: string;
  icon: "soundcard" | "patchbay" | "network" | "spatial";
  href: string;
}

const defaultItems: RibbonItem[] = [
  { id: "soundcard", name: "Virtual Soundcard", badge: "256 Ch", icon: "soundcard", href: "#overview" },
  { id: "patchbay", name: "Virtual Patchbay", badge: "Multi-App", icon: "patchbay", href: "#tools" },
  { id: "network", name: "NDI® & AVB Network", badge: "Low Latency", icon: "network", href: "#network" },
  { id: "spatial", name: "Spatial Audio 9.1.6", badge: "Atmos", icon: "spatial", href: "#spatial" },
];

export default function ProductRibbon({ items = defaultItems }: { items?: RibbonItem[] }) {
  return (
    <div className={styles.ribbonContainer}>
      <div className={styles.ribbonContent}>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className={styles.ribbonCard}>
            <div className={styles.iconWrapper}>
              {item.icon === "soundcard" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <rect x="6" y="10" width="36" height="28" rx="6" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="16" cy="24" r="4" fill="currentColor" />
                  <circle cx="24" cy="24" r="4" fill="currentColor" />
                  <circle cx="32" cy="24" r="4" fill="currentColor" />
                </svg>
              )}
              {item.icon === "patchbay" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <rect x="10" y="12" width="28" height="24" rx="5" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="16" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="16" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              )}
              {item.icon === "network" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M10 24h28M24 10a20 20 0 010 28" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
              {item.icon === "spatial" && (
                <svg viewBox="0 0 48 48" fill="none" className={styles.svgIcon}>
                  <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
                  <circle cx="24" cy="24" r="6" fill="currentColor" />
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
