"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TermsAcceptModal } from "@/components/legal/TermsAcceptModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { beginGoogleRedirectLogin } from "@/lib/googleOAuthRedirect";
import { requestGoogleAccessToken } from "@/lib/googleToken";
import { hasAcceptedCurrentTerms } from "@/lib/termsAcceptance";
import styles from "./login.module.scss";

function prefersRedirectLogin(returnTo: string) {
  // MATRIX app WebViews often block GIS popups — use full-page PKCE there.
  if (returnTo.includes("/activate")) return true;
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /QuadraMatrix|WV\)|WebView/i.test(ua);
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, login } = useAuth();
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
      // Prefer GIS token popup on the website (works with existing Console
      // JavaScript origins). PKCE redirect is for MATRIX / WebView only —
      // that path needs Authorized redirect URIs in Google Cloud Console.
      if (prefersRedirectLogin(returnTo)) {
        await beginGoogleRedirectLogin(returnTo);
        return;
      }

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
      const message = err instanceof Error ? err.message : "Sign-in failed";
      // If the GIS popup is blocked, fall back to full-page redirect.
      if (/popup|blocked|timed out|Failed to load Google/i.test(message)) {
        try {
          await beginGoogleRedirectLogin(returnTo);
          return;
        } catch (redirectErr) {
          setError(
            redirectErr instanceof Error ? redirectErr.message : message,
          );
          setBusy(false);
          return;
        }
      }
      setError(message);
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
