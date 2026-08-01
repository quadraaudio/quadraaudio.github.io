-- Catalog: MATRIX only + store admin write via editor_allowlist

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.is_store_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.editor_allowlist e
    WHERE e.active = true
      AND lower(e.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION public.is_store_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_store_admin() TO authenticated, anon;

DROP POLICY IF EXISTS "Store admins manage products" ON public.products;
CREATE POLICY "Store admins manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_store_admin())
  WITH CHECK (public.is_store_admin());

INSERT INTO public.products (
  slug, name, tagline, description, price, currency, category, badge,
  availability_status, features, system_requirements, card_gradient, sort_order
) VALUES (
  'quadra-matrix',
  'MATRIX',
  'The complete virtual audio patchbay for macOS.',
  'Eight selectable MATRIX Audio Bridges (2 to 128 channels each) that any app can pick as input or output, routed freely between apps, hardware, out-of-process VST3 plugins, and network audio — all in one visual Matrix Grid.',
  179.00,
  'USD',
  'software',
  'Virtual Audio Patchbay',
  'available',
  '[{"title":"Eight Audio Bridges","description":"2‑A, 2‑B, 4, 8, 16, 32, 64 and 128‑channel virtual soundcards — up to 256 channels of routing headroom."},{"title":"The Matrix Grid","description":"Visual cross-point routing with gainful connections and scenes."},{"title":"Quadra Guard","description":"14-day trial, then activate this Mac with your Quadra ID (2 seats)."}]'::jsonb,
  '["macOS 26+","Apple Silicon or Intel","Admin install for HAL drivers"]'::jsonb,
  'linear-gradient(145deg, #0e1218 0%, #1c4f4d 55%, #00a3a0 120%)',
  10
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  category = EXCLUDED.category,
  badge = EXCLUDED.badge,
  availability_status = EXCLUDED.availability_status,
  features = EXCLUDED.features,
  system_requirements = EXCLUDED.system_requirements,
  card_gradient = EXCLUDED.card_gradient,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

DELETE FROM public.products
WHERE slug IN ('quadra-channel', 'quadra-dynamics', 'quadra-studio-bundle');
