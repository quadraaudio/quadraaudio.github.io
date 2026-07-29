"use client";

import Link from "next/link";
import styles from "./LocalNav.module.scss";

interface LocalNavProps {
  title: string;
  price?: string;
  buyUrl?: string;
  links?: { label: string; href: string; active?: boolean }[];
}

export default function LocalNav({
  title,
  price,
  buyUrl = "/store",
  links = [
    { label: "Visão Geral", href: "#overview", active: true },
    { label: "Especificações", href: "#specs" },
    { label: "Comparar", href: "#compare" },
  ],
}: LocalNavProps) {
  return (
    <div className={styles.localNavContainer}>
      <div className={styles.localNavContent}>
        <div className={styles.titleWrapper}>
          <span className={styles.productTitle}>{title}</span>
        </div>
        <div className={styles.rightWrapper}>
          <nav className={styles.navMenu}>
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className={`${styles.navItem} ${link.active ? styles.active : ""}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          {price && <span className={styles.priceTag}>{price}</span>}
          {buyUrl && (
            <Link href={buyUrl} className="apple-button-primary">
              Comprar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
