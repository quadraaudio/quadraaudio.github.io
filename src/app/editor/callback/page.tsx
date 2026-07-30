"use client";

import { useEffect } from "react";
import EditorAuthProvider from "@/components/editor/EditorAuthProvider";
import styles from "@/components/editor/EditorClient.module.scss";

/**
 * Auth0 redirect_uri target. Auth0Provider processes the code/state
 * and onRedirectCallback sends the user back to /editor/.
 */
function CallbackInner() {
  useEffect(() => {
    // Fallback if Auth0 SDK does not navigate (e.g. already authenticated)
    const timer = window.setTimeout(() => {
      if (!window.location.search.includes("code=") && !window.location.hash) {
        window.location.replace("/editor/");
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.gate}>
      <p>Conectando com Google…</p>
    </div>
  );
}

export default function EditorCallbackPage() {
  return (
    <EditorAuthProvider>
      <CallbackInner />
    </EditorAuthProvider>
  );
}
