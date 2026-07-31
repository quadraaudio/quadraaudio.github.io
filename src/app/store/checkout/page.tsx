import Link from "next/link";
import { auth, googleAuthConfigured } from "@/auth";
import { CheckoutClient } from "./CheckoutClient";
import styles from "./checkout.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = googleAuthConfigured ? await auth() : null;

  if (!session?.user?.id) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Checkout</p>
          <h1 className="display display-lg">Sign in to continue.</h1>
          <p className="lede">
            Sign in with Google to complete purchase and receive licenses in
            your account.
          </p>
          {!googleAuthConfigured ? (
            <p className={styles.notice}>
              Google sign-in is not connected yet. Add `AUTH_GOOGLE_ID`,
              `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET` to enable it.
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
          Signed in as {session.user.email || session.user.name}
        </p>
        <CheckoutClient
          paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
        />
      </div>
    </main>
  );
}
