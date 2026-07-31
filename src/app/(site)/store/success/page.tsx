"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./success.module.scss";

function SuccessInner() {
  const params = useSearchParams();
  const status =
    params.get("status") === "pending_fulfillment" ? "pending_fulfillment" : "ok";
  const order = params.get("order");
  const paypal = params.get("paypal");

  if (status === "pending_fulfillment") {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Payment received</p>
          <h1 className="display display-lg">License pending.</h1>
          <p className="lede">
            Your payment went through, but we could not issue licenses
            automatically. Your bag was kept so you do not lose the order.
            Contact support with your PayPal reference and we will fulfill it.
          </p>
          {order ? (
            <p className={styles.meta}>
              Order reference: <code>{order}</code>
            </p>
          ) : null}
          {paypal ? (
            <p className={styles.meta}>
              PayPal order id: <code>{paypal}</code>
            </p>
          ) : null}
          <div className={styles.actions}>
            <Link href="/support" className="btn btn-primary">
              Contact support
            </Link>
            <Link href="/account" className="btn btn-secondary">
              Account
            </Link>
            <Link href="/store" className="btn btn-secondary">
              Store
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Success</p>
        <h1 className="display display-lg">You&apos;re all set.</h1>
        <p className="lede">
          {order
            ? `Order ${order} is confirmed. Your licenses are available in your account.`
            : "Your order is confirmed. Your licenses are available in your account."}
        </p>
        <div className={styles.actions}>
          <Link href="/account" className="btn btn-primary">
            Go to account
          </Link>
          <Link href="/store" className="btn btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className="page-shell">
            <p>Loading…</p>
          </div>
        </main>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
