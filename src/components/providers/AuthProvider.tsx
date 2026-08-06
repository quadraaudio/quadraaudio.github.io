"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { requestGoogleAccessToken } from "@/lib/googleToken";
import { refreshGoogleAccessToken } from "@/lib/googleOAuthRedirect";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
  accessToken?: string;
  /** Long-lived Google refresh token (PKCE redirect login). */
  refreshToken?: string;
  /** Epoch ms when accessToken should be treated as expired. */
  expiresAt?: number;
};

type EnsureOptions = {
  /** Only open Google UI from a direct user gesture. Default false. */
  interactive?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  configured: boolean;
  /** True when profile is present but access token needs refresh / re-auth. */
  needsReauth: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  ensureAccessToken: (options?: EnsureOptions) => Promise<string>;
};

const STORAGE_KEY = "quadra_google_session_v1";
const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistUser(next: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (!next) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function tokenStillValid(user: AuthUser | null) {
  if (!user?.accessToken) return false;
  if (!user.expiresAt) return true;
  return user.expiresAt > Date.now() + 30_000;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRef = useRef<AuthUser | null>(null);
  const refreshInFlight = useRef<Promise<string> | null>(null);

  const applyUser = useCallback((next: AuthUser | null) => {
    userRef.current = next;
    setUser(next);
    persistUser(next);
  }, []);

  useEffect(() => {
    const loaded = loadUser();
    userRef.current = loaded;
    setUser(loaded);
    setIsLoading(false);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = loadUser();
      userRef.current = next;
      setUser(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(
    (next: AuthUser) => {
      const prev = loadUser();
      // Keep prior refresh token if Google omitted a new one on re-consent.
      const merged: AuthUser = {
        ...next,
        refreshToken: next.refreshToken || prev?.refreshToken,
      };
      applyUser(merged);
    },
    [applyUser],
  );

  const logout = useCallback(() => {
    applyUser(null);
  }, [applyUser]);

  const refresh = useCallback(async () => {
    const loaded = loadUser();
    userRef.current = loaded;
    setUser(loaded);
  }, []);

  const ensureAccessToken = useCallback(
    async (options: EnsureOptions = {}) => {
      const interactive = options.interactive === true;
      const current = loadUser() || userRef.current;
      if (tokenStillValid(current) && current?.accessToken) {
        if (current !== userRef.current) {
          userRef.current = current;
          setUser(current);
        }
        return current.accessToken;
      }

      if (refreshInFlight.current) return refreshInFlight.current;

      refreshInFlight.current = (async () => {
        const base = loadUser() || userRef.current;

        // Prefer stored refresh token — no popup, survives app browsers.
        if (base?.refreshToken) {
          try {
            const refreshed = await refreshGoogleAccessToken(base.refreshToken);
            const next: AuthUser = {
              ...base,
              accessToken: refreshed.accessToken,
              expiresAt: refreshed.expiresAt,
              refreshToken: refreshed.refreshToken || base.refreshToken,
            };
            applyUser(next);
            return next.accessToken!;
          } catch {
            // Fall through to GIS / interactive
          }
        }

        try {
          const token = await requestGoogleAccessToken({
            interactive: interactive ? true : false,
          });
          if (!base?.id || !base?.email) {
            const res = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              { headers: { Authorization: `Bearer ${token.accessToken}` } },
            );
            if (!res.ok) throw new Error("Google session expired. Sign in again.");
            const profile = (await res.json()) as {
              sub?: string;
              email?: string;
              name?: string;
              picture?: string;
            };
            if (!profile.sub || !profile.email) {
              throw new Error("Google profile incomplete");
            }
            const next: AuthUser = {
              id: profile.sub,
              email: profile.email,
              name: profile.name || null,
              picture: profile.picture || null,
              accessToken: token.accessToken,
              expiresAt: token.expiresAt,
              refreshToken: base?.refreshToken,
            };
            applyUser(next);
            return next.accessToken!;
          }

          const next: AuthUser = {
            ...base,
            accessToken: token.accessToken,
            expiresAt: token.expiresAt,
          };
          applyUser(next);
          return token.accessToken;
        } catch (err) {
          // Keep identity signed-in; clear only the dead access token.
          if (base?.id && base?.email) {
            applyUser({
              ...base,
              accessToken: undefined,
              expiresAt: undefined,
            });
          }
          throw err instanceof Error
            ? err
            : new Error("Google session expired. Sign in again.");
        }
      })().finally(() => {
        refreshInFlight.current = null;
      });

      return refreshInFlight.current;
    },
    [applyUser],
  );

  // Quiet proactive refresh before expiry when we have a refresh token.
  useEffect(() => {
    if (!user?.refreshToken || !user.expiresAt) return;
    const ms = user.expiresAt - Date.now() - 90_000;
    if (ms > 2 * 60 * 60 * 1000) return;
    const delay = Math.max(5_000, ms);
    const timer = window.setTimeout(() => {
      void ensureAccessToken({ interactive: false }).catch(() => {
        /* needsReauth surfaces in UI */
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [user?.refreshToken, user?.expiresAt, ensureAccessToken]);

  const needsReauth = Boolean(
    user && (!user.accessToken || (user.expiresAt && user.expiresAt <= Date.now())),
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      configured: true,
      needsReauth,
      login,
      logout,
      refresh,
      ensureAccessToken,
    }),
    [user, isLoading, needsReauth, login, logout, refresh, ensureAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
