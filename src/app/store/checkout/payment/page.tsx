"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/products";
import { syncLicenseToSupabase } from "@/lib/supabase";
import styles from "./page.module.scss";

export default function PaymentPage() {
  const {
    items,
    totalPrice,
    appliedCoupon,
    discountTotal,
    finalPrice,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [isCompleted, setIsCompleted] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Default item fallback if cart was empty
  const defaultHydra = products[0];
  const displayItems = items.length > 0 ? items : [{ product: defaultHydra, quantity: 1 }];
  const displayTotalPrice = items.length > 0 ? totalPrice : defaultHydra.price;

  let displayDiscount = discountTotal;
  if (items.length === 0 && appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      displayDiscount = (defaultHydra.price * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount > 0) {
      displayDiscount = Math.min(defaultHydra.price, appliedCoupon.discountAmount);
    }
  }

  const displayFinalPrice = Math.max(0, displayTotalPrice - displayDiscount);
  const isFreeOrder = displayFinalPrice === 0;

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

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sync license directly to Supabase & Local session
    const email = user?.email || "customer@quadraaudio.com";
    const name = user?.name || "Customer";
    await syncLicenseToSupabase(email, name, "hydra");

    setIsCompleted(true);
    clearCart();
  };

  if (isCompleted) {
    return (
      <div className={styles.page}>
        <ThemeSwitcher forceTheme="light" />
        <div className={styles.successContainer}>
          <div className={styles.checkIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Thank you for your order.</h1>
          <p className={styles.orderNumber}>Order number: QDR-89210492</p>
          <p className={styles.successSub}>
            We've sent a confirmation email with your license keys and download instructions. Your license is now active on your Quadra ID.
          </p>
          <Link href="/account" className={styles.primaryBtn}>
            Go to Your Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Checkout</h1>
          <p>{isFreeOrder ? "Review your complimentary order." : "Review your order and select a payment method."}</p>
        </header>

        <div className={styles.layoutGrid}>
          {/* Main Form Column */}
          <div className={styles.mainColumn}>
            
            {isFreeOrder ? (
              /* =========================================
                 Zero-Payment Mode ($0.00 Order - 100% OFF)
                 ========================================= */
              <section className={styles.section}>
                <h2>Order Summary &amp; License Activation</h2>
                <div className={styles.freeOrderNoticeCard}>
                  <div className={styles.freeOrderIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className={styles.freeOrderTitle}>No payment required</h3>
                    <p className={styles.freeOrderDesc}>
                      Your promo code <strong>{appliedCoupon?.code}</strong> covers 100% of this order (${displayTotalPrice.toFixed(2)} discount applied).
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCompleteOrder}>
                  <button type="submit" className={styles.payBtn}>
                    Complete Order &amp; Activate License ($0.00)
                  </button>
                </form>
              </section>
            ) : (
              /* =========================================
                 Standard Payment Methods (> $0.00)
                 ========================================= */
              <>
                <section className={styles.section}>
                  <h2>Payment Method</h2>
                  
                  <div className={styles.paymentMethods}>
                    {/* PayPal Radio Card */}
                    <label className={`${styles.methodCard} ${paymentMethod === "paypal" ? styles.selected : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                      />
                      <div className={styles.methodInfo}>
                        <span className={styles.methodName}>PayPal</span>
                        <span className={styles.methodDesc}>Fast and secure checkout via PayPal account.</span>
                      </div>
                      <div className={styles.paypalLogo}>
                        <svg width="60" height="16" viewBox="0 0 124 33" fill="none">
                          <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-4.32 27.382a.57.57 0 0 0 .564.658h3.804c.478 0 .884-.351.958-.822l1.228-7.781c.074-.471.48-.822.958-.822h2.518c5.228 0 8.243-2.528 9.034-7.545.362-2.289.043-4.1-1.025-5.26-1.189-1.293-3.262-1.694-5.945-1.694zm.824 7.625c-.456 2.971-2.738 2.971-4.908 2.971h-1.468l.995-6.294c.032-.2.203-.346.406-.346h.547c1.472 0 2.964 0 3.731.895.467.545.545 1.554.297 2.774z" fill="#003087"/>
                          <path d="M18.847 6.749h-6.839a.95.95 0 0 0-.939.802L6.75 34.933a.57.57 0 0 0 .564.658h3.804c.478 0 .884-.351.958-.822l1.228-7.781c.074-.471.48-.822.958-.822h2.518c5.228 0 8.243-2.528 9.034-7.545.362-2.289.043-4.1-1.025-5.26-1.189-1.293-3.262-1.694-5.945-1.694zm.824 7.625c-.456 2.971-2.738 2.971-4.908 2.971h-1.468l.995-6.294c.032-.2.203-.346.406-.346h.547c1.472 0 2.964 0 3.731.895.467.545.545 1.554.297 2.774z" fill="#0079C1"/>
                        </svg>
                      </div>
                    </label>

                    {/* Credit Card Radio Card */}
                    <label className={`${styles.methodCard} ${paymentMethod === "card" ? styles.selected : ""}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      <div className={styles.methodInfo}>
                        <span className={styles.methodName}>Credit or Debit Card</span>
                        <span className={styles.methodDesc}>Visa, Mastercard, American Express</span>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Dynamic Form based on payment method */}
                {paymentMethod === "card" ? (
                  <section className={styles.section}>
                    <h2>Card Details</h2>
                    <form onSubmit={handleCompleteOrder} className={styles.cardForm}>
                      <div className={styles.inputGroup}>
                        <input type="text" id="cardName" placeholder=" " required />
                        <label htmlFor="cardName">Name on Card</label>
                      </div>
                      <div className={styles.inputGroup}>
                        <input type="text" id="cardNumber" placeholder=" " required />
                        <label htmlFor="cardNumber">Card Number</label>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <input type="text" id="exp" placeholder=" " required />
                          <label htmlFor="exp">MM/YY</label>
                        </div>
                        <div className={styles.inputGroup}>
                          <input type="text" id="cvv" placeholder=" " required />
                          <label htmlFor="cvv">CVV</label>
                        </div>
                      </div>
                      <button type="submit" className={styles.payBtn}>
                        Pay ${displayFinalPrice.toFixed(2)}
                      </button>
                    </form>
                  </section>
                ) : (
                  <section className={styles.section}>
                    <h2>PayPal Payment</h2>
                    <p className={styles.paypalNotice}>
                      Clicking Complete Order will redirect you to PayPal to authorize the transaction safely.
                    </p>
                    <form onSubmit={handleCompleteOrder}>
                      <button type="submit" className={styles.paypalBtn}>
                        Complete Order with PayPal (${displayFinalPrice.toFixed(2)})
                      </button>
                    </form>
                  </section>
                )}
              </>
            )}

          </div>

          {/* Sidebar Summary Column */}
          <div className={styles.sidebarColumn}>

            {/* Promo Code Box */}
            <div className={styles.promoCard}>
              <h4>Promo Code / Coupon</h4>
              {appliedCoupon ? (
                <div className={styles.appliedBadge}>
                  <span>✓ Code <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountPercent > 0 ? `${appliedCoupon.discountPercent}% OFF` : `-$${appliedCoupon.discountAmount}`})</span>
                  <button type="button" onClick={removeCoupon} className={styles.removeCouponBtn}>Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="e.g. QUADRA10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={styles.couponInput}
                  />
                  <button type="submit" className={styles.couponBtn} disabled={couponLoading}>
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}
              {couponError && <p className={styles.couponError}>{couponError}</p>}
            </div>

            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              
              <div className={styles.itemsList}>
                {displayItems.map((item) => (
                  <div key={item.product.slug} className={styles.summaryItem}>
                    <div>
                      <strong>{item.product.name}</strong>
                      <p>Perpetual License (macOS)</p>
                    </div>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryTotals}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>${displayTotalPrice.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className={styles.row} style={{ color: "#1b5e20", fontWeight: 500 }}>
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${displayDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className={styles.row}>
                  <span>Shipping</span>
                  <span className={styles.free}>FREE</span>
                </div>
                <div className={`${styles.row} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>${displayFinalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
