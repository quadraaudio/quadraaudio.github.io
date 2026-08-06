"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TermsAcceptModal } from "@/components/legal/TermsAcceptModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { beginGoogleRedirectLogin } from "@/lib/googleOAuthRedirect";
import { hasAcceptedCurrentTerms } from "@/lib/termsAcceptance";
import styles from "./login.module.scss";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const returnTo = useMemo(() => {
    const raw = searchParams.get("returnTo") || "/account";
    return raw.startsWith("/") ? raw : "/account";
  }, [searchParams]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsOk, setTermsOk] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    setTermsOk(hasAcceptedCurrentTerms());
  }, []);

  // Already signed in — continue to the destination (e.g. MATRIX activate).
  useEffect(() => {
    if (isLoading || !user) return;
    router.replace(returnTo);
  }, [isLoading, user, returnTo, router]);

  async function continueWithGoogle() {
    if (!hasAcceptedCurrentTerms()) {
      setShowTerms(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Full-page redirect (PKCE) — not a popup. Required for MATRIX app browsers.
      await beginGoogleRedirectLogin(returnTo);
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
          Use the same Google login already set up for quadraaudio.com. You must
          review and accept the Terms of Use before continuing.
        </p>
        {returnTo.includes("/activate") ? (
          <p className={styles.termsOk} role="status">
            Opened from MATRIX — Google will open in this window (no popup).
          </p>
        ) : null}

        {!termsOk ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowTerms(true)}
          >
            Review &amp; accept Terms
          </button>
        ) : (
          <p className={styles.termsOk} role="status">
            Terms accepted for this browser.
          </p>
        )}

        <button
          type="button"
          className={`btn btn-primary ${styles.googleBtn}`}
          onClick={() => void continueWithGoogle()}
          disabled={busy || isLoading}
        >
          {busy ? "Opening Google…" : "Continue with Google"}
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

      <TermsAcceptModal
        open={showTerms}
        onAccepted={() => {
          setTermsOk(true);
          setShowTerms(false);
        }}
        onDismiss={() => setShowTerms(false)}
      />
    </main>
  );
}
