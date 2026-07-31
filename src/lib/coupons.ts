import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseBrowser } from "@/lib/supabase";

export type ResolvedCoupon = {
  code: string;
  discountPercent: number;
  discountAmount: number;
};

const PRESET_COUPONS: Record<string, { percent: number; amount: number }> = {
  QUADRA10: { percent: 10, amount: 0 },
  LAUNCH20: { percent: 20, amount: 0 },
  STUDIO50: { percent: 50, amount: 0 },
  FREE100: { percent: 100, amount: 0 },
};

function isExpired(expiresAt: string | null | undefined) {
  if (!expiresAt) return false;
  const ts = Date.parse(expiresAt);
  if (Number.isNaN(ts)) return false;
  return ts < Date.now();
}

/**
 * Single coupon resolver used by validate + create/capture/free checkout.
 */
export async function resolveCoupon(
  code?: string | null
): Promise<ResolvedCoupon | null> {
  if (!code || !code.trim()) return null;
  const raw = code.trim();
  const upper = raw.toUpperCase();

  const client = getSupabaseAdmin() || getSupabaseBrowser();
  if (client) {
    try {
      const { data } = await client
        .from("coupons")
        .select("*")
        .ilike("code", raw)
        .eq("active", true)
        .maybeSingle();

      if (data) {
        if (isExpired(data.expires_at as string | null)) {
          return null;
        }
        return {
          code: String(data.code),
          discountPercent: Number(data.discount_percent || 0),
          discountAmount: Number(data.discount_amount || 0),
        };
      }
    } catch {
      // fall through to presets
    }
  }

  const preset = PRESET_COUPONS[upper];
  if (preset) {
    return {
      code: upper,
      discountPercent: preset.percent,
      discountAmount: preset.amount,
    };
  }

  return null;
}

export function applyCouponToSubtotal(
  subtotal: number,
  coupon: ResolvedCoupon | null
) {
  if (!coupon) return Math.max(0, subtotal);
  const afterPercent = subtotal * (1 - (coupon.discountPercent || 0) / 100);
  return Math.max(0, afterPercent - (coupon.discountAmount || 0));
}
