"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import { products } from "@/data/products";
import styles from "./page.module.scss";

const BADGE_COLORS: Record<string, string> = {
  orange: "#bf4800",
  gray: "#86868b",
  blue: "#0071e3",
};

export default function StorePage() {
  const available = products.filter((p) => p.available);
  const comingSoon = products.filter((p) => !p.available);

  return (
    <div className={styles.storePage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.storeContent}>

        {/* Apple Store Header */}
        <header className={styles.storeHeader}>
          <h1>
            <span className={styles.blackText}>Store.</span>{" "}
            <span className={styles.grayText}>The best way to equip your studio.</span>
          </h1>
        </header>

        <div className={styles.divider} />

        {/* Shelf: Available Products */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.blackText}>The latest.</span>{" "}
              <span className={styles.grayText}>Take a look at what's new.</span>
            </h2>
          </div>

          <div className={styles.productGrid}>
            {available.map((product) => {
              const gradient =
                product.category === "software"
                  ? "linear-gradient(160deg, #fff 40%, #1a1a2e 100%)"
                  : "linear-gradient(160deg, #f5f5f7 40%, #c1c1c6 100%)";

              return (
                <Link
                  key={product.slug}
                  href={`/store/${product.slug}`}
                  className={styles.productCard}
                  style={{ background: gradient }}
                >
                  <div className={styles.cardHeader}>
                    {product.badge && (
                      <span
                        className={styles.cardKicker}
                        style={{ color: BADGE_COLORS[product.badgeColor ?? "orange"] }}
                      >
                        {product.badge}
                      </span>
                    )}
                    <h3
                      className={styles.cardTitle}
                      style={{ color: product.category === "software" ? "#f5f5f7" : "#1d1d1f" }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={styles.cardPrice}
                      style={{ color: product.category === "software" ? "rgba(245,245,247,0.7)" : "#86868b" }}
                    >
                      {product.priceLabel}
                    </p>
                  </div>

                  {product.cardImage && (
                    <div className={styles.cardMediaCenter}>
                      <Image
                        src={product.cardImage}
                        alt={product.name}
                        width={160}
                        height={160}
                        className={styles.appIcon}
                      />
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.learnMore}>Learn more</span>
                    <span className={styles.buyNow}>Buy</span>
                  </div>
                </Link>
              );
            })}

            {/* Coming Soon cards */}
            {comingSoon.map((product) => (
              <div
                key={product.slug}
                className={`${styles.productCard} ${styles.comingSoon}`}
                style={{ background: "linear-gradient(160deg, #f5f5f7 40%, #d1d1d6 100%)" }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardKicker} style={{ color: "#86868b" }}>
                    {product.badge}
                  </span>
                  <h3 className={styles.cardTitle} style={{ color: "#1d1d1f" }}>
                    {product.name}
                  </h3>
                  <p className={styles.cardPrice} style={{ color: "#86868b" }}>
                    {product.priceLabel}
                  </p>
                </div>
                {product.cardImage && (
                  <div className={styles.cardMediaCenter}>
                    <Image
                      src={product.cardImage}
                      alt={product.name}
                      width={200}
                      height={160}
                      className={styles.hardwareImage}
                    />
                  </div>
                )}
                <div className={styles.cardFooter}>
                  <span className={styles.notifyLink}>Notify me</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Shelf: Help */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.blackText}>Need help?</span>{" "}
              <span className={styles.grayText}>We're here for you.</span>
            </h2>
          </div>

          <div className={styles.helpGrid}>
            <Link href="/account" className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="11" r="5" stroke="#1d1d1f" strokeWidth="1.5"/>
                  <path d="M4 27c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>Your Account</h3>
                <p className={styles.helpDescription}>Access licenses, order history, and Quadra ID settings.</p>
                <span className={styles.helpLink}>Go to account</span>
              </div>
            </Link>

            <Link href="/support" className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="#1d1d1f" strokeWidth="1.5"/>
                  <path d="M13 13a3 3 0 1 1 3 3v2" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="16" cy="21.5" r="1" fill="#1d1d1f"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>Support</h3>
                <p className={styles.helpDescription}>Speak with a Quadra audio specialist.</p>
                <span className={styles.helpLink}>Contact us</span>
              </div>
            </Link>

            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="7" width="24" height="18" rx="3" stroke="#1d1d1f" strokeWidth="1.5"/>
                  <path d="M4 12h24" stroke="#1d1d1f" strokeWidth="1.5"/>
                  <path d="M10 17h4M10 21h8" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>Order Status</h3>
                <p className={styles.helpDescription}>Track your purchase or download your software.</p>
                <span className={styles.helpLink}>Check order</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
