"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Render, type Data } from "@puckeditor/core";
import ThemeSetter from "@/components/ThemeSetter";
import { puckConfig } from "@/editor/puckConfig";
import { fetchPublishedPage } from "@/lib/pageStore";

function extractSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/pages\/([^/]+)\/?/);
  return match ? match[1] : null;
}

function useResolvedSlug(): string | null {
  const params = useSearchParams();
  const queryValue = params.get("slug");

  // Cloudflare's `/pages/* -> /p/?slug=:splat` rule passes the splat
  // verbatim, e.g. "my-page/" (trailing slash from trailingSlash routing);
  // window.location is a fallback for direct hits without the query param.
  // Pure derivation, safe to compute during render (no effect needed).
  return useMemo(() => {
    const fromPath =
      typeof window !== "undefined"
        ? extractSlugFromPath(window.location.pathname)
        : null;
    const raw = (queryValue || fromPath || "").trim().toLowerCase();
    return raw.replace(/\/+$/, "") || null;
  }, [queryValue]);
}

function CustomPageInner() {
  const slug = useResolvedSlug();
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">(
    slug ? "loading" : "not-found",
  );

  useEffect(() => {
    if (!slug) return;

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
