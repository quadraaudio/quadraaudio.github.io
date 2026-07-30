"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import { type Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import styles from "./page.module.scss";

export default function StorePage() {
  const { productsList } = useProducts();
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    if (product.availabilityStatus && product.availabilityStatus !== "available") return;
    addItem(product);
    router.push("/store/bag");
  };

  const getStatusBadge = (product: Product) => {
    const status = product.availabilityStatus || (product.available ? "available" : "sold_out");
    if (status === "sold_out") {
      return <span className={`${styles.statusTag} ${styles.statusSoldOut}`}>Sold Out</span>;
    }
    if (status === "coming_soon") {
      return <span className={`${styles.statusTag} ${styles.statusComingSoon}`}>Coming Soon</span>;
    }
    return <span className={`${styles.statusTag} ${styles.statusAvailable}`}>Available</span>;
  };

  const getButtonText = (product: Product) => {
    const status = product.availabilityStatus || (product.available ? "available" : "sold_out");
    if (status === "sold_out") return "Sold Out";
    if (status === "coming_soon") return "Coming Soon";
    return `Buy ($${product.price > 0 ? product.price.toFixed(2) : "199.99"})`;
  };

  return (
    <div className={styles.storePage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.storeContent}>

        {/* Apple Store Header */}
        <header className={styles.storeHeader}>
          <h1>
            <span className={styles.whiteText}>Store.</span>{" "}
            <span className={styles.grayText}>The best way to buy Quadra Audio software & hardware.</span>
          </h1>
        </header>

        <div className={styles.divider} />

        {/* Product Shelf: Software & Hardware Products */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.whiteText}>Products.</span>{" "}
              <span className={styles.grayText}>Professional virtual audio routing & interfaces for Mac.</span>
            </h2>
          </div>

          <div className={styles.productGrid}>
            {productsList.map((product) => {
              const isAvailable = (product.availabilityStatus ?? (product.available ? "available" : "sold_out")) === "available";

              return (
                <div key={product.slug} className={styles.productCard}>
                  <div className={styles.cardHeader}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className={styles.cardKicker}>{product.badge || product.category}</span>
                      {getStatusBadge(product)}
                    </div>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <p className={styles.cardTagline}>{product.tagline}</p>
                    <p className={styles.cardPrice}>{product.priceLabel}</p>
                  </div>

                  <div className={styles.cardMediaCenter}>
                    <div className={styles.appIconWrapper}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <Link href={`/store/${product.slug}`} className="apple-button-secondary">
                      Learn More
                    </Link>
                    <button
                      onClick={(e) => handleBuyClick(product, e)}
                      disabled={!isAvailable}
                      className={`apple-button-primary ${!isAvailable ? styles.disabledBtn : ""}`}
                    >
                      {getButtonText(product)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Store Advantages Grid */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.whiteText}>Why buy from Quadra?</span>{" "}
              <span className={styles.grayText}>Direct licensing and expert audio support.</span>
            </h2>
          </div>

          <div className={styles.helpGrid}>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>90-Day Risk Free Trial</h3>
                <p className={styles.helpDescription}>Download and test all 256 virtual channels and AoIP features free for 90 days.</p>
              </div>
            </div>

            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M10 9l5 3-5 3V9z"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>Instant Activation</h3>
                <p className={styles.helpDescription}>Receive your license key immediately upon checkout with 2 Mac activations.</p>
              </div>
            </div>

            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>Audio Specialist Support</h3>
                <p className={styles.helpDescription}>Get dedicated setup support for Core Audio, NDI®, and Dolby Atmos workflows.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
