"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { MATRIX_PRODUCT_SLUG } from "@/data/products.seed";
import { callEdgeFunction } from "@/lib/edgeApi";
import {
  formatReleaseDate,
  mapDbRelease,
  type DbProductRelease,
  type ProductRelease,
} from "@/lib/releases";
import styles from "../products/admin.module.scss";

type Draft = {
  id?: string;
  product_slug: string;
  version: string;
  channel: "stable" | "beta";
  title: string;
  summary: string;
  highlightsText: string;
  requirementsText: string;
  published_at: string;
  published: boolean;
  download_url: string;
  download_filename: string;
  download_kind: string;
  download_size_bytes: string;
  sha256: string;
};

function emptyDraft(): Draft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    product_slug: MATRIX_PRODUCT_SLUG,
    version: "",
    channel: "stable",
    title: "",
    summary: "",
    highlightsText: "",
    requirementsText: "macOS 14 or later\nApple Silicon or Intel",
    published_at: `${today}T12:00:00.000Z`,
    published: true,
    download_url: "",
    download_filename: "",
    download_kind: "Universal DMG",
    download_size_bytes: "",
    sha256: "",
  };
}

function toDraft(release: ProductRelease): Draft {
  return {
    id: release.id,
    product_slug: release.productSlug,
    version: release.version,
    channel: release.channel,
    title: release.title,
    summary: release.summary,
    highlightsText: release.highlights.join("\n"),
    requirementsText: release.requirements.join("\n"),
    published_at: release.publishedAt,
    published: release.published,
    download_url: release.downloadUrl,
    download_filename: release.downloadFilename,
    download_kind: release.downloadKind,
    download_size_bytes:
      release.downloadSizeBytes != null
        ? String(release.downloadSizeBytes)
        : "",
    sha256: release.sha256 || "",
  };
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function AdminReleasesClient() {
  const { user, isLoading, ensureAccessToken } = useAuth();
  const [releases, setReleases] = useState<ProductRelease[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const accessToken = await ensureAccessToken({ interactive: false });
      const data = await callEdgeFunction<{ releases: DbProductRelease[] }>(
        "store-admin-releases",
        { action: "list", googleAccessToken: accessToken },
        accessToken,
      );
      setReleases((data.releases || []).map(mapDbRelease));
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load releases");
      setLoaded(true);
    } finally {
      setBusy(false);
    }
  }, [user, ensureAccessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!user || !editing) return;
    setBusy(true);
    setError(null);
    try {
      const accessToken = await ensureAccessToken({ interactive: true });
      await callEdgeFunction(
        "store-admin-releases",
        {
          action: "upsert",
          googleAccessToken: accessToken,
          release: {
            id: editing.id,
            product_slug: editing.product_slug,
            version: editing.version,
            channel: editing.channel,
            title: editing.title,
            summary: editing.summary || null,
            highlights: lines(editing.highlightsText),
            requirements: lines(editing.requirementsText),
            published_at: editing.published_at,
            published: editing.published,
            download_url: editing.download_url,
            download_filename: editing.download_filename || null,
            download_kind: editing.download_kind || null,
            download_size_bytes: editing.download_size_bytes
              ? Number(editing.download_size_bytes)
              : null,
            sha256: editing.sha256 || null,
          },
        },
        accessToken,
      );
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!user) return;
    if (!window.confirm("Delete this release?")) return;
    setBusy(true);
    setError(null);
    try {
      const accessToken = await ensureAccessToken({ interactive: true });
      await callEdgeFunction(
        "store-admin-releases",
        { action: "delete", googleAccessToken: accessToken, id },
        accessToken,
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="lede">Checking session…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className="page-shell">
          <p className="eyebrow">Store admin</p>
          <h1 className="display display-lg">Sign in to manage releases.</h1>
          <p className="lede">
            Installer downloads are stored in Supabase. Admins on the editor
            allowlist can publish builds and download URLs.
          </p>
          <Link
            href={`/login?returnTo=${encodeURIComponent("/admin/releases")}`}
            className="btn btn-primary"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Store admin</p>
            <h1 className="display display-lg">Releases</h1>
            <p className={styles.meta}>
              Signed in as {user.email}. Published rows appear on{" "}
              <Link href="/releases">/releases</Link> and in Account.
            </p>
          </div>
          <div className={styles.rowActions}>
            <Link href="/admin/products" className="btn btn-secondary">
              Products
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => setEditing(emptyDraft())}
            >
              New release
            </button>
          </div>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {loaded && releases.length === 0 && !editing ? (
          <p className="lede">
            No releases yet. Publish the first installer download URL.
          </p>
        ) : null}

        <ul className={styles.list}>
          {releases.map((release) => (
            <li key={release.id} className={styles.row}>
              <div>
                <strong>
                  {release.title} · v{release.version}
                </strong>
                <span className={styles.slug}>{release.productSlug}</span>
                <span>
                  {formatReleaseDate(release.publishedAt)} · {release.channel}
                  {release.published ? " · published" : " · draft"}
                </span>
              </div>
              <div className={styles.rowActions}>
                <a
                  href={release.downloadUrl}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open URL
                </a>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditing(toDraft(release))}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.danger}
                  onClick={() => void remove(release.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editing ? (
          <div className={styles.editor}>
            <h2>{editing.id ? "Edit release" : "New release"}</h2>
            <div className={styles.grid}>
              <label>
                Product slug
                <input
                  value={editing.product_slug}
                  onChange={(e) =>
                    setEditing({ ...editing, product_slug: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Version
                <input
                  value={editing.version}
                  onChange={(e) =>
                    setEditing({ ...editing, version: e.target.value })
                  }
                  placeholder="1.0.0"
                  required
                />
              </label>
              <label>
                Channel
                <select
                  value={editing.channel}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      channel: e.target.value === "beta" ? "beta" : "stable",
                    })
                  }
                >
                  <option value="stable">stable</option>
                  <option value="beta">beta</option>
                </select>
              </label>
              <label>
                Title
                <input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  required
                />
              </label>
              <label className={styles.wide}>
                Summary
                <textarea
                  value={editing.summary}
                  onChange={(e) =>
                    setEditing({ ...editing, summary: e.target.value })
                  }
                  rows={3}
                />
              </label>
              <label className={styles.wide}>
                Highlights (one per line)
                <textarea
                  value={editing.highlightsText}
                  onChange={(e) =>
                    setEditing({ ...editing, highlightsText: e.target.value })
                  }
                  rows={4}
                />
              </label>
              <label className={styles.wide}>
                Requirements (one per line)
                <textarea
                  value={editing.requirementsText}
                  onChange={(e) =>
                    setEditing({ ...editing, requirementsText: e.target.value })
                  }
                  rows={3}
                />
              </label>
              <label className={styles.wide}>
                Download URL
                <input
                  value={editing.download_url}
                  onChange={(e) =>
                    setEditing({ ...editing, download_url: e.target.value })
                  }
                  placeholder="https://…"
                  required
                />
              </label>
              <label>
                Filename
                <input
                  value={editing.download_filename}
                  onChange={(e) =>
                    setEditing({ ...editing, download_filename: e.target.value })
                  }
                  placeholder="MATRIX-1.0.0.dmg"
                />
              </label>
              <label>
                Kind
                <input
                  value={editing.download_kind}
                  onChange={(e) =>
                    setEditing({ ...editing, download_kind: e.target.value })
                  }
                />
              </label>
              <label>
                Size (bytes, optional)
                <input
                  value={editing.download_size_bytes}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      download_size_bytes: e.target.value,
                    })
                  }
                  inputMode="numeric"
                />
              </label>
              <label>
                SHA-256 (optional)
                <input
                  value={editing.sha256}
                  onChange={(e) =>
                    setEditing({ ...editing, sha256: e.target.value })
                  }
                />
              </label>
              <label>
                Published at (ISO)
                <input
                  value={editing.published_at}
                  onChange={(e) =>
                    setEditing({ ...editing, published_at: e.target.value })
                  }
                />
              </label>
              <label className={styles.wide}>
                <span>
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) =>
                      setEditing({ ...editing, published: e.target.checked })
                    }
                  />{" "}
                  Published (visible on /releases)
                </span>
              </label>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={() => void save()}
              >
                {busy ? "Saving…" : "Save release"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
