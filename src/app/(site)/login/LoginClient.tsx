"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { requestGoogleAccessToken } from "@/lib/googleToken";
import styles from "./login.module.scss";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const returnTo = useMemo(() => {
    const raw = searchParams.get("returnTo") || "/account";
    return raw.startsWith("/") ? raw : "/account";
  }, [searchParams]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function continueWithGoogle() {
    setBusy(true);
    setError(null);
    try {
      const token = await requestGoogleAccessToken({ interactive: true });
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      });
      if (!res.ok) throw new Error("Could not read Google profile");
      const profile = (await res.json()) as {
        sub?: string;
        email?: string;
        name?: string;
        picture?: string;
      };
      if (!profile.sub || !profile.email) {
        throw new Error("Google profile incomplete");
      }
      login({
        id: profile.sub,
        email: profile.email,
        name: profile.name || null,
        picture: profile.picture || null,
        accessToken: token.accessToken,
        expiresAt: token.expiresAt,
      });
      router.replace(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.shell}`}>
        <p className="eyebrow">Quadra ID</p>
        <h1 className="display display-lg">Sign in with Google.</h1>
        <p className="lede">
          Use the same Google login already set up for quadraaudio.com.
        </p>

        <button
          type="button"
          className={`btn btn-primary ${styles.googleBtn}`}
          onClick={() => void continueWithGoogle()}
          disabled={busy}
        >
          {busy ? "Connecting to Google…" : "Continue with Google"}
        </button>

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
