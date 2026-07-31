"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import ThemeSetter from "@/components/ThemeSetter";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.scss";

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

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim(), { authProvider: "quadra" });
    router.push("/account");
  }

  function handleGoogleSignIn() {
    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.oauth2) return;
    setGoogleLoading(true);
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "email profile openid",
      callback: async (response) => {
        if (response.access_token) {
          try {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${response.access_token}` },
            });
            const googleUser = await res.json();
            login(googleUser.email, { name: googleUser.name, authProvider: "google" });
            router.push("/account");
          } finally {
            setGoogleLoading(false);
          }
        } else {
          setGoogleLoading(false);
        }
      },
    });
    client.requestAccessToken();
  }

  return (
    <div className={styles.page}>
      <ThemeSetter theme="light" />
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

      <div className={styles.card}>
        <img src="/images/hydra_app_icon.jpg" alt="" className={styles.icon} />
        <h1 className={styles.title}>Sign in with your Quadra ID.</h1>
        <p className={styles.subtitle}>One ID for your license, your store, and your support cases.</p>

        <form className={styles.form} onSubmit={handleEmailSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Continue
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <button className={styles.googleBtn} onClick={handleGoogleSignIn} disabled={googleLoading}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.5c-2 1.4-4.7 2.3-7.6 2.3-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.6 5.5C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
          </svg>
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
