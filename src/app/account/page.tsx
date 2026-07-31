import Link from "next/link";
import { auth0, auth0Configured } from "@/lib/auth0";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { formatPrice } from "@/lib/products";
import styles from "./account.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  if (!auth0Configured || !auth0) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <h1 className="display display-lg">Account</h1>
          <p className="lede">
            Auth0 is not configured. Add Auth0 environment variables to enable
            Quadra ID sign-in.
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

  const admin = getSupabaseAdmin();
  let orders: Array<{
    order_number: string;
    total_amount: number;
    currency: string;
    status: string;
    created_at: string;
  }> = [];
  let licenses: Array<{
    product_slug: string;
    status: string;
    issued_at: string;
  }> = [];

  if (admin) {
    const [{ data: orderData }, { data: licenseData }] = await Promise.all([
      admin
        .from("orders")
        .select("order_number,total_amount,currency,status,created_at")
        .eq("auth0_sub", session.user.sub)
        .order("created_at", { ascending: false }),
      admin
        .from("licenses")
        .select("product_slug,status,issued_at")
        .eq("auth0_sub", session.user.sub)
        .order("issued_at", { ascending: false }),
    ]);
    orders = orderData || [];
    licenses = licenseData || [];
  }

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Account</p>
        <h1 className="display display-lg">
          Hello{session.user.name ? `, ${session.user.name}` : ""}.
        </h1>
        <p className={styles.email}>{session.user.email}</p>

        <section className={styles.section}>
          <h2>Licenses</h2>
          {!licenses.length ? (
            <p className={styles.empty}>
              No licenses yet.{" "}
              <Link href="/store">Browse the store</Link>
            </p>
          ) : (
            <ul className={styles.list}>
              {licenses.map((license) => (
                <li key={`${license.product_slug}-${license.issued_at}`}>
                  <strong>{license.product_slug}</strong>
                  <span>{license.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2>Orders</h2>
          {!orders.length ? (
            <p className={styles.empty}>No orders yet.</p>
          ) : (
            <ul className={styles.list}>
              {orders.map((order) => (
                <li key={order.order_number}>
                  <strong>{order.order_number}</strong>
                  <span>
                    {formatPrice(Number(order.total_amount), order.currency)} ·{" "}
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <a href="/auth/logout" className="btn btn-secondary">
          Log out
        </a>
      </div>
    </main>
  );
}
