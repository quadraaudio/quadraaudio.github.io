"use client";

import Image from "next/image";
import ThemeSetter from "@/components/ThemeSetter";
import type { Product } from "@/data/products";
import styles from "./page.module.scss";

export default function CheckoutClient({ product }: { product: Product }) {
  return (
    <div className={styles.checkoutPage}>
      <ThemeSetter theme="light" />

      <div className={styles.checkoutContent}>

        <header className={styles.checkoutHeader}>
          <h1>Review your bag.</h1>
          <p>Free delivery and free returns on all software orders.</p>
        </header>

        {/* Order Summary */}
        <section className={styles.orderSummary}>
          <div className={styles.orderItem}>
            <div className={styles.itemMedia}>
              {product.cardImage ? (
                <Image
                  src={product.cardImage}
                  alt={product.name}
                  width={80}
                  height={80}
                  className={styles.itemImage}
                />
              ) : (
                <div className={styles.itemImagePlaceholder} />
              )}
            </div>
            <div className={styles.itemDetails}>
              <div>
                <h3>{product.name}</h3>
                <p>
                  {product.category === "software"
                    ? "Digital License (Perpetual)"
                    : "Hardware"}
                </p>
              </div>
              <div className={styles.itemPrice}>
                {product.price > 0 ? `$${product.price.toFixed(2)}` : product.priceLabel}
              </div>
            </div>
          </div>

          <div className={styles.orderTotal}>
            <span>Total</span>
            <span>
              {product.price > 0 ? `$${product.price.toFixed(2)}` : product.priceLabel}
            </span>
          </div>
        </section>

        {/* Checkout Form */}
        <section className={styles.checkoutSection}>
          <h2>How would you like to check out?</h2>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <input type="text" id="firstName" placeholder=" " autoComplete="given-name" />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="text" id="lastName" placeholder=" " autoComplete="family-name" />
              <label htmlFor="lastName">Last Name</label>
            </div>
            <div className={`${styles.inputGroup} ${styles.formGroupFull}`}>
              <input type="email" id="email" placeholder=" " autoComplete="email" />
              <label htmlFor="email">Email Address</label>
            </div>
            <div className={`${styles.inputGroup} ${styles.formGroupFull}`}>
              <input type="text" id="cardNumber" placeholder=" " autoComplete="cc-number" inputMode="numeric" />
              <label htmlFor="cardNumber">Card Number</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="text" id="expiry" placeholder=" " autoComplete="cc-exp" />
              <label htmlFor="expiry">Expiration Date</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="text" id="cvv" placeholder=" " autoComplete="cc-csc" />
              <label htmlFor="cvv">Security Code</label>
            </div>
          </div>

          <div className={styles.paymentButtons}>
            <button type="button" className={styles.applePayButton} aria-label="Pay with Apple Pay">
              <svg viewBox="0 0 256 109" width="48" height="20" fill="currentColor">
                <path d="M103.8 54.3c0-11.4 9.3-17.1 21.6-17.6-1.5-6.2-7.1-10.7-14.8-10.7-6.2 0-12.7 3.9-15.6 3.9-3.2 0-8.3-3.7-13.7-3.7-7 0-14 3.7-18.1 9.8-8.2 11.9-5.7 35 2.2 46.1 4.1 5.7 8.7 11.7 14.8 11.5 6-.2 8.3-3.7 15.5-3.7 7.2 0 9.2 3.7 15.6 3.6 6.5-.2 10.4-5.5 14.2-11.2 4.4-6.4 6.2-12.5 6.2-12.8-.2-.2-17.9-6.9-17.9-25.2zM91.8 17.6c3.2-3.9 5.4-9.3 4.8-14.8-4.8.2-10.7 3.2-14 7.1-2.9 3.4-5.5 9-4.8 14.5 5.4.4 10.8-2.9 14-6.8zM143.6 27.6h17.9c13.7 0 23.3 8.3 23.3 22 0 13.9-9.5 22.2-23.5 22.2h-5.2v25.2h-12.5V27.6zm12.5 33.7h4.7c6.7 0 11.2-3.8 11.2-11.5 0-7.2-4.5-11.2-11-11.2h-4.9v22.7zM207.3 64.9c-2.3 4.6-5 6.9-9.5 6.9-4.8 0-7.8-2.5-9.3-8.1l-18.1-36.1h13.2l10.9 24.3 9.3-24.3h12.9l-19 45.4c-2.8 6.7-5.7 9.8-11.4 9.8-1.5 0-3.6-.3-5.2-.8v-9.5c1.1.3 2.1.3 3 .3 1.9 0 3.3-.9 4-2.8l-.8-2.1z"/>
              </svg>
            </button>
            <button type="submit" className={styles.primaryButton}>
              Checkout with Credit Card
            </button>
          </div>

          <div className={styles.secureNote}>
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Your payment is securely processed.</span>
          </div>
        </section>

      </div>
    </div>
  );
}
