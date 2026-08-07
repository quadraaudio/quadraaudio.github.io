-- Integer build number for MATRIX app update checks (MATRIX_BUILD).
-- Already applied remotely as product_releases_build_number.

ALTER TABLE public.product_releases
  ADD COLUMN IF NOT EXISTS build integer NOT NULL DEFAULT 1;

COMMENT ON COLUMN public.product_releases.build IS
  'Monotonic installer build id; must match Packaging/version.env MATRIX_BUILD.';
