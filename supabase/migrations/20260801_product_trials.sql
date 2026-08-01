-- Server-backed trials: one per email AND one per hardware for each product.
CREATE TABLE IF NOT EXISTS public.product_trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  hardware_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE (product_slug, email),
  UNIQUE (product_slug, hardware_id)
);

CREATE INDEX IF NOT EXISTS product_trials_hwid_idx
  ON public.product_trials (hardware_id);

ALTER TABLE public.product_trials ENABLE ROW LEVEL SECURITY;

-- Allow trial grants on redeem codes (no paid license row).
ALTER TABLE public.license_redeem_codes
  ALTER COLUMN license_id DROP NOT NULL;

ALTER TABLE public.license_redeem_codes
  ADD COLUMN IF NOT EXISTS grant_kind TEXT NOT NULL DEFAULT 'perpetual';

ALTER TABLE public.license_redeem_codes
  ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMPTZ;
