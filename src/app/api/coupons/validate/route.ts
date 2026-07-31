import { NextResponse } from "next/server";
import { resolveCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { code?: string };
  const code = (body.code || "").trim();
  if (!code) {
    return NextResponse.json(
      { valid: false, error: "Coupon code is required" },
      { status: 400 }
    );
  }

  const coupon = await resolveCoupon(code);
  if (!coupon) {
    return NextResponse.json(
      { valid: false, error: "Invalid or expired promo code" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount: coupon.discountAmount,
  });
}
