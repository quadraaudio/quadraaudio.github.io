-- Seat bindings for Quadra Guard (up to 2 Macs per license).
CREATE TABLE IF NOT EXISTS public.license_activations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  hardware_id TEXT NOT NULL,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (license_id, hardware_id)
);

CREATE INDEX IF NOT EXISTS license_activations_hwid_idx
  ON public.license_activations (hardware_id);

ALTER TABLE public.license_activations ENABLE ROW LEVEL SECURITY;
