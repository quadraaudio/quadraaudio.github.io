-- Remove unused visual-editor artifacts (no app references).
DROP FUNCTION IF EXISTS public.create_editor_page(text, text, text);
DROP FUNCTION IF EXISTS public.get_editor_site_page(text, text);
DROP FUNCTION IF EXISTS public.list_editor_pages(text);
DROP FUNCTION IF EXISTS public.publish_site_page(text, text, jsonb, text, text);

DROP TABLE IF EXISTS public.site_pages CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.site_editor_settings CASCADE;

-- Remove leftover Supabase Auth artifacts. Auth is Google GIS only; do not reintroduce.
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();
-- Keep public.rls_auto_enable — owned by event trigger ensure_rls.

-- Fulfillment without secret is obsolete; edge functions use fulfill_store_order_auth0
-- (name is historical — callers pass Google subject id, not Auth0).
DROP FUNCTION IF EXISTS public.fulfill_store_order(text, text, text, numeric, text, text, text, text, jsonb);

-- Deduplicate coupon read policies.
DROP POLICY IF EXISTS "Allow read active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public active coupons read" ON public.coupons;
CREATE POLICY "Public active coupons read" ON public.coupons
  FOR SELECT
  TO anon, authenticated
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Keep coupon catalog aligned with live store codes.
INSERT INTO public.coupons (code, discount_percent, discount_amount, active)
VALUES
  ('FREE100', 100, 0, true),
  ('VIP100', 100, 0, true),
  ('SPECIAL50', 50, 0, true),
  ('STUDIO20', 20, 0, true)
ON CONFLICT (code) DO UPDATE SET
  discount_percent = EXCLUDED.discount_percent,
  discount_amount = EXCLUDED.discount_amount,
  active = true;

-- Remove obsolete preset codes that are not in the live catalog.
DELETE FROM public.coupons
WHERE code IN ('QUADRA10', 'LAUNCH20', 'STUDIO50');

-- Harden: secret-gated RPCs should not be callable by anon/authenticated via PostgREST.
-- Edge functions use the service role key.
REVOKE ALL ON FUNCTION public.fulfill_store_order_auth0(text, text, text, text, text, numeric, text, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_account_for_auth0(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fulfill_store_order_auth0(text, text, text, text, text, numeric, text, text, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_account_for_auth0(text, text) TO service_role;
