"use client";

import { useEffect, useState } from "react";
import { Render, type Data } from "@puckeditor/core";
import ThemeSetter from "@/components/ThemeSetter";
import { puckConfig, defaultHomeData } from "@/editor/puckConfig";
import { resolvePublicHomeData } from "@/lib/pageStore";
import styles from "./page.module.scss";

export default function Home() {
  const [data, setData] = useState<Data>(defaultHomeData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await resolvePublicHomeData();
      if (!cancelled) {
        setData(resolved);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page} data-theme="dark">
      <ThemeSetter theme="dark" />
      <div className={ready ? undefined : styles.pending}>
        <Render config={puckConfig} data={data} />
      </div>
    </div>
  );
}
