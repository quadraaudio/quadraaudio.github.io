"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { callEdgeFunction } from "@/lib/edgeApi";
import styles from "./activate.module.scss";

function ActivateInner() {
  const { user, isLoading } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const hwid = params.get("hwid")?.trim() || "";
  const product = params.get("product")?.trim() || "quadra-matrix";
  const mode = params.get("mode")?.trim() === "trial" ? "trial" : "paid";
  const returnUrl =
    params.get("return")?.trim() || "com.quadraaudio.matrix://activate";

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const issueAndReturn = useCallback(async () => {
    if (!user?.accessToken || !hwid) return;
    setBusy(true);
    setError("");
    try {
      const data = await callEdgeFunction<{ code: string }>(
        "license-activate",
        {
          action: mode === "trial" ? "issue-trial" : "issue",
          googleAccessToken: user.accessToken,
          hardwareId: hwid,
          productSlug: product,
        },
        user.accessToken
      );
      if (!data.code) throw new Error("No activation code returned.");
      const target = `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}code=${encodeURIComponent(data.code)}`;
      setDone(true);
      window.location.href = target;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activation failed.");
      setBusy(false);
    }
  }, [user, hwid, product, returnUrl, mode]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      const next = `/activate?${params.toString()}`;
      router.replace(`/login?returnTo=${encodeURIComponent(next)}`);
    }
  }, [isLoading, user, router, params]);

  if (isLoading || !user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p>Loading…</p>
        </div>
      </main>
    );
  }

  if (!hwid) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Activate</p>
          <h1 className="display display-lg">Open this page from MATRIX.</h1>
          <p className={styles.lead}>
            The app sends your Mac hardware ID so we can bind a seat or trial securely.
            Start from <strong>Authorization</strong> in the app.
          </p>
          <Link href="/account" className={styles.link}>
            Manage account
          </Link>
        </div>
      </main>
    );
  }

  const title = mode === "trial" ? "Start your 14-day trial" : "Activate this Mac";
  const lead =
    mode === "trial"
      ? "One full trial per account and per Mac. Sign-in proves identity; we bind this hardware so a second trial on the same machine or email is blocked."
      : "We will bind one seat to this machine and return a signed license to the app — no file download.";
  const cta =
    mode === "trial"
      ? busy
        ? "Starting trial…"
        : "Start trial & return to app"
      : busy
        ? "Activating…"
        : "Activate & return to app";

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <p className="eyebrow">MATRIX</p>
        <h1 className="display display-lg">{title}</h1>
        <p className={styles.lead}>
          Signed in as <strong>{user.email}</strong>. {lead}
        </p>
        <p className={styles.hwid}>
          Hardware ID <code>{hwid.slice(0, 8)}…{hwid.slice(-4)}</code>
        </p>

        {error ? <p className={styles.error}>{error}</p> : null}
        {done ? (
          <p className={styles.ok}>Returning to MATRIX…</p>
        ) : (
          <button
            type="button"
            className={styles.cta}
            disabled={busy}
            onClick={() => void issueAndReturn()}
          >
            {cta}
          </button>
        )}

        <p className={styles.note}>
          {mode === "trial" ? (
            <>
              Already purchased?{" "}
              <Link href={`/activate?hwid=${encodeURIComponent(hwid)}&product=${encodeURIComponent(product)}&return=${encodeURIComponent(returnUrl)}`}>
                Activate full license
              </Link>
              .
            </>
          ) : (
            <>
              Need another seat? Deactivate a Mac from{" "}
              <Link href="/account">Account</Link> first (2 Macs per license).
            </>
          )}
        </p>
      </div>
    </main>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <main className={styles.page}>
          <div className="page-shell">
            <p>Loading…</p>
          </div>
        </main>
      }
    >
      <ActivateInner />
    </Suspense>
  );
}
