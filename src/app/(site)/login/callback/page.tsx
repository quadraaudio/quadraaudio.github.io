"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { completeGoogleRedirectLogin } from "@/lib/googleOAuthRedirect";
import styles from "../login.module.scss";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { bundle, returnTo } = await completeGoogleRedirectLogin(
          new URLSearchParams(searchParams.toString()),
        );
        if (cancelled) return;
        login({
          id: bundle.id,
          email: bundle.email,
          name: bundle.name,
          picture: bundle.picture,
          accessToken: bundle.accessToken,
          refreshToken: bundle.refreshToken,
          expiresAt: bundle.expiresAt,
        });
        router.replace(returnTo.startsWith("/") ? returnTo : "/account");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Sign-in failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [login, router, searchParams]);

  return (
    <main className={styles.page}>
      <div className={`page-shell ${styles.shell}`}>
        <p className="eyebrow">Quadra ID</p>
        <h1 className="display display-lg">
          {error ? "Sign-in interrupted." : "Finishing sign-in…"}
        </h1>
        {error ? (
          <>
            <p className={styles.error} role="alert">
              {error}
            </p>
            <a href="/login" className="btn btn-primary">
              Try again
            </a>
          </>
        ) : (
          <p className="lede">Returning you to Quadra…</p>
        )}
      </div>
    </main>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className={`page-shell ${styles.shell}`}>
            <p>Loading…</p>
          </div>
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
