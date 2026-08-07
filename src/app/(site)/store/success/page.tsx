"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { QUADRA_CTAS } from "@/data/brand.messaging";
import {
  fetchPublishedReleases,
  pickLatestStable,
  type ProductRelease,
} from "@/lib/releases";
import styles from "./success.module.scss";

function SuccessInner() {
  const params = useSearchParams();
  const status =
    params.get("status") === "pending_fulfillment" ? "pending_fulfillment" : "ok";
  const order = params.get("order");
  const paypal = params.get("paypal");
  const [latest, setLatest] = useState<ProductRelease | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPublishedReleases()
      .then((rows) => {
        if (!alive) return;
        setLatest(pickLatestStable(rows) || null);
      })
      .catch(() => {
        if (!alive) return;
        setLatest(null);
      });
    return () => {
      alive = false;
    };
  }, []);

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
            ? `Order ${order} is confirmed. Download MATRIX, then open your account to manage seats.`
            : "Your order is confirmed. Download MATRIX, then open your account to manage seats."}
        </p>
        <div className={styles.actions}>
          {latest ? (
            <a
              href={latest.downloadUrl}
              className="btn btn-primary"
              download={latest.downloadFilename}
            >
              Download MATRIX
            </a>
          ) : (
            <Link href={QUADRA_CTAS.releases.href} className="btn btn-primary">
              Downloads
            </Link>
          )}
          <Link href="/account" className="btn btn-secondary">
            Go to account
          </Link>
          <Link href={QUADRA_CTAS.releases.href} className="btn btn-secondary">
            Release notes
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
