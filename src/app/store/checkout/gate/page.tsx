"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/app/hydra/ThemeSwitcher";
import { useCart } from "@/contexts/CartContext";
import styles from "./page.module.scss";

export default function CheckoutGatePage() {
  const [email, setEmail] = useState("");
  const { totalPrice } = useCart();
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login → go to payment
    router.push("/store/checkout/payment");
  };

  return (
    <div className={styles.page}>
      <ThemeSwitcher forceTheme="light" />

      <div className={styles.container}>

        <h1 className={styles.title}>
          Sign in to check out faster.
        </h1>

        <div className={styles.columns}>

          {/* Left: Sign in with Quadra ID */}
          <div className={styles.column}>
            <h2 className={styles.colTitle}>Check out with your Quadra ID</h2>
            <p className={styles.colDesc}>
              Your order information and licenses will be saved to your account.
            </p>

            <form onSubmit={handleSignIn} className={styles.form}>
              <div className={styles.emailRow}>
                <input
                  id="gateEmail"
                  type="email"
                  placeholder="Email or Quadra ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  autoComplete="email"
                />
                <button type="submit" className={styles.arrowBtn} aria-label="Continue">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z"/>
                  </svg>
                </button>
              </div>

              <div className={styles.rememberRow}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <Link href="#" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </form>
          </div>

          <div className={styles.columnDivider} />

          {/* Right: Continue as guest */}
          <div className={styles.column}>
            <h2 className={styles.colTitle}>Guest Checkout</h2>
            <p className={styles.colDesc}>
              Continue without a Quadra ID. You can create one later.
            </p>

            <Link href="/store/checkout/payment" className={styles.guestBtn}>
              Continue as Guest
            </Link>
          </div>

        </div>

        {/* Footer */}
        <footer className={styles.gateFooter}>
          <p>
            Need more help?{" "}
            <Link href="/support">Contact support</Link>
          </p>
        </footer>

      </div>
    </div>
  );
}
