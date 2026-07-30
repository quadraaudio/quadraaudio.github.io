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


