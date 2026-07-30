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
-- MIGRATION SCRIPT FOR EXISTING SUPABASE TABLES
-- Run this in SQL Editor to remove legacy 'available' column 
-- and transform 'availability_status' into a native Dropdown!
-- ─────────────────────────────────────────────────────────
ALTER TABLE public.products DROP COLUMN IF EXISTS available;
ALTER TABLE public.products DROP COLUMN IF EXISTS availability_status;

ALTER TABLE public.products ADD COLUMN availability_status public.product_availability NOT NULL DEFAULT 'available';

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

-- Allow public read access to products
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);

-- Allow authenticated users to view their own licenses
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

-- ─────────────────────────────────────────────────────────
-- 7. Visual Editor (Puck) — site page JSON storage
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  puck_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published site pages" ON public.site_pages;
CREATE POLICY "Public read published site pages"
  ON public.site_pages
  FOR SELECT
  USING (published = true);

CREATE TABLE IF NOT EXISTS public.site_editor_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  publish_secret TEXT NOT NULL
);

ALTER TABLE public.site_editor_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO public.site_editor_settings (id, publish_secret)
VALUES (1, 'quadra-editor-change-me')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.publish_site_page(
  p_slug TEXT,
  p_title TEXT,
  p_data JSONB,
  p_secret TEXT,
  p_updated_by TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.site_pages;
BEGIN
  IF p_secret IS NULL OR p_secret <> (
    SELECT publish_secret FROM public.site_editor_settings WHERE id = 1
  ) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  INSERT INTO public.site_pages AS sp (slug, title, puck_data, published, updated_by, updated_at)
  VALUES (p_slug, COALESCE(p_title, 'Untitled'), COALESCE(p_data, '{}'::jsonb), true, p_updated_by, NOW())
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    puck_data = EXCLUDED.puck_data,
    published = true,
    updated_by = EXCLUDED.updated_by,
    updated_at = NOW()
  RETURNING * INTO result;

  RETURN to_jsonb(result);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_editor_site_page(
  p_slug TEXT,
  p_secret TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.site_pages;
BEGIN
  IF p_secret IS NULL OR p_secret <> (
    SELECT publish_secret FROM public.site_editor_settings WHERE id = 1
  ) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT * INTO result FROM public.site_pages WHERE slug = p_slug;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  RETURN to_jsonb(result);
END;
$$;

GRANT EXECUTE ON FUNCTION public.publish_site_page(TEXT, TEXT, JSONB, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_editor_site_page(TEXT, TEXT) TO anon, authenticated;

-- ─────────────────────────────────────────────────────────
-- 8. Editor allowlist (Auth0 Google → email must be listed)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.editor_allowlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT editor_allowlist_email_unique UNIQUE (email)
);

CREATE OR REPLACE FUNCTION public.normalize_editor_allowlist_email()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.email := lower(trim(NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_editor_allowlist_email ON public.editor_allowlist;
CREATE TRIGGER trg_normalize_editor_allowlist_email
  BEFORE INSERT OR UPDATE OF email ON public.editor_allowlist
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_editor_allowlist_email();

ALTER TABLE public.editor_allowlist ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_editor_email_allowed(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_email IS NULL OR length(trim(p_email)) = 0 THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.editor_allowlist
    WHERE email = lower(trim(p_email))
      AND active = true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_editor_email_allowed(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_editor_email_allowed(TEXT) TO anon, authenticated;

INSERT INTO public.editor_allowlist (email, note)
VALUES
  ('samuel@quadraaudio.com', 'Primary Quadra admin'),
  ('samuelbacaro@gmail.com', 'Owner Google account')
ON CONFLICT (email) DO UPDATE SET active = true;


