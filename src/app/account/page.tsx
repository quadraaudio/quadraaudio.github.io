import Link from "next/link";
import { getSessionUser, supabaseConfigured, createClient } from "@/lib/supabase/server";
import { getSeedProduct } from "@/data/products.seed";
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
  if (!supabaseConfigured()) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <h1 className="display display-lg">Account</h1>
          <p className="lede">
            Store account requires Supabase. Set{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </main>
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Account</p>
          <h1 className="display display-lg">Sign in to manage licenses.</h1>
          <a href="/login?returnTo=/account" className="btn btn-primary">
            Sign in
          </a>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
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
  let loadError = false;

  try {
    const [{ data: orderData, error: orderErr }, { data: licenseData, error: licenseErr }] =
      await Promise.all([
        supabase
          .from("orders")
          .select("order_number,total_amount,currency,status,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("licenses")
          .select("product_slug,status,issued_at")
          .eq("user_id", user.id)
          .order("issued_at", { ascending: false }),
      ]);
    if (orderErr || licenseErr) {
      loadError = true;
    } else {
      orders = orderData || [];
      licenses = licenseData || [];
    }
  } catch {
    loadError = true;
  }

  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || null;

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Account</p>
        <h1 className="display display-lg">
          Hello{displayName ? `, ${displayName}` : ""}.
        </h1>
        <p className={styles.email}>{user.email}</p>

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

        <form action="/auth/signout" method="post">
          <button type="submit" className="btn btn-secondary">
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
