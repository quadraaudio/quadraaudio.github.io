"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { PayPalCheckout } from "@/components/store/PayPalCheckout";
import { formatPrice } from "@/lib/products";
import styles from "./checkout.module.scss";

export function CheckoutClient({ paypalClientId }: { paypalClientId: string }) {
  const { items, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => {
    if (!applied) return subtotal;
    const percentOff = subtotal * ((applied.discountPercent || 0) / 100);
    const amountOff = applied.discountAmount || 0;
    return Math.max(0, subtotal - percentOff - amountOff);
  }, [subtotal, applied]);

  async function applyCoupon() {
    setBusy(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setApplied(null);
        setCouponError(data.error || "Invalid coupon");
        return;
      }
      setApplied({
        code: data.code,
        discountPercent: data.discountPercent || 0,
        discountAmount: data.discountAmount || 0,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.layout}>
      <section className={styles.panel}>
        <h2>Order summary</h2>
        <ul>
          {items.map((item) => (
            <li key={item.slug}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>{formatPrice(item.price * item.quantity, item.currency)}</strong>
            </li>
          ))}
        </ul>
        <div className={styles.coupon}>
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Promo code"
            aria-label="Promo code"
          />
          <button type="button" className="btn btn-secondary" onClick={applyCoupon} disabled={busy}>
            Apply
          </button>
        </div>
        {couponError ? <p className={styles.error}>{couponError}</p> : null}
        {applied ? (
          <p className={styles.ok}>Applied {applied.code}</p>
        ) : null}
        <div className={styles.total}>
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Pay with PayPal</h2>
        <PayPalCheckout
          clientId={paypalClientId}
          couponCode={applied?.code}
        />
      </section>
    </div>
  );
}
