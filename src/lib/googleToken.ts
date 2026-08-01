import { GOOGLE_CLIENT_ID } from "@/lib/googleAuth.client";

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              expires_in?: number;
              error?: string;
            }) => void;
            error_callback?: (error: { type?: string; message?: string }) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const GSI_SRC = "https://accounts.google.com/gsi/client";
const SCOPE = "email profile openid";

let gsiLoading: Promise<void> | null = null;

function loadGsi(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser"));
  }
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gsiLoading) return gsiLoading;

  gsiLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google sign-in")),
        { once: true }
      );
      // Already loaded before listeners attached
      if (window.google?.accounts?.oauth2) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in"));
    document.head.appendChild(script);
  }).finally(() => {
    gsiLoading = null;
  });

  return gsiLoading;
}

export type GoogleAccessTokenResult = {
  accessToken: string;
  expiresAt: number;
};

/**
 * Request a fresh Google OAuth access token via GIS.
 * Tries silent refresh first; falls back to interactive consent if needed.
 */
export async function requestGoogleAccessToken(
  options: { interactive?: boolean } = {}
): Promise<GoogleAccessTokenResult> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not configured");
  }

  await loadGsi();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    throw new Error("Google sign-in is still loading. Try again.");
  }

  const attempt = (prompt?: string) =>
    new Promise<GoogleAccessTokenResult>((resolve, reject) => {
      const client = oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPE,
        callback: (response) => {
          if (response.error || !response.access_token) {
            reject(
              new Error(
                response.error === "access_denied"
                  ? "Google sign-in was cancelled."
                  : "Could not refresh Google session."
              )
            );
            return;
          }
          const ttlSec = Number(response.expires_in) || 3600;
          resolve({
            accessToken: response.access_token,
            // Refresh a minute early so checkout never races expiry.
            expiresAt: Date.now() + Math.max(60, ttlSec - 60) * 1000,
          });
        },
        error_callback: (error) => {
          reject(
            new Error(error.message || error.type || "Google sign-in failed")
          );
        },
      });
      client.requestAccessToken(
        prompt === undefined ? undefined : { prompt }
      );
    });

  try {
    // Prefer silent refresh when the Google session is still warm.
    return await attempt("");
  } catch (silentErr) {
    if (options.interactive === false) throw silentErr;
    return attempt();
  }
}
