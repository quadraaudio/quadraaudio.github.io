import Link from "next/link";
import { getSessionUser, supabaseConfigured } from "@/lib/supabase/server";
import { CheckoutClient } from "./CheckoutClient";
import styles from "./checkout.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const user = supabaseConfigured() ? await getSessionUser() : null;

  if (!user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Checkout</p>
          <h1 className="display display-lg">Sign in to continue.</h1>
          <p className="lede">
            Sign in with your Quadra account to complete purchase and receive
            licenses in your account.
          </p>
          {!supabaseConfigured() ? (
            <p className={styles.notice}>
              Supabase is not configured yet. Add{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            </p>
          ) : null}
          <div className={styles.actions}>
            <a
              href="/login?returnTo=/store/checkout"
              className="btn btn-primary"
            >
              Sign in
            </a>
            <Link href="/store/bag" className="btn btn-secondary">
              Back to bag
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">Checkout</p>
        <h1 className="display display-lg">Complete your order.</h1>
        <p className={styles.signedIn}>
          Signed in as {user.email}
        </p>
        <CheckoutClient
          paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
        />
      </div>
    </main>
  );
}
