"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isEditorEmailAllowed } from "@/lib/editorAllowlist";
import styles from "./EditorClient.module.scss";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "120489321679-udegv4a0kl5o193bqnji07351kseca47.apps.googleusercontent.com";

const SESSION_KEY = "quadra_editor_google_session_v1";

type GoogleTokenClient = { requestAccessToken: () => void };

type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: { access_token?: string }) => void;
    error_callback?: (err: unknown) => void;
  }) => GoogleTokenClient;
};

function getGoogleOAuth2(): GoogleOAuth2 | undefined {
  const g = (window as Window & { google?: { accounts?: { oauth2?: GoogleOAuth2 } } })
    .google;
  return g?.accounts?.oauth2;
}

export interface EditorGoogleUser {
  email: string;
  name: string;
  picture?: string;
}

interface EditorGoogleAuthValue {
  user: EditorGoogleUser | null;
  isLoading: boolean;
  isAllowed: boolean | null;
  error: string;
  loginWithGoogle: () => void;
  logout: () => void;
}

const EditorGoogleAuthContext = createContext<EditorGoogleAuthValue | null>(
  null,
);

async function fetchGoogleProfile(accessToken: string): Promise<EditorGoogleUser> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to load Google profile");
  const data = await res.json();
  if (!data.email) throw new Error("Google account has no email");
  return {
    email: String(data.email).toLowerCase(),
    name: data.name || data.given_name || String(data.email).split("@")[0],
    picture: data.picture,
  };
}

export function useEditorGoogleAuth(): EditorGoogleAuthValue {
  const ctx = useContext(EditorGoogleAuthContext);
  if (!ctx) {
    throw new Error("useEditorGoogleAuth must be used within EditorGoogleAuthProvider");
  }
  return ctx;
}

export default function EditorGoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<EditorGoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [gisReady, setGisReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as EditorGoogleUser);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // next/script only fires onLoad once per src across the whole app.
    // When this provider remounts on client-side navigation (e.g. /editor/
    // -> /editor/home/) after the script already loaded, onLoad never fires
    // again, so we must also detect an already-ready SDK by polling.
    if (getGoogleOAuth2()) {
      setGisReady(true);
      return;
    }

    const interval = window.setInterval(() => {
      if (getGoogleOAuth2()) {
        setGisReady(true);
        window.clearInterval(interval);
      }
    }, 150);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setGisReady((ready) => {
        if (!ready) setError("Não foi possível carregar o Google Sign-In.");
        return ready;
      });
    }, 8000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function checkAllowlist() {
      if (!user?.email) {
        setIsAllowed(null);
        return;
      }
      const allowed = await isEditorEmailAllowed(user.email);
      if (!cancelled) setIsAllowed(allowed);
    }
    void checkAllowlist();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const loginWithGoogle = useCallback(() => {
    setError("");
    const oauth2 = getGoogleOAuth2();
    if (!oauth2) {
      setError("Google Sign-In ainda a carregar. Tente de novo em 1 segundo.");
      return;
    }

    const client = oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "email profile openid",
      callback: async (response) => {
        if (!response.access_token) {
          setError("Google login canceled.");
          return;
        }
        try {
          const profile = await fetchGoogleProfile(response.access_token);
          localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
          setUser(profile);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Google login failed");
        }
      },
      error_callback: () => setError("Google login failed"),
    });
    client.requestAccessToken();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsAllowed(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading: isLoading || !gisReady,
      isAllowed,
      error,
      loginWithGoogle,
      logout,
    }),
    [user, isLoading, gisReady, isAllowed, error, loginWithGoogle, logout],
  );

  return (
    <EditorGoogleAuthContext.Provider value={value}>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setGisReady(true)}
        onLoad={() => setGisReady(true)}
        onError={() => setError("Não foi possível carregar o Google Sign-In SDK")}
      />
      {children}
    </EditorGoogleAuthContext.Provider>
  );
}

export function EditorGoogleGate({ children }: { children: ReactNode }) {
  const { user, isLoading, isAllowed, error, loginWithGoogle, logout } =
    useEditorGoogleAuth();

  if (isLoading) {
    return (
      <div className={styles.gate}>
        <p>Verificando acesso…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.gate}>
        <h1>Quadra Editor</h1>
        <p>
          Acesso restrito. Entre apenas com Google. O e-mail precisa estar na
          allowlist do Supabase (<code>editor_allowlist</code>).
        </p>
        {error ? <p className={styles.msgError}>{error}</p> : null}
        <button type="button" className={styles.button} onClick={loginWithGoogle}>
          Continuar com Google
        </button>
      </div>
    );
  }

  if (isAllowed === null) {
    return (
      <div className={styles.gate}>
        <p>Validando allowlist…</p>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className={styles.gate}>
        <h1>Sem permissão</h1>
        <p>
          O e-mail <strong>{user.email}</strong> autenticou no Google, mas não
          está autorizado em <code>editor_allowlist</code>.
        </p>
        <button type="button" className={styles.button} onClick={logout}>
          Sair
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
