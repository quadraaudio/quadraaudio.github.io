-- Richer account payload for licenses (seats) and orders (line items / receipt fields).
CREATE OR REPLACE FUNCTION public.get_account_for_auth0(p_secret text, p_auth0_sub text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_expected TEXT;
  v_seats_max INT := 2;
  v_email TEXT;
BEGIN
  SELECT fulfillment_secret INTO v_expected FROM public.store_secrets WHERE id = 1;
  IF v_expected IS NULL OR p_secret IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'unauthorized_fulfillment';
  END IF;

  SELECT lower(email) INTO v_email
  FROM public.profiles
  WHERE auth0_sub = p_auth0_sub
  LIMIT 1;

  IF v_email IS NULL THEN
    SELECT lower(coalesce(email, user_email)) INTO v_email
    FROM public.orders
    WHERE auth0_sub = p_auth0_sub
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  RETURN jsonb_build_object(
    'orders', COALESCE((
      SELECT jsonb_agg(to_jsonb(o) ORDER BY o.created_at DESC)
      FROM (
        SELECT DISTINCT ON (order_number)
          order_number,
          total_amount,
          currency,
          status,
          created_at,
          items,
          coupon_code,
          paypal_order_id
        FROM public.orders
        WHERE auth0_sub = p_auth0_sub
           OR (
             v_email IS NOT NULL
             AND lower(coalesce(email, user_email, '')) = v_email
           )
        ORDER BY order_number, created_at DESC
      ) o
    ), '[]'::jsonb),
    'licenses', COALESCE((
      SELECT jsonb_agg(to_jsonb(l) ORDER BY l.issued_at DESC)
      FROM (
        SELECT DISTINCT ON (lic.id)
          lic.id,
          lic.product_slug,
          lic.status,
          lic.issued_at,
          lic.expires_at,
          ord.order_number,
          v_seats_max AS seats_max,
          (
            SELECT COUNT(*)::int
            FROM public.license_activations act
            WHERE act.license_id = lic.id
          ) AS seats_used,
          COALESCE((
            SELECT jsonb_agg(
              jsonb_build_object(
                'hardware_id', act.hardware_id,
                'activated_at', act.activated_at
              )
              ORDER BY act.activated_at ASC
            )
            FROM public.license_activations act
            WHERE act.license_id = lic.id
          ), '[]'::jsonb) AS activations
        FROM public.licenses lic
        LEFT JOIN public.orders ord ON ord.id = lic.order_id
        WHERE lic.auth0_sub = p_auth0_sub
           OR (
             v_email IS NOT NULL
             AND lower(coalesce(lic.email, lic.user_email, '')) = v_email
           )
        ORDER BY lic.id, lic.issued_at DESC
      ) l
    ), '[]'::jsonb)
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.get_account_for_auth0(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_account_for_auth0(text, text) TO service_role;
