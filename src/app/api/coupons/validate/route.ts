import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseBrowser } from "@/lib/supabase";

const PRESET: Record<string, { percent: number; amount: number }> = {
  QUADRA10: { percent: 10, amount: 0 },
  LAUNCH20: { percent: 20, amount: 0 },
  STUDIO50: { percent: 50, amount: 0 },
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { code?: string };
  const code = (body.code || "").trim();
  if (!code) {
    return NextResponse.json({ valid: false, error: "Coupon code is required" }, { status: 400 });
  }

  const client = getSupabaseAdmin() || getSupabaseBrowser();
  if (client) {
    try {
      const { data } = await client
        .from("coupons")
        .select("*")
        .ilike("code", code)
        .eq("active", true)
        .maybeSingle();

      if (data) {
        return NextResponse.json({
          valid: true,
          code: data.code,
          discountPercent: Number(data.discount_percent || 0),
          discountAmount: Number(data.discount_amount || 0),
        });
      }
    } catch {
      // fall through to presets
    }
  }

  const preset = PRESET[code.toUpperCase()];
  if (preset) {
    return NextResponse.json({
      valid: true,
      code: code.toUpperCase(),
      discountPercent: preset.percent,
      discountAmount: preset.amount,
    });
  }

  return NextResponse.json({ valid: false, error: "Invalid or expired promo code" }, { status: 404 });
}
