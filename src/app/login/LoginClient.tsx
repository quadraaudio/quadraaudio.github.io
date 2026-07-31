"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "./login.module.scss";

export default function LoginClient({ configured }: { configured: boolean }) {
  const searchParams = useSearchParams();
  const returnTo = useMemo(() => {
    const raw = searchParams.get("returnTo") || "/account";
    return raw.startsWith("/") ? raw : "/account";
  }, [searchParams]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGoogle(event: FormEvent) {
    event.preventDefault();
    if (!configured) return;
    setBusy(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: returnTo });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.shell}`}>
        <p className="eyebrow">Quadra ID</p>
        <h1 className="display display-lg">Sign in with Google.</h1>
        <p className="lede">
          Use your Google account to checkout and access licenses in your
          account.
        </p>

        {!configured ? (
          <p className={styles.notice}>
            Google sign-in is not connected yet. Add{" "}
            <code>AUTH_GOOGLE_ID</code>, <code>AUTH_GOOGLE_SECRET</code>, and{" "}
            <code>AUTH_SECRET</code> (see <code>.env.example</code>).
          </p>
        ) : null}

        <form className={styles.form} onSubmit={onGoogle}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!configured || busy}
          >
            {busy ? "Redirecting to Google…" : "Continue with Google"}
          </button>
        </form>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <Link
          href={returnTo === "/store/checkout" ? "/store/bag" : "/store"}
          className={styles.back}
        >
          Back to store
        </Link>
      </div>
    </main>
  );
}
