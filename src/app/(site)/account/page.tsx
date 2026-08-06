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
import { downloadOrderInvoice } from "@/lib/accountInvoice";
import {
  PRODUCT_SLUG_ALIASES,
  formatAccountDate,
  formatAccountDateTime,
  licenseTermLabel,
  orderDiscount,
  orderGross,
  shortHardwareId,
  type AccountLicense,
  type AccountOrder,
  type AccountPayload,
} from "@/lib/accountTypes";
import styles from "./account.module.scss";

function AccountInner() {
  const { user, isLoading, ensureAccessToken, needsReauth, logout } = useAuth();
  const { getBySlug } = useCatalog();
  const searchParams = useSearchParams();
  const purchased = searchParams.get("purchased") === "1";
  const orderRef = searchParams.get("order");

  const productName = (slug: string) =>
    getBySlug(slug)?.name ||
    getSeedProduct(slug)?.name ||
    PRODUCT_SLUG_ALIASES[slug] ||
    slug;

  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [licenses, setLicenses] = useState<AccountLicense[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [seatBusy, setSeatBusy] = useState<string | null>(null);
  const [seatError, setSeatError] = useState<string | null>(null);

  const reloadAccount = async () => {
    if (!user?.id) return;
    const accessToken = await ensureAccessToken({ interactive: false });
    const data = await callEdgeFunction<AccountPayload>(
      "store-account",
      { googleAccessToken: accessToken },
      accessToken
    );
    setOrders(data.orders || []);
    setLicenses(
      (data.licenses || []).map((license) => ({
        ...license,
        seats_used: Number(license.seats_used) || 0,
        seats_max: Number(license.seats_max) || 2,
        activations: license.activations || [],
      }))
    );
  };

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
        const accessToken = await ensureAccessToken({ interactive: false });
        const data = await callEdgeFunction<AccountPayload>(
          "store-account",
          { googleAccessToken: accessToken },
          accessToken
        );
        if (cancelled) return;
        setOrders(data.orders || []);
        setLicenses(
          (data.licenses || []).map((license) => ({
            ...license,
            seats_used: Number(license.seats_used) || 0,
            seats_max: Number(license.seats_max) || 2,
            activations: license.activations || [],
          }))
        );
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

  const releaseSeat = async (license: AccountLicense, hardwareId: string) => {
    const key = `${license.id}:${hardwareId}`;
    const label = shortHardwareId(hardwareId);
    if (
      !window.confirm(
        `Release seat ${label}? You can activate another Mac later from MATRIX.`
      )
    ) {
      return;
    }
    setSeatBusy(key);
    setSeatError(null);
    try {
      const accessToken = await ensureAccessToken({ interactive: true });
      await callEdgeFunction(
        "license-activate",
        {
          action: "deactivate",
          googleAccessToken: accessToken,
          hardwareId,
          productSlug: license.product_slug,
        },
        accessToken
      );
      await reloadAccount();
    } catch (err) {
      setSeatError(
        err instanceof Error ? err.message : "Could not release seat"
      );
    } finally {
      setSeatBusy(null);
    }
  };

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
        {needsReauth ? (
          <div className={styles.banner} role="status">
            Your Google session needs a refresh to load licenses.{" "}
            <a href="/login?returnTo=/account">Sign in again</a>
            {" · "}
            <button
              type="button"
              className={styles.textBtn}
              onClick={() => logout()}
            >
              Sign out
            </button>
          </div>
        ) : null}

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

        {seatError ? (
          <div className={styles.banner} role="status">
            {seatError}
          </div>
        ) : null}

        <section className={styles.section}>
          <h2>Licenses</h2>
          <p className={styles.sectionLede}>
            Perpetual seats tied to your Quadra ID. Activate from MATRIX on each
            Mac — up to two machines at a time.
          </p>
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
            <ul className={styles.cardList}>
              {licenses.map((license) => (
                <li key={license.id || `${license.product_slug}-${license.issued_at}`}>
                  <div className={styles.cardHead}>
                    <div>
                      <h3>{productName(license.product_slug)}</h3>
                      <p className={styles.meta}>
                        {licenseTermLabel(license.expires_at)} · Issued{" "}
                        {formatAccountDate(license.issued_at)}
                        {license.order_number
                          ? ` · Order ${license.order_number}`
                          : ""}
                      </p>
                    </div>
                    <span
                      className={`${styles.badge} ${
                        license.status === "active" ? styles.badgeOk : ""
                      }`}
                    >
                      {license.status}
                    </span>
                  </div>

                  <dl className={styles.facts}>
                    <div>
                      <dt>Seats</dt>
                      <dd>
                        {license.seats_used} of {license.seats_max} used
                      </dd>
                    </div>
                    <div>
                      <dt>Product ID</dt>
                      <dd>
                        <code>{license.product_slug}</code>
                      </dd>
                    </div>
                  </dl>

                  <div className={styles.seats}>
                    <p className={styles.seatsLabel}>Activated Macs</p>
                    {!license.activations?.length ? (
                      <p className={styles.emptyInline}>
                        No Mac bound yet. Open Authorization in MATRIX to
                        activate a seat.
                      </p>
                    ) : (
                      <ul className={styles.seatList}>
                        {license.activations.map((seat) => {
                          const busyKey = `${license.id}:${seat.hardware_id}`;
                          return (
                            <li key={seat.hardware_id}>
                              <div>
                                <code>{shortHardwareId(seat.hardware_id)}</code>
                                <span>
                                  Bound {formatAccountDateTime(seat.activated_at)}
                                </span>
                              </div>
                              <button
                                type="button"
                                className={styles.ghostBtn}
                                disabled={seatBusy === busyKey}
                                onClick={() =>
                                  void releaseSeat(license, seat.hardware_id)
                                }
                              >
                                {seatBusy === busyKey
                                  ? "Releasing…"
                                  : "Release seat"}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <Link href="/support/article/getting-started">
                      Activation help
                    </Link>
                    <Link href="/products/matrix">MATRIX overview</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2>Orders</h2>
          <p className={styles.sectionLede}>
            Purchase history with line items, totals, and a downloadable receipt.
          </p>
          {loadingAccount ? (
            <p className={styles.empty}>Loading…</p>
          ) : loadError ? (
            <p className={styles.empty}>Could not load orders right now.</p>
          ) : !orders.length ? (
            <p className={styles.empty}>No purchases yet.</p>
          ) : (
            <ul className={styles.cardList}>
              {orders.map((order) => {
                const currency = order.currency || "USD";
                const paid = Number(order.total_amount) || 0;
                const gross = orderGross(order);
                const discount = orderDiscount(order);
                const items = order.items || [];

                return (
                  <li key={order.order_number}>
                    <div className={styles.cardHead}>
                      <div>
                        <h3>{order.order_number}</h3>
                        <p className={styles.meta}>
                          {formatAccountDateTime(order.created_at)} ·{" "}
                          {order.status}
                        </p>
                      </div>
                      <strong className={styles.totalPaid}>
                        {formatPrice(paid, currency)}
                      </strong>
                    </div>

                    {items.length ? (
                      <table className={styles.lines}>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => {
                            const qty = Number(item.quantity) || 1;
                            const unit = Number(item.unitPrice) || 0;
                            return (
                              <tr key={`${item.slug}-${index}`}>
                                <td>{item.name || productName(item.slug)}</td>
                                <td>{qty}</td>
                                <td>
                                  {formatPrice(
                                    unit * qty,
                                    item.currency || currency
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className={styles.emptyInline}>
                        Line items were not stored for this order.
                      </p>
                    )}

                    <dl className={styles.totals}>
                      <div>
                        <dt>Subtotal</dt>
                        <dd>{formatPrice(gross, currency)}</dd>
                      </div>
                      {discount > 0 ? (
                        <div>
                          <dt>
                            Discount
                            {order.coupon_code ? ` (${order.coupon_code})` : ""}
                          </dt>
                          <dd>−{formatPrice(discount, currency)}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>Tax</dt>
                        <dd>{formatPrice(0, currency)}</dd>
                      </div>
                      <div className={styles.totalsGrand}>
                        <dt>Total paid</dt>
                        <dd>{formatPrice(paid, currency)}</dd>
                      </div>
                    </dl>

                    <p className={styles.taxNote}>
                      Tax was not itemized separately for this digital purchase
                      {order.paypal_order_id
                        ? ` · PayPal ${order.paypal_order_id}`
                        : ""}
                      .
                    </p>

                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          downloadOrderInvoice(order, user.email)
                        }
                      >
                        Download invoice
                      </button>
                    </div>
                  </li>
                );
              })}
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
