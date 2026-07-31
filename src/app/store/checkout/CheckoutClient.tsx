"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeSetter from "@/components/ThemeSetter";
import { validateCouponWithSupabase, syncLicenseToSupabase } from "@/lib/supabase";
import type { Product } from "@/data/products";
import styles from "./page.module.scss";

export default function CheckoutClient({ product }: { product: Product }) {
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<{ status: "idle" | "success" | "error"; message?: string; discount?: number }>({ status: "idle" });
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const discountPercent = couponState.status === "success" ? couponState.discount ?? 0 : 0;
  const finalPrice = product.price > 0 ? product.price * (1 - discountPercent / 100) : product.price;

  async function applyCoupon() {
    if (!coupon.trim()) return;
    const result = await validateCouponWithSupabase(coupon);
    if (result.valid) {
      setCouponState({ status: "success", message: `Code applied — ${result.discountPercent}% off`, discount: result.discountPercent });
    } else {
      setCouponState({ status: "error", message: result.error || "Invalid code" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await syncLicenseToSupabase(form.email, `${form.firstName} ${form.lastName}`.trim(), product.slug, finalPrice);
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className={styles.checkoutPage}>
        <ThemeSetter theme="light" />
        <div className={styles.successBox}>
          <h1 className="headline">You&apos;re all set.</h1>
          <p className="body-text">
            A confirmation and your license details have been sent to {form.email}.
          </p>
          <Link href="/account" className="apple-button-primary">
            Go to My Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <ThemeSetter theme="light" />

      <header className={styles.header}>
        <h1 className="headline">Review your bag.</h1>
        <p className="body-text">Free delivery and free returns on all software orders.</p>
      </header>

      <section className={styles.orderSummary}>
        <div className={styles.orderItem}>
          <img
            src={product.cardImage || "/images/hydra_app_icon.jpg"}
            alt={product.name}
            className={styles.itemImage}
          />
          <div className={styles.itemDetails}>
            <div>
              <h3>{product.name}</h3>
              <p>{product.category === "software" ? "Digital License (Perpetual)" : "Hardware"}</p>
            </div>
            <div className={styles.itemPrice}>
              {product.price > 0 ? `$${finalPrice.toFixed(2)}` : product.priceLabel}
            </div>
          </div>
        </div>

        <div className={styles.couponRow}>
          <input
            type="text"
            placeholder="Promo code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button type="button" onClick={applyCoupon}>Apply</button>
        </div>
        {couponState.status !== "idle" && (
          <p className={`${styles.couponMessage} ${couponState.status === "success" ? styles.success : styles.error}`}>
            {couponState.message}
          </p>
        )}

        <div className={styles.orderTotal}>
          <span>Total</span>
          <span>{product.price > 0 ? `$${finalPrice.toFixed(2)}` : product.priceLabel}</span>
        </div>
      </section>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>How would you like to check out?</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? "Processing…" : `Complete Purchase — ${product.price > 0 ? `$${finalPrice.toFixed(2)}` : product.priceLabel}`}
        </button>

        <p className={styles.secureNote}>Your payment is securely processed via PayPal.</p>
      </form>
    </div>
  );
}
