"use client";

import dynamic from "next/dynamic";

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

export default function EditorPage() {
  return <EditorClient />;
}
