"use client";

/**
 * Reserved for Auth0 redirect flow when NEXT_PUBLIC_AUTH0_* is configured.
 * Current production auth uses Google GIS on /editor/ directly.
 */
export default function EditorCallbackPage() {
  if (typeof window !== "undefined") {
    window.location.replace("/editor/");
  }
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#000",
        color: "#a1a1a6",
      }}
    >
      Redirecionando…
    </div>
  );
}
