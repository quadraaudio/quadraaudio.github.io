-- ─────────────────────────────────────────────────────────
-- Quadra Audio — Supabase SQL Database Schema
-- Domain: quadraaudio.com
-- Paste this script into Supabase Dashboard -> SQL Editor
-- ─────────────────────────────────────────────────────────

-- 1. Create Enum Type for Product Availability Status
DO $$ BEGIN
    CREATE TYPE public.product_availability AS ENUM ('available', 'sold_out', 'coming_soon');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Products Table (Single Status Dropdown)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'software',
  badge TEXT,
  availability_status public.product_availability NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────
-- MIGRATION: ensure availability_status enum column exists
-- (safe if already migrated)
-- ─────────────────────────────────────────────────────────
ALTER TABLE public.products DROP COLUMN IF EXISTS available;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE public.products
      ADD COLUMN availability_status public.product_availability NOT NULL DEFAULT 'available';
  END IF;
END $$;

-- 3. Create Licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT,
  product_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  hardware_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TEXT DEFAULT 'PERPETUAL'
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) for Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Idempotent policies (safe to re-run)
DROP POLICY IF EXISTS "Public products read" ON public.products;
DROP POLICY IF EXISTS "Users read own licenses" ON public.licenses;

CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users read own licenses" ON public.licenses FOR SELECT USING (true);

-- 6. Insert / Update Initial Quadra Audio Products
INSERT INTO public.products (slug, name, tagline, description, price, category, badge, availability_status)
VALUES 
  ('hydra', 'Hydra', 'Sound thinking. Boundless routing.', 'The ultimate virtual soundcard, AoIP network matrix, and spatial audio monitor controller for macOS.', 199.99, 'software', 'Virtual Audio Matrix', 'available'),
  ('hydra-pro', 'Hydra Pro', 'Pure spatial audio matrix routing.', 'The premier 128-channel virtual audio router engineered for macOS.', 199.99, 'software', 'New Software', 'available'),
  ('quadra-core-io', 'Quadra Core I/O', 'Studio Thunderbolt audio interface.', 'Hardware companion rack for Hydra Pro with 32-bit float AD/DA converters.', 0, 'hardware', 'Coming Soon', 'coming_soon')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  badge = EXCLUDED.badge,
  availability_status = EXCLUDED.availability_status;

-- 7. Create Pages Table for Puck Visual Editor
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'published',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Replace legacy open policies if they exist
DROP POLICY IF EXISTS "Public pages read" ON public.pages;
DROP POLICY IF EXISTS "Authenticated pages edit" ON public.pages;
DROP POLICY IF EXISTS "pages_public_read" ON public.pages;
DROP POLICY IF EXISTS "pages_auth_write" ON public.pages;
DROP POLICY IF EXISTS "pages_auth_select" ON public.pages;
DROP POLICY IF EXISTS "pages_auth_insert" ON public.pages;
DROP POLICY IF EXISTS "pages_auth_update" ON public.pages;
DROP POLICY IF EXISTS "pages_auth_delete" ON public.pages;

-- Anyone can read published pages (public site + static export)
CREATE POLICY "pages_public_read"
  ON public.pages
  FOR SELECT
  USING (status = 'published');

-- Signed-in editors can read all rows (drafts + published)
CREATE POLICY "pages_auth_select"
  ON public.pages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "pages_auth_insert"
  ON public.pages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "pages_auth_update"
  ON public.pages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "pages_auth_delete"
  ON public.pages
  FOR DELETE
  TO authenticated
  USING (true);

-- Editor setup (Google OAuth — same Client ID already used on the site):
-- 1. Google Cloud Console → OAuth client → add Authorized redirect URI:
--    https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
-- 2. Supabase → Authentication → Providers → Google → Enable
--    paste Client ID + Client Secret from Google Cloud
-- 3. Supabase → Authentication → URL Configuration:
--    Site URL: http://localhost:3000  (and later https://quadraaudio.com)
--    Redirect URLs: http://localhost:3000/edit/ , https://quadraaudio.com/edit/
-- 4. Optional: set NEXT_PUBLIC_EDITOR_EMAILS=you@gmail.com in .env to lock the canvas
-- 5. Open /edit/ → Sign in with Google → Publish



