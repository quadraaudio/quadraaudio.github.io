"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSeedProduct } from "@/data/products.seed";
import { useAuth } from "@/components/providers/AuthProvider";
import { callEdgeFunction } from "@/lib/edgeApi";
import { formatPrice } from "@/lib/products";
import styles from "./account.module.scss";

function productName(slug: string) {
  return getSeedProduct(slug)?.name || slug;
}

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<
    Array<{
      order_number: string;
      total_amount: number;
      currency: string;
      status: string;
      created_at: string;
    }>
  >([]);
  const [licenses, setLicenses] = useState<
    Array<{ product_slug: string; status: string; issued_at: string }>
  >([]);
  const [loadError, setLoadError] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);

  useEffect(() => {
    if (!user?.accessToken) {
      setOrders([]);
      setLicenses([]);
      return;
    }
    let cancelled = false;
    setLoadingAccount(true);
    setLoadError(false);
    callEdgeFunction<{
      orders?: typeof orders;
      licenses?: typeof licenses;
    }>(
      "store-account",
      { googleAccessToken: user.accessToken },
      user.accessToken
    )
      .then((data) => {
        if (cancelled) return;
        setOrders(data.orders || []);
        setLicenses(data.licenses || []);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingAccount(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p>Loading account…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Account</p>
          <h1 className="display display-lg">Sign in to manage licenses.</h1>
          <a href="/login?returnTo=/account" className="btn btn-primary">
            Sign in with Google
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Account</p>
        <h1 className="display display-lg">
          Hello{user.name ? `, ${user.name}` : ""}.
        </h1>
        <p className={styles.email}>{user.email}</p>

        {loadError ? (
          <div className={styles.banner} role="status">
            Order history is temporarily unavailable. Try signing in again or
            contact support if a payment just completed.
          </div>
        ) : null}

        <section className={styles.section}>
          <h2>Licenses</h2>
          {loadingAccount ? (
            <p className={styles.empty}>Loading…</p>
          ) : loadError ? (
            <p className={styles.empty}>Could not load licenses right now.</p>
          ) : !licenses.length ? (
            <p className={styles.empty}>
              You have not purchased any licenses yet.{" "}
              <Link href="/store">Browse the store</Link>
            </p>
          ) : (
            <ul className={styles.list}>
              {licenses.map((license) => (
                <li key={`${license.product_slug}-${license.issued_at}`}>
                  <strong>{productName(license.product_slug)}</strong>
                  <span>{license.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2>Orders</h2>
          {loadingAccount ? (
            <p className={styles.empty}>Loading…</p>
          ) : loadError ? (
            <p className={styles.empty}>Could not load orders right now.</p>
          ) : !orders.length ? (
            <p className={styles.empty}>No purchases yet.</p>
          ) : (
            <ul className={styles.list}>
              {orders.map((order) => (
                <li key={order.order_number}>
                  <strong>{order.order_number}</strong>
                  <span>
                    {formatPrice(Number(order.total_amount), order.currency || "USD")} ·{" "}
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
