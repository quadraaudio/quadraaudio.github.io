/**
 * Auth0 SPA config for the visual editor (/editor).
 * Google is the only allowed connection (forced in login options).
 */

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "";
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "";
export const AUTH0_GOOGLE_CONNECTION = "google-oauth2";

export function isAuth0Configured(): boolean {
  return Boolean(AUTH0_DOMAIN && AUTH0_CLIENT_ID);
}

/** Callback URL for Auth0 Application settings (trailing slash required). */
export function getEditorCallbackUrl(origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/editor/callback/`;
}

export function getEditorHomeUrl(origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/editor/`;
}
