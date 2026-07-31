import Link from "next/link";
import { auth0, auth0Configured } from "@/lib/auth0";
import { CheckoutClient } from "./CheckoutClient";
import styles from "./checkout.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = auth0Configured && auth0 ? await auth0.getSession() : null;

  if (!session?.user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Checkout</p>
          <h1 className="display display-lg">Sign in to continue.</h1>
          <p className="lede">
            Sign in with your Quadra account to complete purchase and receive
            licenses in your account.
          </p>
          {!auth0Configured ? (
            <p className={styles.notice}>
              Auth0 is not configured yet. Add `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`,
              `AUTH0_CLIENT_SECRET`, and `AUTH0_SECRET` to enable sign-in.
            </p>
          ) : null}
          <div className={styles.actions}>
            <a
              href="/auth/login?returnTo=/store/checkout"
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
          Signed in as {session.user.email || session.user.name}
        </p>
        <CheckoutClient
          paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
        />
      </div>
    </main>
  );
}
