"use client";

import dynamic from "next/dynamic";
import EditorAuthShell from "@/components/editor/EditorAuthShell";

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

export default function EditorHomePage() {
  return (
    <EditorAuthShell>
      <EditorClient />
    </EditorAuthShell>
  );
}
