"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import EditorAuthShell from "@/components/editor/EditorAuthShell";
import styles from "@/components/editor/EditorClient.module.scss";

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

function CanvasInner() {
  const params = useSearchParams();
  const slug = (params.get("slug") || "").trim().toLowerCase();
  const title = params.get("title") || slug;

  if (!slug) {
    return (
      <div className={styles.gate}>
        <h1>Página inválida</h1>
        <p>Volte e escolha uma página para editar.</p>
        <Link href="/editor/" className={styles.button}>
          Páginas
        </Link>
      </div>
    );
  }

  return <EditorClient key={slug} slug={slug} title={title} />;
}

export default function EditorCanvasPage() {
  return (
    <EditorAuthShell>
      <Suspense
        fallback={
          <div className={styles.gate}>
            <p>Carregando…</p>
          </div>
        }
      >
        <CanvasInner />
      </Suspense>
    </EditorAuthShell>
  );
}
