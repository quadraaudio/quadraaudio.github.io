"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "../hydra/ThemeSwitcher";
import { products } from "@/data/products";
import styles from "./page.module.scss";

export default function StorePage() {
  const hydraProduct = products.find((p) => p.slug === "hydra") || products[0];

  return (
    <div className={styles.storePage}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.storeContent}>

        {/* =========================================
           Apple Store Header Ribbon
           ========================================= */}
        <header className={styles.storeHeader}>
          <h1>
            <span className={styles.blackText}>Store.</span>{" "}
            <span className={styles.grayText}>The best way to buy Hydra software.</span>
          </h1>
        </header>

        <div className={styles.divider} />

        {/* =========================================
           Product Shelf: Featured Hydra Software
           ========================================= */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.blackText}>Software.</span>{" "}
              <span className={styles.grayText}>Professional virtual audio routing for Mac.</span>
            </h2>
          </div>

          <div className={styles.productGrid}>
            <div className={styles.productCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardKicker}>Virtual Audio Matrix</span>
                <h3 className={styles.cardTitle}>{hydraProduct.name}</h3>
                <p className={styles.cardTagline}>{hydraProduct.tagline}</p>
                <p className={styles.cardPrice}>{hydraProduct.priceLabel}</p>
              </div>

              <div className={styles.cardMediaCenter}>
                <div className={styles.appIconWrapper}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link href="/hydra" className="apple-button-secondary">
                  Explore Hydra
                </Link>
                <Link href="/store/checkout/gate" className="apple-button-primary">
                  Buy ($199.99)
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* =========================================
           Store Help & Quadra Advantages Grid
           ========================================= */}
        <section className={styles.storeShelf}>
          <div className={styles.shelfHeader}>
            <h2>
              <span className={styles.blackText}>Why buy from Quadra?</span>{" "}
              <span className={styles.grayText}>Direct licensing and expert audio support.</span>
            </h2>
          </div>

          <div className={styles.helpGrid}>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M10 9l5 3-5 3V9z"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>Instant Digital Activation</h3>
                <p className={styles.helpDescription}>Receive your digital license key instantly via email and Quadra ID.</p>
              </div>
            </div>

            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.helpTitle}>2 Machine Activations</h3>
                <p className={styles.helpDescription}>Use your license simultaneously on your main studio Mac and laptop.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
