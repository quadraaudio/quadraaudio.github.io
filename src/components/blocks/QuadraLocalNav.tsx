"use client";

import styles from "./quadra.module.scss";

export interface LocalNavItem {
  label: string;
  href: string;
}

export interface QuadraLocalNavProps {
  productTitle: string;
  items?: LocalNavItem[];
  buyText?: string;
  buyLink?: string;
}

const DEFAULT_ITEMS: LocalNavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Tech Specs", href: "#specs" },
];

export function QuadraLocalNav({
  productTitle = "Hydra",
  items = DEFAULT_ITEMS,
  buyText = "Buy",
  buyLink = "/store",
}: QuadraLocalNavProps) {
  return (
    <div className={styles.localNav}>
      <div className={styles.localNavInner}>
        <div className={styles.localNavTitle}>{productTitle}</div>
        <div className={styles.localNavLinks}>
          <nav aria-label={`${productTitle} sections`}>
            {items.map((item) => (
              <a key={`${item.label}-${item.href}`} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          {buyText ? (
            <a className={styles.btnSmall} href={buyLink}>
              {buyText}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
