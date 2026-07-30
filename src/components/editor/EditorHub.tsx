"use client";

import Link from "next/link";
import { useEditorGoogleAuth } from "@/components/editor/EditorGoogleAuth";
import { EDITOR_SITE_PAGES } from "@/editor/sitePages";
import styles from "./EditorHub.module.scss";

export default function EditorHub() {
  const { user, logout } = useEditorGoogleAuth();

  return (
    <div className={styles.hub} data-theme="dark">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quadra Admin</p>
          <h1 className={styles.title}>Site pages</h1>
          <p className={styles.sub}>
            Assinado como <strong>{user?.email}</strong>. A home é editável no
            canvas visual; as outras rotas abrem o site completo com header e
            footer.
          </p>
        </div>
        <div className={styles.actions}>
          <Link href="/" className={styles.secondary}>
            Ver site
          </Link>
          <button type="button" className={styles.secondary} onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <ul className={styles.list}>
        {EDITOR_SITE_PAGES.map((page) => (
          <li key={page.id} className={styles.card}>
            <div>
              <h2 className={styles.cardTitle}>{page.title}</h2>
              <p className={styles.cardBody}>{page.description}</p>
            </div>
            <div className={styles.cardActions}>
              <Link href={page.href} className={styles.link}>
                Abrir
              </Link>
              {page.editable ? (
                <Link href={page.editHref} className={styles.primary}>
                  Editar visual
                </Link>
              ) : (
                <span className={styles.badge}>Em breve no editor</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
