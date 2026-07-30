"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
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
  const { productsList } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

  const hydraProduct = productsList.find((p) => p.slug === "hydra") || productsList[0];
  const status = hydraProduct?.availabilityStatus || (hydraProduct?.available ? "available" : "sold_out");
  const isAvailable = status === "available";

  const getButtonText = () => {
    if (status === "sold_out") return "Sold Out";
    if (status === "coming_soon") return "Coming Soon";
    return "Buy";
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAvailable) return;
    if (hydraProduct) {
      addItem(hydraProduct);
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
          <button
            onClick={handleBuyClick}
            disabled={!isAvailable}
            className="apple-button-primary"
            style={!isAvailable ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" } : {}}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}

