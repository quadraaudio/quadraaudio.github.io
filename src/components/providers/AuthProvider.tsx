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

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
  accessToken?: string;
  /** Epoch ms when accessToken should be treated as expired. */
  expiresAt?: number;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  configured: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  /** Return a valid Google access token, refreshing via GIS when needed. */
  ensureAccessToken: () => Promise<string>;
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
  // Legacy sessions without expiresAt: treat as usable until an API rejects them.
  if (!user.expiresAt) return true;
  return user.expiresAt > Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRef = useRef<AuthUser | null>(null);
  const refreshInFlight = useRef<Promise<string> | null>(null);

  useEffect(() => {
    const loaded = loadUser();
    userRef.current = loaded;
    setUser(loaded);
    setIsLoading(false);
  }, []);

  const login = useCallback((next: AuthUser) => {
    userRef.current = next;
    setUser(next);
    persistUser(next);
  }, []);

  const logout = useCallback(() => {
    userRef.current = null;
    setUser(null);
    persistUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const loaded = loadUser();
    userRef.current = loaded;
    setUser(loaded);
  }, []);

  const ensureAccessToken = useCallback(async () => {
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
      const token = await requestGoogleAccessToken({ interactive: true });
      const base = loadUser() || userRef.current;
      if (!base?.id || !base?.email) {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        });
        if (!res.ok) {
          throw new Error("Google session expired. Sign in again.");
        }
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
        };
        userRef.current = next;
        setUser(next);
        persistUser(next);
        return next.accessToken!;
      }

      const next: AuthUser = {
        ...base,
        accessToken: token.accessToken,
        expiresAt: token.expiresAt,
      };
      userRef.current = next;
      setUser(next);
      persistUser(next);
      return token.accessToken;
    })().finally(() => {
      refreshInFlight.current = null;
    });

    return refreshInFlight.current;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      configured: true,
      login,
      logout,
      refresh,
      ensureAccessToken,
    }),
    [user, isLoading, login, logout, refresh, ensureAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
