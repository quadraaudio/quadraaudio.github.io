"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import styles from "./LocalNav.module.scss";

interface LocalNavProps {
  title?: string;
  price?: string;
  buyUrl?: string;
  links?: { label: string; href: string; active?: boolean }[];
}

export default function LocalNav({
  title = "Hydra",
  price = "$199.99",
  buyUrl,
  links = [
    { label: "Overview", href: "#overview", active: true },
    { label: "Features", href: "#tools" },
    { label: "Plugins & FX", href: "#sounds" },
    { label: "Spatial Audio", href: "#spatial" },
    { label: "Specs", href: "#specs" },
  ],
}: LocalNavProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const hydra = products[0];
    if (hydra) {
      addItem(hydra);
    }
    router.push("/store/bag");
  };

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
          <button onClick={handleBuyClick} className="apple-button-primary">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
