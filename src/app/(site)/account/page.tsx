"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { QUADRA_CTAS } from "@/data/brand.messaging";
import {
  fetchPublishedReleases,
  formatReleaseDate,
  pickLatestStable,
  type ProductRelease,
} from "@/lib/releases";
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
  const [openOrders, setOpenOrders] = useState<Record<string, boolean>>({});
  const [latestRelease, setLatestRelease] = useState<ProductRelease | null>(
    null,
  );
  const [loadingRelease, setLoadingRelease] = useState(true);

  const reloadAccount = async () => {
    if (!user?.id) return;
    const accessToken = await ensureAccessToken({ interactive: false });
    const data = await callEdgeFunction<AccountPayload>(
      "store-account",
      { googleAccessToken: accessToken },
      accessToken,
    );
    setOrders(data.orders || []);
    setLicenses(
      (data.licenses || []).map((license) => ({
        ...license,
        seats_used: Number(license.seats_used) || 0,
        seats_max: Number(license.seats_max) || 2,
        activations: license.activations || [],
      })),
    );
  };

  useEffect(() => {
    let cancelled = false;
    setLoadingRelease(true);
    fetchPublishedReleases()
      .then((rows) => {
        if (cancelled) return;
        setLatestRelease(pickLatestStable(rows) || null);
      })
      .catch(() => {
        if (cancelled) return;
        setLatestRelease(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingRelease(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          accessToken,
        );
        if (cancelled) return;
        setOrders(data.orders || []);
        setLicenses(
          (data.licenses || []).map((license) => ({
            ...license,
            seats_used: Number(license.seats_used) || 0,
            seats_max: Number(license.seats_max) || 2,
            activations: license.activations || [],
          })),
        );
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Could not load account data",
        );
      } finally {
        if (!cancelled) setLoadingAccount(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const releaseSeat = async (license: AccountLicense, hardwareId: string) => {
    const key = `${license.id}:${hardwareId}`;
    const label = shortHardwareId(hardwareId);
    if (
      !window.confirm(
        `Release seat ${label}? You can activate another Mac later from MATRIX.`,
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
        accessToken,
      );
      await reloadAccount();
    } catch (err) {
      setSeatError(
        err instanceof Error ? err.message : "Could not release seat",
      );
    } finally {
      setSeatBusy(null);
    }
  };

  const toggleOrder = (orderNumber: string) => {
    setOpenOrders((prev) => ({
      ...prev,
      [orderNumber]: !prev[orderNumber],
    }));
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={`page-shell ${styles.narrow}`}>
          <p className={styles.muted}>Loading account…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={`page-shell ${styles.narrow}`}>
          <p className="eyebrow">Account</p>
          <h1 className="display display-lg">Sign in to manage licenses.</h1>
          <p className="lede">
            Your Quadra ID holds MATRIX seats, orders, and invoices.
          </p>
          <a href="/login?returnTo=/account" className="btn btn-primary">
            Sign in with Google
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.narrow}`}>
        <p className="eyebrow">Account</p>
        <h1 className="display display-lg">
          Hello{user.name ? `, ${user.name.split(/\s+/)[0]}` : ""}.
        </h1>
        <p className="lede">{user.email}</p>

        <div className={styles.identityRow}>
          <button type="button" className={styles.textLink} onClick={() => logout()}>
            Sign out
          </button>
        </div>

        {needsReauth ? (
          <p className={styles.notice} role="status">
            Your Google session needs a refresh to load licenses.{" "}
            <a href="/login?returnTo=/account">Sign in again</a>
          </p>
        ) : null}

        {purchased ? (
          <div className={styles.notice} role="status">
            <p>
              Purchase complete
              {orderRef ? ` — order ${orderRef}` : ""}. Download the installer,
              then bind a seat from Authorization in MATRIX.
            </p>
            {latestRelease ? (
              <div className={styles.downloadActions}>
                <a
                  href={latestRelease.downloadUrl}
                  className="btn btn-primary"
                  download={latestRelease.downloadFilename}
                >
                  Download MATRIX
                </a>
                <Link href={QUADRA_CTAS.releases.href} className={styles.inlineLink}>
                  Release notes
                </Link>
              </div>
            ) : (
              <p>
                <Link href={QUADRA_CTAS.releases.href} className={styles.inlineLink}>
                  Open downloads
                </Link>
              </p>
            )}
          </div>
        ) : null}

        {loadError ? (
          <p className={styles.notice} role="status">
            {loadError}. Try refreshing or{" "}
            <a href="/login?returnTo=/account">sign in again</a>.
          </p>
        ) : null}

        {seatError ? (
          <p className={styles.notice} role="status">
            {seatError}
          </p>
        ) : null}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Download</h2>
          <p className={styles.sectionLede}>
            Install MATRIX on your Mac, then bind a seat from Authorization in
            the app.
          </p>
          {loadingRelease ? (
            <p className={styles.muted}>Loading installer…</p>
          ) : latestRelease ? (
            <div className={styles.downloadBlock}>
              <div>
                <p className={styles.blockTitle}>
                  {productName(latestRelease.productSlug)} {latestRelease.version}
                </p>
                <p className={styles.meta}>
                  {formatReleaseDate(latestRelease.publishedAt)} ·{" "}
                  {latestRelease.downloadKind}
                </p>
              </div>
              <div className={styles.downloadActions}>
                <a
                  href={latestRelease.downloadUrl}
                  className="btn btn-primary"
                  download={latestRelease.downloadFilename}
                >
                  Download
                </a>
                <Link
                  href={QUADRA_CTAS.releases.href}
                  className={styles.inlineLink}
                >
                  Release notes
                </Link>
              </div>
            </div>
          ) : (
            <p className={styles.muted}>
              Installer links will appear here when a build is published.{" "}
              <Link href={QUADRA_CTAS.releases.href} className={styles.inlineLink}>
                Check releases
              </Link>
            </p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Licenses</h2>
          <p className={styles.sectionLede}>
            Perpetual seats on your Quadra ID. Activate from MATRIX — up to two
            Macs at a time.
          </p>

          {loadingAccount ? (
            <p className={styles.muted}>Loading…</p>
          ) : loadError ? (
            <p className={styles.muted}>Could not load licenses right now.</p>
          ) : !licenses.length ? (
            <p className={styles.muted}>
              No licenses yet.{" "}
              <Link href="/store" className={styles.inlineLink}>
                Browse the store
              </Link>
            </p>
          ) : (
            <ul className={styles.stack}>
              {licenses.map((license) => (
                <li
                  key={license.id || `${license.product_slug}-${license.issued_at}`}
                  className={styles.block}
                >
                  <div className={styles.blockHead}>
                    <div>
                      <p className={styles.blockTitle}>
                        {productName(license.product_slug)}
                      </p>
                      <p className={styles.meta}>
                        {licenseTermLabel(license.expires_at)} · Issued{" "}
                        {formatAccountDate(license.issued_at)}
                        {license.order_number
                          ? ` · ${license.order_number}`
                          : ""}
                      </p>
                    </div>
                    <p className={styles.status}>
                      {license.status === "active" ? "Active" : license.status}
                    </p>
                  </div>

                  <p className={styles.factLine}>
                    Seats {license.seats_used} of {license.seats_max}
                    <span aria-hidden> · </span>
                    {license.product_slug}
                  </p>

                  <div className={styles.seatBlock}>
                    <p className={styles.subLabel}>Activated Macs</p>
                    {!license.activations?.length ? (
                      <p className={styles.muted}>
                        None yet. Open Authorization in MATRIX to bind a seat.
                      </p>
                    ) : (
                      <ul className={styles.seatList}>
                        {license.activations.map((seat) => {
                          const busyKey = `${license.id}:${seat.hardware_id}`;
                          return (
                            <li key={seat.hardware_id}>
                              <div>
                                <p className={styles.seatId}>
                                  {shortHardwareId(seat.hardware_id)}
                                </p>
                                <p className={styles.meta}>
                                  Bound{" "}
                                  {formatAccountDateTime(seat.activated_at)}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={seatBusy === busyKey}
                                onClick={() =>
                                  void releaseSeat(license, seat.hardware_id)
                                }
                              >
                                {seatBusy === busyKey
                                  ? "Releasing…"
                                  : "Release"}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <p className={styles.links}>
                    {latestRelease ? (
                      <a
                        href={latestRelease.downloadUrl}
                        download={latestRelease.downloadFilename}
                      >
                        Download app
                      </a>
                    ) : (
                      <Link href={QUADRA_CTAS.releases.href}>Downloads</Link>
                    )}
                    <Link href="/support/article/getting-started">
                      Activation help
                    </Link>
                    <Link href="/products/matrix">MATRIX overview</Link>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Orders</h2>
          <p className={styles.sectionLede}>
            Purchase history. Open a row for line items and invoice download.
          </p>

          {loadingAccount ? (
            <p className={styles.muted}>Loading…</p>
          ) : loadError ? (
            <p className={styles.muted}>Could not load orders right now.</p>
          ) : !orders.length ? (
            <p className={styles.muted}>No purchases yet.</p>
          ) : (
            <ul className={styles.stack}>
              {orders.map((order) => {
                const currency = order.currency || "USD";
                const paid = Number(order.total_amount) || 0;
                const gross = orderGross(order);
                const discount = orderDiscount(order);
                const items = order.items || [];
                const open = Boolean(openOrders[order.order_number]);
                const panelId = `order-panel-${order.order_number}`;

                return (
                  <li key={order.order_number} className={styles.block}>
                    <button
                      type="button"
                      className={styles.orderToggle}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => toggleOrder(order.order_number)}
                    >
                      <span className={styles.orderSummary}>
                        <span className={styles.blockTitle}>
                          {order.order_number}
                        </span>
                        <span className={styles.meta}>
                          {formatAccountDate(order.created_at)} · {order.status}
                        </span>
                      </span>
                      <span className={styles.orderAside}>
                        <span className={styles.orderTotal}>
                          {formatPrice(paid, currency)}
                        </span>
                        <span className={styles.chevron} aria-hidden>
                          {open ? "−" : "+"}
                        </span>
                      </span>
                    </button>

                    {open ? (
                      <div id={panelId} className={styles.orderPanel}>
                        {items.length ? (
                          <ul className={styles.lineList}>
                            {items.map((item, index) => {
                              const qty = Number(item.quantity) || 1;
                              const unit = Number(item.unitPrice) || 0;
                              return (
                                <li key={`${item.slug}-${index}`}>
                                  <span>
                                    {item.name || productName(item.slug)}
                                    {qty > 1 ? ` × ${qty}` : ""}
                                  </span>
                                  <span>
                                    {formatPrice(
                                      unit * qty,
                                      item.currency || currency,
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className={styles.muted}>
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
                                {order.coupon_code
                                  ? ` (${order.coupon_code})`
                                  : ""}
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

                        <p className={styles.meta}>
                          Tax was not itemized for this digital purchase
                          {order.paypal_order_id
                            ? ` · PayPal ${order.paypal_order_id}`
                            : ""}
                          .
                        </p>

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
                    ) : null}
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
          <div className={`page-shell ${styles.narrow}`}>
            <p className={styles.muted}>Loading account…</p>
          </div>
        </main>
      }
    >
      <AccountInner />
    </Suspense>
  );
}
