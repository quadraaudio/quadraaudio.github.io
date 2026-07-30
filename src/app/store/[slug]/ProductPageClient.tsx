"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import CarouselBlock from "@/components/blocks/CarouselBlock";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/data/products";
import styles from "./page.module.scss";

export default function ProductPageClient({ product: initialProduct }: { product: Product }) {
  const { productsList } = useProducts();
  const product = productsList.find((p) => p.slug === initialProduct.slug) || initialProduct;

  const [ribbonVisible, setRibbonVisible] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setRibbonVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-96px 0px 0px 0px" }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const status = product.availabilityStatus || (product.available ? "available" : "sold_out");
  const isAvailable = status === "available";

  const getButtonLabel = () => {
    if (status === "sold_out") return "Sold Out";
    if (status === "coming_soon") return "Coming Soon";
    return `Add to Bag — ${product.priceLabel}`;
  };

  const handleAddToBag = () => {
    if (!isAvailable) return;
    addItem(product);
    setAddedToBag(true);
    // Scroll to top to show the confirmation bar
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page} data-theme="dark">
      <ThemeSwitcher forceTheme="dark" />

      {/* ── "Added to Bag" confirmation bar — Apple style ── */}
      <div className={`${styles.addedBar} ${addedToBag ? styles.addedBarVisible : ""}`}>
        <div className={styles.addedBarInner}>
          <div className={styles.addedBarLeft}>
            {product.heroImage && (
              <Image
                src={product.heroImage}
                alt={product.name}
                width={36}
                height={36}
                className={styles.addedBarIcon}
              />
            )}
            <span className={styles.addedBarText}>
              <strong>{product.name}</strong> was added to your bag.
            </span>
          </div>
          <Link href="/store/bag" className={styles.addedBarCta}>
            View Bag
          </Link>
        </div>
      </div>

      {/* ── Product Ribbon ── */}
      <div className={`${styles.ribbon} ${ribbonVisible ? styles.ribbonVisible : ""}`}>
        <div className={styles.ribbonContainer}>
          <span className={styles.ribbonTitle}>{product.name}</span>
          <div className={styles.ribbonActions}>
            <span className={styles.ribbonPrice}>{product.priceLabel}</span>
            <button
              onClick={handleAddToBag}
              disabled={!isAvailable}
              className={`${styles.ribbonButton} ${!isAvailable ? styles.disabledRibbonBtn : ""}`}
              style={!isAvailable ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" } : {}}
            >
              {status === "sold_out" ? "Sold Out" : status === "coming_soon" ? "Coming Soon" : "Add to Bag"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {/* ── Hero ── */}
        <section className={styles.hero} ref={heroRef}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <p className={styles.heroEyebrow}>{product.badge ?? product.category}</p>
            {status === "sold_out" && (
              <span style={{ background: "rgba(229, 57, 53, 0.2)", color: "#ff5252", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                Sold Out
              </span>
            )}
            {status === "coming_soon" && (
              <span style={{ background: "rgba(103, 58, 183, 0.2)", color: "#b388ff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                Coming Soon
              </span>
            )}
          </div>
          <h1 className={styles.heroTagline}>{product.tagline}</h1>
          <p className={styles.heroSubtitle}>{product.description}</p>

          <div className={styles.heroCta}>
            <button
              onClick={handleAddToBag}
              disabled={!isAvailable}
              className={styles.buyButton}
              style={!isAvailable ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" } : {}}
            >
              {getButtonLabel()}
            </button>
            <a href="#features" className={styles.learnLink}>
              Learn more
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M5 0L4.06 0.94 7.62 4.5H0v1.5h7.62L4.06 9.56 5 10.5l5-5z"/>
              </svg>
            </a>
          </div>

          {product.heroImage && (
            <div className={styles.heroImageWrap}>
              <Image
                src={product.heroImage}
                alt={product.name}
                width={280}
                height={280}
                className={styles.heroImage}
                priority
              />
            </div>
          )}
        </section>

        {/* ── Features Carousel ── */}
        {product.features.length > 0 && (
          <section id="features" className={styles.featuresSection}>
            <CarouselBlock
              headline="The power is in the details."
              intro={`${product.name} stimulates your creativity with an enormous variety of capabilities.`}
              items={product.features.map((f) => ({
                id: f.title,
                title: f.title,
                description: f.description,
                mediaClass: f.mediaClass,
              }))}
            />
          </section>
        )}

        {/* ── Specs ── */}
        {product.specGroups && product.specGroups.length > 0 && (
          <section className={styles.specsSection}>
            <h2 className={styles.specsTitle}>Technical Specifications</h2>
            {product.specGroups.map((group) => (
              <div key={group.title} className={styles.specGroup}>
                <h3 className={styles.specGroupTitle}>{group.title}</h3>
                <table className={styles.specTable}>
                  <tbody>
                    {group.specs.map((spec) => (
                      <tr key={spec.label} className={styles.specRow}>
                        <td className={styles.specLabel}>{spec.label}</td>
                        <td className={styles.specValue}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {product.systemRequirements && (
              <div className={styles.specGroup}>
                <h3 className={styles.specGroupTitle}>System Requirements</h3>
                <ul className={styles.requirementsList}>
                  {product.systemRequirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* ── Buy Footer ── */}
        <section className={styles.buyFooter}>
          <h2>{product.name}</h2>
          <p>{product.priceLabel}</p>
          <button
            onClick={handleAddToBag}
            disabled={!isAvailable}
            className={styles.buyFooterButton}
            style={!isAvailable ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" } : {}}
          >
            {status === "sold_out" ? "Sold Out" : status === "coming_soon" ? "Coming Soon" : "Add to Bag"}
          </button>
        </section>

      </div>
    </div>
  );
}
