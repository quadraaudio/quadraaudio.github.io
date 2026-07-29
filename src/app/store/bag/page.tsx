"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import styles from "./page.module.scss";

export default function BagPage() {
  const {
    items,
    totalPrice,
    appliedCoupon,
    discountTotal,
    finalPrice,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError("");
    setCouponLoading(true);

    const res = await applyCoupon(couponCode.trim());
    setCouponLoading(false);

    if (!res.success) {
      setCouponError(res.error || "Invalid promo code");
    } else {
      setCouponCode("");
    }
  };

  const bagSlugs = new Set(items.map((i) => i.product.slug));
  const related = products.filter((p) => p.available && !bagSlugs.has(p.slug));

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <ThemeSwitcher forceTheme="dark" />
        <div className={styles.emptyState}>
          <h1>Your bag is empty.</h1>
          <p>Browse our store to find your next professional audio tool.</p>
          <Link href="/store" className="apple-button-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="dark" />

      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1>Review your bag.</h1>
            <p className={styles.headerSub}>Instant digital license delivery on all Quadra software.</p>
          </div>
          <Link href="/store/checkout/gate" className="apple-button-primary">
            Check Out
          </Link>
        </header>

        <div className={styles.divider} />

        {/* Item list */}
        <section className={styles.itemList}>
          {items.map((item) => (
            <div key={item.product.slug} className={styles.item}>
              <div className={styles.itemMedia}>
                <div className={styles.itemImgPlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.itemDetails}>
                <div className={styles.itemInfo}>
                  <h3>{item.product.name}</h3>
                  <p className={styles.itemType}>
                    {item.product.category === "software"
                      ? "Perpetual License (2 Mac Activations)"
                      : item.product.category}
                  </p>
                </div>

                <div className={styles.itemQtyPrice}>
                  <div className={styles.qtySelector}>
                    <button
                      onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                      className={styles.qtyBtn}
                      aria-label="Decrease"
                    >−</button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                      className={styles.qtyBtn}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <span className={styles.itemPrice}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.product.slug)}
                className={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <div className={styles.divider} />

        {/* Order Summary & Promo Code */}
        <section className={styles.summarySection}>

          <div className={styles.promoBox}>
            <h3>Promo Code / Discount Voucher</h3>
            {appliedCoupon ? (
              <div className={styles.appliedBadge}>
                <span>✓ Code <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountPercent > 0 ? `${appliedCoupon.discountPercent}% OFF` : `-$${appliedCoupon.discountAmount}`})</span>
                <button type="button" onClick={removeCoupon} className={styles.removeCouponBtn}>Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                <input
                  type="text"
                  placeholder="Enter code e.g. QUADRA10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={styles.couponInput}
                />
                <button type="submit" className={styles.couponBtn} disabled={couponLoading}>
                  {couponLoading ? "Applying..." : "Apply"}
                </button>
              </form>
            )}
            {couponError && <p className={styles.couponError}>{couponError}</p>}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                <span>Discount ({appliedCoupon.code})</span>
                <span>-${discountTotal.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span className={styles.free}>Instant Digital</span>
            </div>

            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>

            <Link href="/store/checkout/gate" className="apple-button-primary" style={{ width: "100%", padding: "14px", marginTop: "12px" }}>
              Check Out
            </Link>
          </div>

        </section>

        {related.length > 0 && (
          <>
            <div className={styles.divider} />
            <section className={styles.related}>
              <h2 className={styles.relatedTitle}>
                You might also like.
              </h2>
              <div className={styles.relatedGrid}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/store/${p.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedInfo}>
                      <h3>{p.name}</h3>
                      <p>{p.priceLabel}</p>
                      <span className={styles.relatedLearn}>Learn more</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
}
