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
/** Silent refresh should fail fast so we can open the Google UI. */
const SILENT_TIMEOUT_MS = 2_500;
/** Interactive consent / account picker. */
const INTERACTIVE_TIMEOUT_MS = 120_000;

let gsiLoading: Promise<void> | null = null;

function loadGsi(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser"));
  }
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gsiLoading) return gsiLoading;

  gsiLoading = new Promise<void>((resolve, reject) => {
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
      if (window.google?.accounts?.oauth2) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in"));
    document.head.appendChild(script);
  });

  void gsiLoading.finally(() => {
    gsiLoading = null;
  });

  return gsiLoading;
}

export type GoogleAccessTokenResult = {
  accessToken: string;
  expiresAt: number;
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`${label} timed out. Try again.`));
    }, ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/**
 * Request a fresh Google OAuth access token via GIS.
 *
 * - `interactive: true` (login button) opens the account picker immediately.
 * - `interactive: false` tries silent only.
 * - default (token refresh) tries silent briefly, then falls back to UI.
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

  const attempt = (prompt: string | undefined, timeoutMs: number) =>
    withTimeout(
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
      }),
      timeoutMs,
      "Google sign-in"
    );

  // Explicit sign-in: never wait on a silent attempt that will hang for new users.
  if (options.interactive === true) {
    return attempt("select_account", INTERACTIVE_TIMEOUT_MS);
  }

  try {
    return await attempt("", SILENT_TIMEOUT_MS);
  } catch (silentErr) {
    if (options.interactive === false) throw silentErr;
    return attempt("select_account", INTERACTIVE_TIMEOUT_MS);
  }
}
