import { getSupabaseBrowser } from "@/lib/supabase";

export type ResolvedCoupon = {
  code: string;
  discountPercent: number;
  discountAmount: number;
};

function isExpired(expiresAt: string | null | undefined) {
  if (!expiresAt) return false;
  const ts = Date.parse(expiresAt);
  if (Number.isNaN(ts)) return false;
  return ts < Date.now();
}

/**
 * Resolve an active coupon from Supabase `coupons` (anon-readable RLS).
 * Codes are matched case-insensitively. No hardcoded presets.
 */
export async function resolveCoupon(
  code?: string | null
): Promise<ResolvedCoupon | null> {
  if (!code || !code.trim()) return null;
  const upper = code.trim().toUpperCase();

  const client = getSupabaseBrowser();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("coupons")
      .select("code, discount_percent, discount_amount, active, expires_at")
      .ilike("code", upper)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;
    if (isExpired(data.expires_at as string | null)) return null;

    return {
      code: String(data.code).toUpperCase(),
      discountPercent: Number(data.discount_percent || 0),
      discountAmount: Number(data.discount_amount || 0),
    };
  } catch {
    return null;
  }
}

export function applyCouponToSubtotal(
  subtotal: number,
  coupon: ResolvedCoupon | null
) {
  if (!coupon) return Math.max(0, subtotal);
  const afterPercent = subtotal * (1 - (coupon.discountPercent || 0) / 100);
  return Math.max(0, afterPercent - (coupon.discountAmount || 0));
}
