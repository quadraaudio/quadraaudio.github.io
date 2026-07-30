"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Render, type Data } from "@puckeditor/core";
import ThemeSetter from "@/components/ThemeSetter";
import { puckConfig } from "@/editor/puckConfig";
import { fetchPublishedPage } from "@/lib/pageStore";

function extractSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/pages\/([^/]+)\/?/);
  return match ? match[1] : null;
}

function CustomPageInner() {
  const params = useSearchParams();
  const [slug, setSlug] = useState<string | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">(
    "loading",
  );

  useEffect(() => {
    // Cloudflare's `/pages/* -> /p/index.html?slug=:splat` rule passes the
    // splat verbatim, e.g. "my-page/" (trailing slash from trailingSlash
    // routing) — normalize before using it as a lookup key.
    const fromQuery = params.get("slug");
    const fromPath =
      typeof window !== "undefined"
        ? extractSlugFromPath(window.location.pathname)
        : null;
    const raw = (fromQuery || fromPath || "").trim().toLowerCase();
    setSlug(raw.replace(/\/+$/, "") || null);
  }, [params]);

  useEffect(() => {
    if (!slug) {
      setStatus("not-found");
      return;
    }
    let cancelled = false;
    (async () => {
      const remote = await fetchPublishedPage(slug);
      if (cancelled) return;
      if (!remote) {
        setStatus("not-found");
        return;
      }
      setData(remote);
      setStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        Carregando…
      </div>
    );
  }

  if (status === "not-found" || !data) {
    return (
      <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <h1>Página não encontrada</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Esta página ainda não foi publicada.
        </p>
      </div>
    );
  }

  return <Render config={puckConfig} data={data} />;
}

export default function CustomPageRoute() {
  return (
    <div data-theme="dark">
      <ThemeSetter theme="dark" />
      <Suspense
        fallback={
          <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
            Carregando…
          </div>
        }
      >
        <CustomPageInner />
      </Suspense>
    </div>
  );
}
