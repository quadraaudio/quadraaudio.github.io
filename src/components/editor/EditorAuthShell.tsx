"use client";

import type { ReactNode } from "react";
import EditorGoogleAuthProvider, {
  EditorGoogleGate,
  useEditorGoogleAuth,
} from "@/components/editor/EditorGoogleAuth";
import { EditorSessionProvider } from "@/components/editor/EditorSession";

function WithSession({ children }: { children: ReactNode }) {
  const { user, logout } = useEditorGoogleAuth();
  return (
    <EditorSessionProvider email={user?.email} logout={logout}>
      {children}
    </EditorSessionProvider>
  );
}

/** Shared Google + allowlist gate for all /editor routes */
export default function EditorAuthShell({ children }: { children: ReactNode }) {
  return (
    <EditorGoogleAuthProvider>
      <EditorGoogleGate>
        <WithSession>{children}</WithSession>
      </EditorGoogleGate>
    </EditorGoogleAuthProvider>
  );
}
