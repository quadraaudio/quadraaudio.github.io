"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_GOOGLE_CONNECTION,
  getEditorCallbackUrl,
  getEditorHomeUrl,
  isAuth0Configured,
} from "@/lib/auth0Config";
import styles from "./EditorClient.module.scss";

export default function EditorAuthProvider({ children }: { children: ReactNode }) {
  const [originReady, setOriginReady] = useState(false);

  useEffect(() => {
    setOriginReady(true);
  }, []);

  if (!isAuth0Configured()) {
    return (
      <div className={styles.gate}>
        <h1>Auth0 não configurado</h1>
        <p>
          Defina <code>NEXT_PUBLIC_AUTH0_DOMAIN</code> e{" "}
          <code>NEXT_PUBLIC_AUTH0_CLIENT_ID</code>. No Auth0 Dashboard: Application
          tipo SPA, conexão única <code>{AUTH0_GOOGLE_CONNECTION}</code>, Callback
          URLs <code>https://SEU_DOMINIO/editor/callback/</code> e{" "}
          <code>https://edit.quadraaudio.com/editor/callback/</code>.
        </p>
      </div>
    );
  }

  if (!originReady) {
    return (
      <div className={styles.gate}>
        <p>Preparando autenticação…</p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: getEditorCallbackUrl(),
        connection: AUTH0_GOOGLE_CONNECTION,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={(appState) => {
        const target = appState?.returnTo || getEditorHomeUrl();
        window.location.replace(target);
      }}
    >
      {children}
    </Auth0Provider>
  );
}
