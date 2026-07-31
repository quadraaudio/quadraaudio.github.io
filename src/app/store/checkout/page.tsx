import Link from "next/link";
import { CheckoutClient } from "./CheckoutClient";
import { getSessionUser, googleAuthConfigured } from "@/lib/googleAuth";
import styles from "./checkout.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const user = googleAuthConfigured() ? await getSessionUser() : null;

  if (!user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Checkout</p>
          <h1 className="display display-lg">Sign in to continue.</h1>
          <p className="lede">
            Sign in with Google to complete purchase and receive licenses in
            your account.
          </p>
          {!googleAuthConfigured() ? (
            <p className={styles.notice}>
              Google sign-in needs <code>AUTH_SECRET</code> on the server.
            </p>
          ) : null}
          <div className={styles.actions}>
            <a
              href="/login?returnTo=/store/checkout"
              className="btn btn-primary"
            >
              Sign in with Google
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
          Signed in as {user.email || user.name}
        </p>
        <CheckoutClient
          paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
        />
      </div>
    </main>
  );
}
