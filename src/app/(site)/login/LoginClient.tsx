"use client";

import Link from "next/link";
import Script from "next/script";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { GOOGLE_CLIENT_ID } from "@/lib/googleAuth.client";
import styles from "./login.module.scss";

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

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

  function continueWithGoogle() {
    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.oauth2) {
      setError("Google is still loading. Try again in a moment.");
      return;
    }

    setBusy(true);
    setError(null);

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "email profile openid",
      callback: async (response) => {
        if (!response.access_token) {
          setBusy(false);
          setError("Google sign-in was cancelled.");
          return;
        }
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${response.access_token}` },
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
            accessToken: response.access_token,
          });
          router.replace(returnTo);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Sign-in failed");
          setBusy(false);
        }
      },
    });

    client.requestAccessToken();
  }

  return (
    <main className={styles.page}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div className={`page-shell ${styles.shell}`}>
        <p className="eyebrow">Quadra ID</p>
        <h1 className="display display-lg">Sign in with Google.</h1>
        <p className="lede">
          Use the same Google login already set up for quadraaudio.com.
        </p>

        <button
          type="button"
          className={`btn btn-primary ${styles.googleBtn}`}
          onClick={continueWithGoogle}
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
