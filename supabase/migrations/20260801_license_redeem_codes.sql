-- One-time activation codes (web → Matrix deep link redeem).
CREATE TABLE IF NOT EXISTS public.license_redeem_codes (
  code TEXT PRIMARY KEY,
  license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  hardware_id TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS license_redeem_codes_hwid_idx
  ON public.license_redeem_codes (hardware_id);

ALTER TABLE public.license_redeem_codes ENABLE ROW LEVEL SECURITY;
