"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getSeedProduct } from "@/data/products.seed";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { callEdgeFunction } from "@/lib/edgeApi";
import { formatPrice } from "@/lib/products";
import styles from "./account.module.scss";

function AccountInner() {
  const { user, isLoading, ensureAccessToken } = useAuth();
  const { getBySlug } = useCatalog();
  const searchParams = useSearchParams();
  const purchased = searchParams.get("purchased") === "1";
  const orderRef = searchParams.get("order");

  const productName = (slug: string) =>
    getBySlug(slug)?.name || getSeedProduct(slug)?.name || slug;

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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setOrders([]);
      setLicenses([]);
      setLoadingAccount(false);
      return;
    }

    let cancelled = false;
    setLoadingAccount(true);
    setLoadError(null);

    (async () => {
      try {
        const accessToken = await ensureAccessToken();
        const data = await callEdgeFunction<{
          orders?: typeof orders;
          licenses?: typeof licenses;
          error?: string;
        }>("store-account", { googleAccessToken: accessToken }, accessToken);
        if (cancelled) return;
        setOrders(data.orders || []);
        setLicenses(data.licenses || []);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Could not load account data"
        );
      } finally {
        if (!cancelled) setLoadingAccount(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // ensureAccessToken is stable; only reload when the signed-in user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

        {purchased ? (
          <div className={styles.banner} role="status">
            Purchase complete
            {orderRef ? ` — order ${orderRef}` : ""}. Your licenses are listed
            below.
          </div>
        ) : null}

        {loadError ? (
          <div className={styles.banner} role="status">
            {loadError}. Try refreshing the page or{" "}
            <a href="/login?returnTo=/account">sign in again</a>.
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
                    {formatPrice(
                      Number(order.total_amount),
                      order.currency || "USD"
                    )}{" "}
                    · {order.status}
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

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className="page-shell">
            <p>Loading account…</p>
          </div>
        </main>
      }
    >
      <AccountInner />
    </Suspense>
  );
}
