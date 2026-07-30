"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditorGoogleAuth } from "@/components/editor/EditorGoogleAuth";
import { EDITOR_SITE_PAGES } from "@/editor/sitePages";
import {
  createEditorPage,
  isValidPageSlug,
  listEditorPages,
  type EditorPageSummary,
} from "@/lib/pageStore";
import styles from "./EditorHub.module.scss";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditorHub() {
  const { user, logout } = useEditorGoogleAuth();
  const router = useRouter();

  const [customPages, setCustomPages] = useState<EditorPageSummary[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const refreshPages = useCallback(async () => {
    setLoadingPages(true);
    const pages = await listEditorPages();
    setCustomPages(pages.filter((p) => p.slug !== "home"));
    setLoadingPages(false);
  }, []);

  useEffect(() => {
    void refreshPages();
  }, [refreshPages]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const slug = (newSlug || slugify(newTitle)).trim().toLowerCase();
    const title = newTitle.trim();

    if (!title) {
      setFormError("Dê um nome para a página.");
      return;
    }
    if (!isValidPageSlug(slug)) {
      setFormError(
        "Endereço inválido. Use apenas letras minúsculas, números e hífens.",
      );
      return;
    }

    setCreating(true);
    const result = await createEditorPage(slug, title);
    setCreating(false);

    if (!result.ok) {
      setFormError(result.error || "Não foi possível criar a página.");
      return;
    }

    router.push(
      `/editor/canvas/?slug=${encodeURIComponent(slug)}&title=${encodeURIComponent(title)}`,
    );
  };

  return (
    <div className={styles.hub} data-theme="dark">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quadra Admin</p>
          <h1 className={styles.title}>Site pages</h1>
          <p className={styles.sub}>
            Assinado como <strong>{user?.email}</strong>. Páginas de conteúdo
            são editáveis no canvas visual; páginas de aplicativo (loja, conta,
            login) mantêm sua lógica própria e abrem o site completo.
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Páginas de conteúdo</h2>
        <ul className={styles.list}>
          {EDITOR_SITE_PAGES.map((page) => (
            <li key={page.id} className={styles.card}>
              <div>
                <h3 className={styles.cardTitle}>{page.title}</h3>
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
                  <span className={styles.badge} title={page.reason}>
                    {page.reason || "Ainda não editável"}
                  </span>
                )}
              </div>
            </li>
          ))}

          {loadingPages ? (
            <li className={styles.card}>
              <p className={styles.cardBody}>Carregando páginas…</p>
            </li>
          ) : (
            customPages.map((page) => (
              <li key={page.slug} className={styles.card}>
                <div>
                  <h3 className={styles.cardTitle}>{page.title}</h3>
                  <p className={styles.cardBody}>
                    /pages/{page.slug}/ ·{" "}
                    {page.published ? "publicada" : "rascunho"}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/pages/${page.slug}/`} className={styles.link}>
                    Abrir
                  </Link>
                  <Link
                    href={`/editor/canvas/?slug=${encodeURIComponent(page.slug)}&title=${encodeURIComponent(page.title)}`}
                    className={styles.primary}
                  >
                    Editar visual
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className={styles.section}>
        {!showForm ? (
          <button
            type="button"
            className={styles.primary}
            onClick={() => setShowForm(true)}
          >
            + Nova página
          </button>
        ) : (
          <form className={styles.form} onSubmit={handleCreate}>
            <h2 className={styles.sectionTitle}>Nova página</h2>
            <label className={styles.field}>
              <span>Nome</span>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (!slugTouched) setNewSlug(slugify(e.target.value));
                }}
                placeholder="Nossa história"
                autoFocus
              />
            </label>
            <label className={styles.field}>
              <span>Endereço (/pages/…)</span>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setNewSlug(slugify(e.target.value));
                }}
                placeholder="nossa-historia"
              />
            </label>
            {formError ? (
              <p className={styles.formError}>{formError}</p>
            ) : null}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                  setNewTitle("");
                  setNewSlug("");
                  setSlugTouched(false);
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.primary}
                disabled={creating}
              >
                {creating ? "Criando…" : "Criar e editar"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
