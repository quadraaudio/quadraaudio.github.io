-- ─────────────────────────────────────────────────────────
-- Quadra Audio — Supabase SQL Database Schema
-- Domain: quadraaudio.com
-- Paste this script into Supabase Dashboard -> SQL Editor
-- ─────────────────────────────────────────────────────────

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'software',
  badge TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Licenses Table
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

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) for Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);

-- Allow authenticated users to view their own licenses
CREATE POLICY "Users read own licenses" ON public.licenses FOR SELECT USING (true);

-- 5. Insert Initial Quadra Audio Products
INSERT INTO public.products (slug, name, tagline, description, price, category, badge, available)
VALUES 
  ('hydra', 'Hydra', 'Sound thinking. Boundless routing.', 'The ultimate virtual soundcard, AoIP network matrix, and spatial audio monitor controller for macOS.', 199.99, 'software', 'Virtual Audio Matrix', true),
  ('hydra-pro', 'Hydra Pro', 'Pure spatial audio matrix routing.', 'The premier 128-channel virtual audio router engineered for macOS.', 199.99, 'software', 'New Software', true),
  ('quadra-core-io', 'Quadra Core I/O', 'Studio Thunderbolt audio interface.', 'Hardware companion rack for Hydra Pro with 32-bit float AD/DA converters.', 0, 'hardware', 'Coming Soon', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  badge = EXCLUDED.badge,
  available = EXCLUDED.available;
