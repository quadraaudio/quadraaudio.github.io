"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig, defaultHomeData } from "@/editor/puckConfig";
import {
  publishPage,
  resolveEditorHomeData,
  saveLocalDraft,
} from "@/lib/pageStore";
import { useEditorSession } from "@/components/editor/EditorSession";
import styles from "./EditorClient.module.scss";

type Status = "idle" | "saving" | "saved" | "error";

export default function EditorClient() {
  const { email, logout } = useEditorSession();
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await resolveEditorHomeData();
      if (!cancelled) setData(resolved);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePublish = useCallback(
    async (next: Data) => {
      setStatus("saving");
      setMessage("Publishing…");
      const result = await publishPage({
        slug: "home",
        title: "Home",
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
    [email],
  );

  if (!data) {
    return (
      <div className={styles.gate}>
        <p>Loading editor…</p>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.banner} role="status">
        <span>
          Quadra Visual Editor · {email} · Google · clique no texto para editar
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
        <button type="button" className={styles.exit} onClick={logout}>
          Sair
        </button>
        <Link href="/" className={styles.exit}>
          Site
        </Link>
      </div>

      <div className={styles.puckHost}>
        <Puck
          config={puckConfig}
          data={data}
          headerTitle="Home"
          headerPath="/"
          height="100%"
          iframe={{ enabled: true }}
          onChange={(next) => {
            saveLocalDraft(next, "home");
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
              "Reset this page to the default Hydra layout? Unpublished drafts will be replaced.",
            )
          ) {
            saveLocalDraft(defaultHomeData, "home");
            setData(defaultHomeData);
            setMessage("Reset to defaults (not published yet)");
          }
        }}
      >
        Reset defaults
      </button>
    </div>
  );
}
