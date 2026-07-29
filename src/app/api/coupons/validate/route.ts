import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://accvrbqjndibljfpsspc.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4o9Wc4iUQQ_foOStyozkhw_DafU6VmL";
const supabase = createClient(supabaseUrl, supabaseKey);

// Preset coupons fallback if DB coupons table is empty
const DEFAULT_COUPONS: Record<string, { percent: number; amount: number }> = {
  QUADRA10: { percent: 10, amount: 0 },
  LAUNCH20: { percent: 20, amount: 0 },
  STUDIO50: { percent: 50, amount: 0 },
  HYDRA100: { percent: 100, amount: 0 },
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "Coupon code is required" }, { status: 400 });
    }

    const rawCode = code.trim();
    const upperCode = rawCode.toUpperCase();

    // 1. Try Supabase coupons table (case-insensitive search via ilike)
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .ilike("code", rawCode)
        .eq("active", true);

      if (!error && data && data.length > 0) {
        const c = data[0];
        return NextResponse.json({
          valid: true,
          code: c.code,
          discountPercent: c.discount_percent || 0,
          discountAmount: c.discount_amount || 0,
        });
      }
    } catch (err) {
      console.warn("Supabase coupon lookup fallback:", err);
    }

    // 2. Check preset fallback coupons (case-insensitive)
    if (DEFAULT_COUPONS[upperCode]) {
      const preset = DEFAULT_COUPONS[upperCode];
      return NextResponse.json({
        valid: true,
        code: upperCode,
        discountPercent: preset.percent,
        discountAmount: preset.amount,
      });
    }

    return NextResponse.json({ valid: false, error: "Invalid or expired promo code" });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
