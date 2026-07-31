import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";
import { capturePayPalOrder, paypalConfigured } from "@/lib/paypal";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type CaptureItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
};

function orderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QDA-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  if (!auth0Configured || !auth0) {
    return NextResponse.json({ error: "Auth0 is not configured" }, { status: 503 });
  }
  if (!paypalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
  }

  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    orderID?: string;
    items?: CaptureItem[];
    couponCode?: string;
  };

  if (!body.orderID) {
    return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
  }

  try {
    const capture = await capturePayPalOrder(body.orderID);
    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Unexpected PayPal status: ${capture.status}` },
        { status: 502 }
      );
    }

    const items = body.items || [];
    let total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (body.couponCode) {
      const adminForCoupon = getSupabaseAdmin();
      if (adminForCoupon) {
        const { data: coupon } = await adminForCoupon
          .from("coupons")
          .select("*")
          .ilike("code", body.couponCode)
          .eq("active", true)
          .maybeSingle();
        if (coupon) {
          total =
            total -
            total * (Number(coupon.discount_percent || 0) / 100) -
            Number(coupon.discount_amount || 0);
        }
      }
    }
    total = Math.max(0, total);
    const currency = items[0]?.currency || "USD";
    const email =
      session.user.email ||
      capture.payer?.email_address ||
      "customer@quadraaudio.com";
    const number = orderNumber();

    const admin = getSupabaseAdmin();
    if (admin) {
      await admin.from("profiles").upsert(
        {
          auth0_sub: session.user.sub,
          email,
          name: session.user.name || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "auth0_sub" }
      );

      const { data: orderRow, error: orderError } = await admin
        .from("orders")
        .insert({
          order_number: number,
          auth0_sub: session.user.sub,
          email,
          total_amount: total,
          currency,
          paypal_order_id: capture.id,
          status: "completed",
          items,
          coupon_code: body.couponCode || null,
        })
        .select("id")
        .single();

      if (orderError) {
        return NextResponse.json(
          { error: `Order persist failed: ${orderError.message}` },
          { status: 500 }
        );
      }

      const licenses = items.map((item) => ({
        order_id: orderRow.id,
        product_slug: item.slug,
        email,
        auth0_sub: session.user.sub,
        status: "active",
      }));

      if (licenses.length) {
        const { error: licenseError } = await admin.from("licenses").insert(licenses);
        if (licenseError) {
          return NextResponse.json(
            { error: `License persist failed: ${licenseError.message}` },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      ok: true,
      orderNumber: number,
      paypalStatus: capture.status,
      persisted: Boolean(admin),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal capture failed" },
      { status: 502 }
    );
  }
}
