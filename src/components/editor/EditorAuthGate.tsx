"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  AUTH0_GOOGLE_CONNECTION,
  getEditorCallbackUrl,
  getEditorHomeUrl,
} from "@/lib/auth0Config";
import { isEditorEmailAllowed } from "@/lib/editorAllowlist";
import styles from "./EditorClient.module.scss";

type GateState = "loading" | "login" | "denied" | "allowed";

/**
 * Auth0 Google-only gate + Supabase editor_allowlist check.
 */
export default function EditorAuthGate({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    error,
  } = useAuth0();

  const [gate, setGate] = useState<GateState>("loading");
  const [checkedEmail, setCheckedEmail] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function evaluate() {
      if (isLoading) {
        setGate("loading");
        return;
      }

      if (!isAuthenticated || !user?.email) {
        setGate("login");
        return;
      }

      setCheckedEmail(user.email);
      const allowed = await isEditorEmailAllowed(user.email);
      if (cancelled) return;
      setGate(allowed ? "allowed" : "denied");
    }

    void evaluate();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, user?.email]);

  if (gate === "loading") {
    return (
      <div className={styles.gate}>
        <p>Verificando acesso…</p>
      </div>
    );
  }

  if (gate === "login") {
    return (
      <div className={styles.gate}>
        <h1>Quadra Editor</h1>
        <p>
          Acesso restrito. Entre apenas com Google via Auth0. Seu e-mail precisa
          estar na allowlist do Supabase.
        </p>
        {error ? (
          <p className={styles.msgError}>{error.message}</p>
        ) : null}
        <button
          type="button"
          className={styles.button}
          onClick={() =>
            loginWithRedirect({
              appState: { returnTo: getEditorHomeUrl() },
              authorizationParams: {
                connection: AUTH0_GOOGLE_CONNECTION,
                redirect_uri: getEditorCallbackUrl(),
              },
            })
          }
        >
          Continuar com Google
        </button>
      </div>
    );
  }

  if (gate === "denied") {
    return (
      <div className={styles.gate}>
        <h1>Sem permissão</h1>
        <p>
          O e-mail <strong>{checkedEmail}</strong> autenticou no Google, mas não
          está autorizado em <code>editor_allowlist</code>.
        </p>
        <button
          type="button"
          className={styles.button}
          onClick={() =>
            logout({
              logoutParams: { returnTo: getEditorHomeUrl() },
            })
          }
        >
          Sair
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
