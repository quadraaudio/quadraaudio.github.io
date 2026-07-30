"use client";

import { useEffect, useState } from "react";
import type { Data } from "@puckeditor/core";
import { PuckRenderer } from "@/components/PuckRenderer";
import { getPublishedPage } from "@/lib/pages";
import { SEED_PAGES } from "@/puck/seed-pages";

type Props = {
  slug: "home" | "hydra" | string;
};

export function PublishedPage({ slug }: Props) {
  const seed = SEED_PAGES[slug]?.data;
  const [data, setData] = useState<Data | null>(seed || null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const remote = await getPublishedPage(slug);
      if (!cancelled && remote) {
        setData(remote);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!data) {
    return (
      <main data-theme="dark" style={{ minHeight: "50vh", padding: "4rem 1.5rem" }}>
        <p>Page not found.</p>
      </main>
    );
  }

  return (
    <main data-theme="dark" style={{ minHeight: "100vh", background: "#000" }}>
      <PuckRenderer data={data} />
    </main>
  );
}
