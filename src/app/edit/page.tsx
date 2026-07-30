"use client";

import { useEffect, useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { config } from "@/puck/config";
import { SEED_PAGES } from "@/puck/seed-pages";
import { getEditorPage, publishPage } from "@/lib/pages";
import { supabase } from "@/lib/supabase";
import styles from "./edit.module.scss";

type Slug = "home" | "hydra";

/** Comma-separated allowlist. Empty = any Google user signed in via Supabase. */
function isEditorAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.NEXT_PUBLIC_EDITOR_EMAILS?.trim();
  if (!raw) return true;
  const allowed = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

export default function EditPage() {
  const [slug, setSlug] = useState<Slug>("home");
  const [pageData, setPageData] = useState<Data>(SEED_PAGES.home.data);
  const [status, setStatus] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSessionEmail(data.session?.user.email ?? null);
      setAuthReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingPage(true);

    (async () => {
      const saved = await getEditorPage(slug);
      if (cancelled) return;
      setPageData(saved?.data || SEED_PAGES[slug].data);
      setLoadingPage(false);
      setStatus("");
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleGoogleSignIn = async () => {
    setAuthError("");
    setGoogleLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/edit/`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "online",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setGoogleLoading(false);
    }
    // On success the browser redirects to Google → back to /edit/
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handlePublish = async (data: Data) => {
    setStatus("Publishing…");
    const result = await publishPage(slug, SEED_PAGES[slug].title, data);
    if (result.ok) {
      setStatus("Published live. Visitors will see this version.");
      return;
    }
    if (result.localOnly) {
      setStatus(result.error || "Saved locally only.");
      return;
    }
    setStatus(result.error || "Publish failed.");
  };

  if (!authReady) {
    return <div className={styles.boot}>Loading editor…</div>;
  }

  if (!sessionEmail) {
    return (
      <div className={styles.authShell}>
        <div className={styles.authCard}>
          <h1>Quadra editor</h1>
          <p>
            Sign in with the same Google account already registered for Quadra.
            Supabase Auth → Google must be enabled with your Google Client ID and
            Client Secret.
          </p>
          {authError ? <p className={styles.error}>{authError}</p> : null}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? "Redirecting to Google…" : "Sign in with Google"}
          </button>
        </div>
      </div>
    );
  }

  if (!isEditorAllowed(sessionEmail)) {
    return (
      <div className={styles.authShell}>
        <div className={styles.authCard}>
          <h1>Access denied</h1>
          <p>
            Signed in as <strong>{sessionEmail}</strong>, but this account is not
            on the editor allowlist (<code>NEXT_PUBLIC_EDITOR_EMAILS</code>).
          </p>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <div className={styles.barLeft}>
          <strong>Quadra canvas</strong>
          <span className={styles.muted}>|</span>
          <label>
            Page{" "}
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value as Slug)}
            >
              <option value="home">Home (/)</option>
              <option value="hydra">Hydra (/hydra)</option>
            </select>
          </label>
        </div>
        <div className={styles.barRight}>
          {status ? <span className={styles.status}>{status}</span> : null}
          <span className={styles.muted}>{sessionEmail}</span>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      {loadingPage ? (
        <div className={styles.boot}>Loading page…</div>
      ) : (
        <div className={styles.canvas}>
          <Puck
            key={slug}
            config={config}
            data={pageData}
            onPublish={handlePublish}
          />
        </div>
      )}
    </div>
  );
}
