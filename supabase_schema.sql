-- ─────────────────────────────────────────────────────────
-- Quadra Audio — Store schema (v2, Supabase Auth)
-- Applied via MCP migration e2e_store_auth_and_fulfillment
-- ─────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.product_availability AS ENUM ('available', 'sold_out', 'coming_soon');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  category TEXT NOT NULL DEFAULT 'software',
  badge TEXT,
  availability_status public.product_availability NOT NULL DEFAULT 'available',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  system_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  card_gradient TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5, 2) DEFAULT 0,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  email TEXT,
  user_email TEXT,
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  paypal_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  product_slug TEXT NOT NULL,
  email TEXT,
  user_email TEXT,
  user_id UUID,
  status TEXT NOT NULL DEFAULT 'active',
  hardware_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TEXT DEFAULT 'PERPETUAL'
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS orders_paypal_order_id_idx ON public.orders (paypal_order_id);
CREATE INDEX IF NOT EXISTS licenses_user_id_idx ON public.licenses (user_id);
CREATE INDEX IF NOT EXISTS licenses_email_idx ON public.licenses (email);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public products read" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public active coupons read" ON public.coupons;
CREATE POLICY "Public active coupons read" ON public.coupons
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users read own licenses" ON public.licenses;
CREATE POLICY "Users read own licenses" ON public.licenses
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Fulfillment RPC (authenticated) — see migration e2e_store_auth_and_fulfillment

INSERT INTO public.products (
  slug, name, tagline, description, price, currency, category, badge,
  availability_status, features, system_requirements, card_gradient
) VALUES
(
  'quadra-channel',
  'Quadra Channel',
  'A modern channel strip for demanding sessions.',
  'EQ, dynamics, and saturation shaped for pro tracking and mix buses.',
  149.00, 'USD', 'software', 'Channel Strip', 'available',
  '[{"title":"Precision EQ","description":"Musical curves with surgical mid-band focus."},{"title":"Adaptive Dynamics","description":"Compressor and gate tuned for vocals and buses."},{"title":"Recall Safe","description":"Session presets that travel cleanly across machines."}]'::jsonb,
  '["macOS 13+ or Windows 10+","VST3 / AU / AAX","8 GB RAM recommended"]'::jsonb,
  'linear-gradient(145deg, #0e1218 0%, #1c4f4d 55%, #00a3a0 120%)'
),
(
  'quadra-dynamics',
  'Quadra Dynamics',
  'Compression and transient control with studio polish.',
  'A focused dynamics suite for mix engineers who need transparent leveling and character on demand.',
  129.00, 'USD', 'software', 'Dynamics', 'available',
  '[{"title":"Dual Character","description":"Clean digital path or warmer color."},{"title":"Transient Designer","description":"Shape attack and sustain."},{"title":"Sidechain Tools","description":"Flexible detection filters."}]'::jsonb,
  '["macOS 13+ or Windows 10+","VST3 / AU / AAX","8 GB RAM recommended"]'::jsonb,
  'linear-gradient(145deg, #121820 0%, #2a3a55 50%, #e8a54b 130%)'
),
(
  'quadra-studio-bundle',
  'Quadra Studio Bundle',
  'Core tools for tracking, mixing, and delivery.',
  'A curated starter set of Quadra processors for producers and engineers.',
  249.00, 'USD', 'bundle', 'Bundle', 'available',
  '[{"title":"Channel + Dynamics","description":"Essential processors together."},{"title":"Shared Preset Library","description":"Cross-plugin presets."},{"title":"Lifetime Updates","description":"Licensed once."}]'::jsonb,
  '["macOS 13+ or Windows 10+","VST3 / AU / AAX","8 GB RAM recommended"]'::jsonb,
  'linear-gradient(145deg, #0e1218 0%, #243041 45%, #8b95a5 120%)'
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
  card_gradient = EXCLUDED.card_gradient;

INSERT INTO public.coupons (code, discount_percent, discount_amount, active)
VALUES
  ('QUADRA10', 10, 0, true),
  ('LAUNCH20', 20, 0, true),
  ('STUDIO50', 50, 0, true),
  ('FREE100', 100, 0, true)
ON CONFLICT (code) DO UPDATE SET
  discount_percent = EXCLUDED.discount_percent,
  active = EXCLUDED.active;
