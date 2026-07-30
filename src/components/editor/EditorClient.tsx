"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import {
  puckEditorConfig,
  defaultHomeData,
} from "@/editor/puckConfig";
import {
  defaultBlankPageData,
  publishPage,
  resolveEditorPageData,
  saveLocalDraft,
} from "@/lib/pageStore";
import { useEditorSession } from "@/components/editor/EditorSession";
import styles from "./EditorClient.module.scss";

type Status = "idle" | "saving" | "saved" | "error";

export interface EditorClientProps {
  slug?: string;
  title?: string;
}

export default function EditorClient({
  slug = "home",
  title = "Home",
}: EditorClientProps) {
  const { email, logout } = useEditorSession();
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await resolveEditorPageData(slug, title);
      if (!cancelled) setData(resolved);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, title]);

  const handlePublish = useCallback(
    async (next: Data) => {
      setStatus("saving");
      setMessage("Publishing…");
      const result = await publishPage({
        slug,
        title,
        data: next,
        updatedBy: email,
      });
      if (result.ok) {
        setStatus("saved");
        setMessage("Published. Live site will pick this up on next load.");
      } else {
        setStatus("error");
        setMessage(result.error || "Could not publish to Supabase.");
      }
    },
    [slug, title, email],
  );

  if (!data) {
    return (
      <div className={styles.gate}>
        <p>Loading editor…</p>
      </div>
    );
  }

  const publicPath = slug === "home" ? "/" : `/pages/${slug}/`;
  const defaultForReset =
    slug === "home" ? defaultHomeData : defaultBlankPageData(title);

  return (
    <div className={styles.shell}>
      <div className={styles.banner} role="status">
        <span>
          Editando {title} · {email} · role até ver capítulos · header/footer
          no preview
        </span>
        {message ? (
          <span
            className={
              status === "error"
                ? styles.msgError
                : status === "saved"
                  ? styles.msgOk
                  : styles.msg
            }
          >
            {message}
          </span>
        ) : null}
        <Link href="/editor/" className={styles.exit}>
          Páginas
        </Link>
        <button type="button" className={styles.exit} onClick={logout}>
          Sair
        </button>
        <Link href={publicPath} className={styles.exit}>
          Ver página
        </Link>
      </div>

      <div className={styles.puckHost}>
        <Puck
          key={slug}
          config={puckEditorConfig}
          data={data}
          headerTitle={title}
          headerPath={publicPath}
          height="100%"
          iframe={{ enabled: true }}
          onChange={(next) => {
            saveLocalDraft(next, slug);
            setStatus("idle");
            setMessage("Draft saved on this device");
          }}
          onPublish={handlePublish}
          viewports={[
            { width: 360, height: "auto", icon: "Smartphone", label: "Mobile" },
            { width: 768, height: "auto", icon: "Tablet", label: "Tablet" },
            { width: 1280, height: "auto", icon: "Monitor", label: "Desktop" },
            { width: "100%", height: "auto", label: "Full" },
          ]}
        />
      </div>

      <button
        type="button"
        className={styles.reset}
        onClick={() => {
          if (
            window.confirm(
              "Reset this page to the default layout? Unpublished drafts will be replaced.",
            )
          ) {
            saveLocalDraft(defaultForReset, slug);
            setData(defaultForReset);
            setMessage("Reset to defaults (not published yet)");
          }
        }}
      >
        Reset defaults
      </button>
    </div>
  );
}
