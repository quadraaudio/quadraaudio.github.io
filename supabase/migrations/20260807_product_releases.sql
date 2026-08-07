-- Product installer releases (downloads). Managed via store-admin-releases.
-- Public may read published rows only; no seed data — publish from admin.

CREATE TABLE IF NOT EXISTS public.product_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  version text NOT NULL,
  channel text NOT NULL DEFAULT 'stable'
    CHECK (channel IN ('stable', 'beta')),
  title text NOT NULL,
  summary text,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  published_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT true,
  download_url text NOT NULL,
  download_filename text,
  download_kind text NOT NULL DEFAULT 'Universal DMG',
  download_size_bytes bigint,
  sha256 text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_releases_slug_version_channel_key
    UNIQUE (product_slug, version, channel)
);

CREATE INDEX IF NOT EXISTS product_releases_published_idx
  ON public.product_releases (product_slug, published, published_at DESC);

ALTER TABLE public.product_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public published releases read" ON public.product_releases;
CREATE POLICY "Public published releases read"
  ON public.product_releases
  FOR SELECT
  TO public
  USING (published = true);

DROP POLICY IF EXISTS "Store admins manage releases" ON public.product_releases;
CREATE POLICY "Store admins manage releases"
  ON public.product_releases
  FOR ALL
  TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

GRANT SELECT ON public.product_releases TO anon, authenticated;
GRANT ALL ON public.product_releases TO service_role;
