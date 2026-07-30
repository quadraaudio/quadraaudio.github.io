"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useAuth } from "@/contexts/AuthContext";
import { puckConfig, defaultHomeData } from "@/editor/puckConfig";
import {
  publishPage,
  resolveEditorHomeData,
  saveLocalDraft,
} from "@/lib/pageStore";
import styles from "./EditorClient.module.scss";

type Status = "idle" | "saving" | "saved" | "error";

export default function EditorClient() {
  const { user, isLoggedIn } = useAuth();
  const [data, setData] = useState<Data | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isAdmin = isLoggedIn && user?.role === "admin";

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
        updatedBy: user?.email,
      });
      if (result.ok) {
        setStatus("saved");
        setMessage("Published. Live site will pick this up on next load.");
      } else {
        setStatus("error");
        setMessage(result.error || "Could not publish to Supabase.");
      }
    },
    [user?.email],
  );

  if (!isLoggedIn) {
    return (
      <div className={styles.gate}>
        <h1>Visual Editor</h1>
        <p>Sign in with an admin Quadra ID to edit the site visually.</p>
        <Link href="/login/" className={styles.button}>
          Sign in
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.gate}>
        <h1>Admin only</h1>
        <p>
          Your account ({user?.email}) does not have editor access. Use an admin
          Quadra ID.
        </p>
        <Link href="/" className={styles.button}>
          Back to site
        </Link>
      </div>
    );
  }

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
          Quadra Visual Editor · click text on the canvas to edit · drag blocks
          from the left
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
        <Link href="/" className={styles.exit}>
          Exit
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
