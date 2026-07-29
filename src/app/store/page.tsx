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

  return (
    <div className={styles.storePage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.storeContent}>

        {/* Apple Store Header */}
        <header className={styles.storeHeader}>
          <h1>
            <span className={styles.blackText}>Store.</span>{" "}
            <span className={styles.grayText}>Equip your studio with Hydra software.</span>
          </h1>
        </header>

        <div className={styles.divider} />

        {/* Shelf: Available Products */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.blackText}>Software.</span>{" "}
              <span className={styles.grayText}>Experience professional virtual audio routing.</span>
            </h2>
          </div>

          <div className={styles.productGrid}>
            {available.map((product) => (
              <Link
                key={product.slug}
                href={`/hydra`}
                className={styles.productCard}
                style={{ background: "linear-gradient(160deg, #fff 40%, #1a1a2e 100%)" }}
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
                  <h3 className={styles.cardTitle} style={{ color: "#f5f5f7" }}>
                    {product.name}
                  </h3>
                  <p className={styles.cardPrice} style={{ color: "rgba(245,245,247,0.7)" }}>
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
                  <span className={styles.buyNow}>Try Free for 90 Days</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Shelf: Help */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.blackText}>Need help?</span>{" "}
              <span className={styles.grayText}>Our audio engineering team is here for you.</span>
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
                <p className={styles.helpDescription}>Access licenses, active machine activations, and Quadra ID settings.</p>
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
                <h3 className={styles.helpTitle}>Support & Documentation</h3>
                <p className={styles.helpDescription}>Speak with a Quadra virtual soundcard specialist.</p>
                <span className={styles.helpLink}>Contact support</span>
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
                <h3 className={styles.helpTitle}>Order & License Status</h3>
                <p className={styles.helpDescription}>Download Hydra installer or manage commercial licenses.</p>
                <span className={styles.helpLink}>Check license</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
