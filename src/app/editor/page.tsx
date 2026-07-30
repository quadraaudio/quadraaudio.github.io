"use client";

import dynamic from "next/dynamic";
import EditorGoogleAuthProvider, {
  EditorGoogleGate,
  useEditorGoogleAuth,
} from "@/components/editor/EditorGoogleAuth";
import { EditorSessionProvider } from "@/components/editor/EditorSession";

const EditorClient = dynamic(() => import("@/components/editor/EditorClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#000",
        color: "#a1a1a6",
        zIndex: 10000,
      }}
    >
      Loading visual editor…
    </div>
  ),
});

function EditorWithSession() {
  const { user, logout } = useEditorGoogleAuth();
  return (
    <EditorSessionProvider email={user?.email} logout={logout}>
      <EditorClient />
    </EditorSessionProvider>
  );
}

/**
 * Production editor auth: Google Identity Services only + Supabase allowlist.
 * Auth0 remains optional for future subdomain hardening when env is set.
 */
export default function EditorPage() {
  return (
    <EditorGoogleAuthProvider>
      <EditorGoogleGate>
        <EditorWithSession />
      </EditorGoogleGate>
    </EditorGoogleAuthProvider>
  );
}
