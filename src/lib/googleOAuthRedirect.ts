import { GOOGLE_CLIENT_ID } from "@/lib/googleAuth.client";

const PKCE_STORAGE = "quadra_oauth_pkce_v1";
const SCOPE = "email profile openid";

type PkcePending = {
  verifier: string;
  returnTo: string;
  nonce: string;
};

function base64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomVerifier() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function challengeFromVerifier(verifier: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(digest);
}

function callbackUrl() {
  const origin = window.location.origin;
  return `${origin}/login/callback/`;
}

function savePending(pending: PkcePending) {
  sessionStorage.setItem(PKCE_STORAGE, JSON.stringify(pending));
}

function loadPending(): PkcePending | null {
  try {
    const raw = sessionStorage.getItem(PKCE_STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PkcePending;
    if (!parsed?.verifier || !parsed?.returnTo) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearPending() {
  sessionStorage.removeItem(PKCE_STORAGE);
}

/**
 * Full-page Google OAuth (PKCE) — works in MATRIX app browsers / WKWebView
 * where GIS popups are blocked.
 */
export async function beginGoogleRedirectLogin(returnTo: string) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not configured");
  }
  const safeReturn = returnTo.startsWith("/") ? returnTo : "/account";
  const verifier = randomVerifier();
  const challenge = await challengeFromVerifier(verifier);
  const nonce = randomVerifier();
  savePending({ verifier, returnTo: safeReturn, nonce });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl(),
    response_type: "code",
    scope: SCOPE,
    state: nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "select_account consent",
    include_granted_scopes: "true",
  });

  window.location.assign(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}

export type GoogleTokenBundle = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
};

async function exchangeCode(code: string, verifier: string) {
  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    code,
    code_verifier: verifier,
    grant_type: "authorization_code",
    redirect_uri: callbackUrl(),
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      text.includes("redirect_uri")
        ? "Google redirect URI is not authorized for this site."
        : "Could not complete Google sign-in.",
    );
  }
  return (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
}

async function fetchProfile(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
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
  return profile;
}

/**
 * Finish PKCE redirect on `/login/callback/`.
 * Returns profile + tokens and the original returnTo path.
 */
export async function completeGoogleRedirectLogin(search: URLSearchParams): Promise<{
  bundle: GoogleTokenBundle;
  returnTo: string;
}> {
  const err = search.get("error");
  if (err) {
    clearPending();
    throw new Error(
      err === "access_denied"
        ? "Google sign-in was cancelled."
        : `Google sign-in failed (${err}).`,
    );
  }

  const code = search.get("code");
  const state = search.get("state");
  const pending = loadPending();
  if (!code || !pending) {
    clearPending();
    throw new Error("Sign-in session expired. Try again.");
  }
  if (state && pending.nonce && state !== pending.nonce) {
    clearPending();
    throw new Error("Sign-in state mismatch. Try again.");
  }

  const token = await exchangeCode(code, pending.verifier);
  clearPending();
  if (!token.access_token) throw new Error("No access token from Google.");

  const profile = await fetchProfile(token.access_token);
  const ttlSec = Number(token.expires_in) || 3600;
  return {
    returnTo: pending.returnTo,
    bundle: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Math.max(60, ttlSec - 60) * 1000,
      id: profile.sub!,
      email: profile.email!,
      name: profile.name || null,
      picture: profile.picture || null,
    },
  };
}

/** Quiet token refresh — no UI, keeps the Quadra session alive. */
export async function refreshGoogleAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; expiresAt: number; refreshToken?: string }> {
  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error("Google session expired. Sign in again.");
  }
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
  };
  if (!data.access_token) {
    throw new Error("Google session expired. Sign in again.");
  }
  const ttlSec = Number(data.expires_in) || 3600;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + Math.max(60, ttlSec - 60) * 1000,
  };
}
