"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { callEdgeFunction } from "@/lib/edgeApi";
import { formatPrice } from "@/lib/products";
import styles from "./admin.module.scss";

type DbProduct = {
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  badge: string | null;
  availability_status: "available" | "sold_out" | "coming_soon";
  features: { title: string; description: string }[];
  system_requirements: string[];
  card_gradient: string | null;
  sort_order: number;
};

const EMPTY: DbProduct = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  price: 0,
  currency: "USD",
  category: "software",
  badge: "",
  availability_status: "available",
  features: [{ title: "", description: "" }],
  system_requirements: [""],
  card_gradient: "linear-gradient(145deg, #0e1218 0%, #1c4f4d 55%, #00a3a0 120%)",
  sort_order: 100,
};

export default function AdminProductsPage() {
  const { user, isLoading, ensureAccessToken } = useAuth();
  const { refresh: refreshCatalog } = useCatalog();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const accessToken = await ensureAccessToken({ interactive: false });
      const data = await callEdgeFunction<{ products: DbProduct[] }>(
        "store-admin-products",
        { action: "list", googleAccessToken: accessToken },
        accessToken
      );
      setProducts(data.products || []);
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
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
      const features = editing.features.filter((f) => f.title.trim());
      const reqs = editing.system_requirements.filter((r) => r.trim());
      await callEdgeFunction(
        "store-admin-products",
        {
          action: "upsert",
          googleAccessToken: accessToken,
          product: {
            ...editing,
            features,
            system_requirements: reqs,
            badge: editing.badge || null,
            tagline: editing.tagline || null,
            description: editing.description || null,
          },
        },
        accessToken
      );
      setEditing(null);
      await load();
      await refreshCatalog();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
    if (!user) return;
    if (!window.confirm(`Delete product “${slug}”?`)) return;
    setBusy(true);
    setError(null);
    try {
      const accessToken = await ensureAccessToken({ interactive: true });
      await callEdgeFunction(
        "store-admin-products",
        {
          action: "delete",
          googleAccessToken: accessToken,
          slug,
        },
        accessToken
      );
      await load();
      await refreshCatalog();
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
          <h1 className="display display-lg">Sign in to manage products.</h1>
          <p className="lede">
            Product catalog is stored in Supabase. Admins on the editor allowlist
            can create, edit, and remove SKUs.
          </p>
          <Link
            href={`/login?returnTo=${encodeURIComponent("/admin/products")}`}
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
            <h1 className="display display-lg">Products</h1>
            <p className={styles.meta}>
              Signed in as {user.email}. Changes write to the live Supabase
              catalog.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={() => setEditing({ ...EMPTY })}
          >
            New product
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {loaded && products.length === 0 && !editing && (
          <p className="lede">No products yet. Create the first SKU.</p>
        )}

        <ul className={styles.list}>
          {products.map((p) => (
            <li key={p.slug} className={styles.row}>
              <div>
                <strong>{p.name}</strong>
                <span className={styles.slug}>{p.slug}</span>
                <span>
                  {formatPrice(Number(p.price), p.currency)} · {p.availability_status}
                </span>
              </div>
              <div className={styles.rowActions}>
                <Link href={`/store/${p.slug}`} className="btn btn-secondary">
                  View store
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setEditing({
                      ...p,
                      features: p.features?.length
                        ? p.features
                        : [{ title: "", description: "" }],
                      system_requirements: p.system_requirements?.length
                        ? p.system_requirements
                        : [""],
                    })
                  }
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.danger}
                  onClick={() => void remove(p.slug)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editing && (
          <div className={styles.editor}>
            <h2>{editing.slug ? `Edit ${editing.name || editing.slug}` : "New product"}</h2>
            <div className={styles.grid}>
              <label>
                Slug
                <input
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                  placeholder="quadra-matrix"
                />
              </label>
              <label>
                Name
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="MATRIX"
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  step="0.01"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      price: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Sort order
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sort_order: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Badge
                <input
                  value={editing.badge || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, badge: e.target.value })
                  }
                />
              </label>
              <label>
                Availability
                <select
                  value={editing.availability_status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      availability_status: e.target
                        .value as DbProduct["availability_status"],
                    })
                  }
                >
                  <option value="available">available</option>
                  <option value="sold_out">sold_out</option>
                  <option value="coming_soon">coming_soon</option>
                </select>
              </label>
              <label className={styles.wide}>
                Tagline
                <input
                  value={editing.tagline || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, tagline: e.target.value })
                  }
                />
              </label>
              <label className={styles.wide}>
                Description
                <textarea
                  rows={4}
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={() => void save()}
              >
                Save to store
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
        )}
      </div>
    </main>
  );
}
