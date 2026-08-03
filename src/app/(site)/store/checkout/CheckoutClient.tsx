"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TermsAcceptModal } from "@/components/legal/TermsAcceptModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { PayPalCheckout } from "@/components/store/PayPalCheckout";
import { callEdgeFunction } from "@/lib/edgeApi";
import {
  applyCouponToSubtotal,
  resolveCoupon,
  type ResolvedCoupon,
} from "@/lib/coupons";
import { formatPrice } from "@/lib/products";
import { hasAcceptedCurrentTerms } from "@/lib/termsAcceptance";
import styles from "./checkout.module.scss";

export function CheckoutClient({ paypalClientId }: { paypalClientId: string }) {
  const { user, ensureAccessToken } = useAuth();
  const { items, clear, hydrated } = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<ResolvedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [pending, startTransition] = useTransition();
  const completingRef = useRef(false);
  const [termsOk, setTermsOk] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    setTermsOk(hasAcceptedCurrentTerms());
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (completingRef.current || claiming) return;
    if (!items.length) {
      startTransition(() => {
        router.replace("/store/bag");
      });
    }
  }, [hydrated, items.length, claiming, router]);

  const pricedLines = useMemo(() => {
    return items.map((item) => {
      const unitPrice = item.price;
      return {
        ...item,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });
  }, [items]);

  const subtotal = useMemo(
    () => pricedLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [pricedLines]
  );

  const total = useMemo(
    () => Number(applyCouponToSubtotal(subtotal, applied).toFixed(2)),
    [subtotal, applied]
  );

  const isFree = total <= 0 && items.length > 0;

  async function applyCoupon() {
    setBusy(true);
    setCouponError(null);
    try {
      const resolved = await resolveCoupon(coupon);
      if (!resolved) {
        setApplied(null);
        setCouponError("Invalid or expired promo code");
        return;
      }
      setApplied(resolved);
      setCoupon(resolved.code);
    } finally {
      setBusy(false);
    }
  }

  async function claimFree() {
    if (!hasAcceptedCurrentTerms()) {
      setShowTerms(true);
      setClaimError("Accept the Terms of Use before claiming a license.");
      return;
    }
    if (!user) {
      setClaimError("Sign in with Google again, then claim.");
      return;
    }
    if (!applied) {
      setClaimError("Apply a valid 100% promo code first.");
      return;
    }
    setClaiming(true);
    setClaimError(null);
    try {
      const accessToken = await ensureAccessToken();
      const data = await callEdgeFunction<{
        persisted?: boolean;
        orderNumber?: string;
        error?: string;
      }>(
        "store-checkout-free",
        {
          googleAccessToken: accessToken,
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          couponCode: applied.code,
        },
        accessToken
      );
      if (!data.persisted) {
        throw new Error(data.error || "Could not claim license");
      }
      completingRef.current = true;
      clear();
      router.replace(
        `/account?purchased=1&order=${encodeURIComponent(data.orderNumber || "")}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Claim failed";
      setClaimError(
        /unauthorized|expired/i.test(message)
          ? "Google session expired. Click Claim again to refresh sign-in."
          : message
      );
      setClaiming(false);
    }
  }

  if (!hydrated || (pending && !completingRef.current) || (!items.length && !completingRef.current && !claiming)) {
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
              </span>
              <strong>{formatPrice(item.lineTotal, item.currency)}</strong>
            </li>
          ))}
        </ul>
        <div className={styles.coupon}>
          <input
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value);
              if (applied) setApplied(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void applyCoupon();
              }
            }}
            placeholder="Promo code"
            aria-label="Promo code"
            autoCapitalize="characters"
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void applyCoupon()}
            disabled={busy || !coupon.trim()}
          >
            {busy ? "Checking…" : "Apply"}
          </button>
        </div>
        {couponError ? <p className={styles.error}>{couponError}</p> : null}
        {applied ? (
          <p className={styles.ok}>
            Applied {applied.code}
            {applied.discountPercent
              ? ` (−${applied.discountPercent}%)`
              : ""}
            {applied.discountAmount
              ? ` (−${formatPrice(applied.discountAmount)})`
              : ""}
          </p>
        ) : null}
        <div className={styles.total}>
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.termsBlock}>
          <h2>Terms of Use</h2>
          <p className={styles.freeCopy}>
            You must scroll through and accept the Quadra Terms of Use &amp;
            EULA before purchasing or claiming a license.
          </p>
          {termsOk ? (
            <p className={styles.ok} role="status">
              Terms accepted. You may complete your order.
            </p>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowTerms(true)}
            >
              Review &amp; accept Terms
            </button>
          )}
        </div>

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
              onClick={() => void claimFree()}
              disabled={claiming || !termsOk}
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
            {!termsOk ? (
              <p className={styles.priceNoteBlock}>
                Accept the Terms above to enable PayPal.
              </p>
            ) : !paypalClientId ? (
              <p className={styles.priceNoteBlock}>
                PayPal is not configured yet. Use a 100% promo code (for example{" "}
                <code>FREE100</code> or <code>VIP100</code>) to claim a license.
              </p>
            ) : (
              <PayPalCheckout
                couponCode={applied?.code}
                requireTermsAccepted
              />
            )}
          </>
        )}
      </section>

      <TermsAcceptModal
        open={showTerms}
        onAccepted={() => {
          setTermsOk(true);
          setShowTerms(false);
          setClaimError(null);
        }}
        onDismiss={() => setShowTerms(false)}
      />
    </div>
  );
}
