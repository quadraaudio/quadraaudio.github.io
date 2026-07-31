"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { PayPalCheckout } from "@/components/store/PayPalCheckout";
import { getSeedProduct } from "@/data/products.seed";
import { callEdgeFunction } from "@/lib/edgeApi";
import { formatPrice } from "@/lib/products";
import styles from "./checkout.module.scss";

const PRESETS: Record<string, { percent: number; amount: number }> = {
  QUADRA10: { percent: 10, amount: 0 },
  LAUNCH20: { percent: 20, amount: 0 },
  STUDIO50: { percent: 50, amount: 0 },
  FREE100: { percent: 100, amount: 0 },
};

export function CheckoutClient({ paypalClientId }: { paypalClientId: string }) {
  const { user } = useAuth();
  const { items, clear, hydrated } = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!hydrated) return;
    if (!items.length) {
      startTransition(() => {
        router.replace("/store/bag");
      });
    }
  }, [hydrated, items.length, router]);

  const pricedLines = useMemo(() => {
    return items.map((item) => {
      const live = getSeedProduct(item.slug);
      const unitPrice = live?.price ?? item.price;
      const name = live?.name ?? item.name;
      const priceChanged = live != null && live.price !== item.price;
      return {
        ...item,
        name,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        priceChanged,
      };
    });
  }, [items]);

  const subtotal = useMemo(
    () => pricedLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [pricedLines]
  );

  const priceUpdated = pricedLines.some((line) => line.priceChanged);

  const total = useMemo(() => {
    if (!applied) return subtotal;
    const percentOff = subtotal * ((applied.discountPercent || 0) / 100);
    const amountOff = applied.discountAmount || 0;
    return Math.max(0, Number((subtotal - percentOff - amountOff).toFixed(2)));
  }, [subtotal, applied]);

  const isFree = total <= 0 && items.length > 0;

  async function applyCoupon() {
    setBusy(true);
    setCouponError(null);
    try {
      const upper = coupon.trim().toUpperCase();
      const preset = PRESETS[upper];
      if (!preset) {
        setApplied(null);
        setCouponError("Invalid or expired promo code");
        return;
      }
      setApplied({
        code: upper,
        discountPercent: preset.percent,
        discountAmount: preset.amount,
      });
    } finally {
      setBusy(false);
    }
  }

  async function claimFree() {
    if (!user?.accessToken) {
      setClaimError("Sign in with Google again, then claim.");
      return;
    }
    setClaiming(true);
    setClaimError(null);
    try {
      const data = await callEdgeFunction<{
        persisted?: boolean;
        orderNumber?: string;
        error?: string;
      }>(
        "store-checkout-free",
        {
          googleAccessToken: user.accessToken,
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          couponCode: applied?.code || undefined,
        },
        user.accessToken
      );
      if (!data.persisted) {
        throw new Error(data.error || "Could not claim license");
      }
      clear();
      router.push(
        `/store/success/?status=ok&order=${encodeURIComponent(data.orderNumber || "")}`
      );
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Claim failed");
      setClaiming(false);
    }
  }

  if (!hydrated || pending || !items.length) {
    return (
      <p className={styles.priceNoteBlock} role="status">
        Loading checkout…
      </p>
    );
  }

  return (
    <div className={styles.layout}>
      <section className={styles.panel}>
        <h2>Order summary</h2>
        <ul>
          {pricedLines.map((item) => (
            <li key={item.slug}>
              <span>
                {item.name} × {item.quantity}
                {item.priceChanged ? (
                  <em className={styles.priceNote}> · price updated</em>
                ) : null}
              </span>
              <strong>{formatPrice(item.lineTotal, item.currency)}</strong>
            </li>
          ))}
        </ul>
        {priceUpdated ? (
          <p className={styles.priceNoteBlock}>
            Prices refreshed from the live catalog before payment.
          </p>
        ) : null}
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
        {applied ? <p className={styles.ok}>Applied {applied.code}</p> : null}
        <div className={styles.total}>
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        {isFree ? (
          <>
            <h2>Claim your license</h2>
            <p className={styles.freeCopy}>
              This order totals $0. No PayPal payment is required — we will issue
              licenses to your account immediately.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={claimFree}
              disabled={claiming}
            >
              {claiming ? "Claiming…" : "Claim license"}
            </button>
            {claimError ? (
              <p className={styles.error} role="alert">
                {claimError}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <h2>Pay with PayPal</h2>
            {!paypalClientId ? (
              <p className={styles.priceNoteBlock}>
                PayPal is not configured. Set{" "}
                <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>.
              </p>
            ) : (
              <PayPalCheckout couponCode={applied?.code} />
            )}
          </>
        )}
      </section>
    </div>
  );
}
