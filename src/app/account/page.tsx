import Link from "next/link";
import { auth0, auth0Configured } from "@/lib/auth0";
import { getSeedProduct } from "@/data/products.seed";
import { loadAccountForAuth0 } from "@/lib/checkout";
import { formatPrice } from "@/lib/products";
import styles from "./account.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account",
};

function productName(slug: string) {
  return getSeedProduct(slug)?.name || slug;
}

export default async function AccountPage() {
  if (!auth0Configured || !auth0) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <h1 className="display display-lg">Account</h1>
          <p className="lede">
            Auth0 is not configured. Add Auth0 environment variables to enable
            Google sign-in for Quadra ID.
          </p>
        </div>
      </main>
    );
  }

  const session = await auth0.getSession();
  if (!session?.user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Account</p>
          <h1 className="display display-lg">Sign in to manage licenses.</h1>
          <a href="/auth/login?returnTo=/account" className="btn btn-primary">
            Sign in with Google
          </a>
        </div>
      </main>
    );
  }

  const account = await loadAccountForAuth0(session.user.sub);
  const loadError = !account.ok;
  const orders = account.ok ? account.orders : [];
  const licenses = account.ok ? account.licenses : [];

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Account</p>
        <h1 className="display display-lg">
          Hello{session.user.name ? `, ${session.user.name}` : ""}.
        </h1>
        <p className={styles.email}>{session.user.email}</p>

        {loadError ? (
          <div className={styles.banner} role="status">
            Order history is temporarily unavailable. Try again shortly or
            contact support if a payment just completed.
          </div>
        ) : null}

        <section className={styles.section}>
          <h2>Licenses</h2>
          {loadError ? (
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
          {loadError ? (
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

        <a href="/auth/logout?returnTo=/" className="btn btn-secondary">
          Log out
        </a>
      </div>
    </main>
  );
}
