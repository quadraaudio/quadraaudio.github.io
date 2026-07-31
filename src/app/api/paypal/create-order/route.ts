import { NextResponse } from "next/server";
import { auth0, auth0Configured } from "@/lib/auth0";
import { createPayPalOrder, paypalConfigured } from "@/lib/paypal";
import { getProductBySlug } from "@/lib/products";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseBrowser } from "@/lib/supabase";
import type { Product } from "@/data/products.seed";

type CartLine = { slug: string; quantity: number };
type DetailedLine = { product: Product; quantity: number };

async function resolveCoupon(code?: string) {
  if (!code) return null;
  const client = getSupabaseAdmin() || getSupabaseBrowser();
  if (client) {
    const { data } = await client
      .from("coupons")
      .select("*")
      .ilike("code", code)
      .eq("active", true)
      .maybeSingle();
    if (data) {
      return {
        code: data.code as string,
        discountPercent: Number(data.discount_percent || 0),
        discountAmount: Number(data.discount_amount || 0),
      };
    }
  }
  return null;
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
    items?: CartLine[];
    couponCode?: string;
  };

  const lines = body.items || [];
  if (!lines.length) {
    return NextResponse.json({ error: "Bag is empty" }, { status: 400 });
  }

  const detailed: DetailedLine[] = [];
  for (const line of lines) {
    const product = await getProductBySlug(line.slug);
    if (!product || product.availabilityStatus !== "available") {
      return NextResponse.json(
        { error: `Product unavailable: ${line.slug}` },
        { status: 400 }
      );
    }
    detailed.push({
      product,
      quantity: Math.max(1, Number(line.quantity) || 1),
    });
  }

  let subtotal = detailed.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  const coupon = await resolveCoupon(body.couponCode);
  if (coupon) {
    subtotal =
      subtotal -
      subtotal * (coupon.discountPercent / 100) -
      coupon.discountAmount;
  }
  const gross = detailed.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const amountNumber = Math.max(0, subtotal);
  const amount = amountNumber.toFixed(2);
  const currency = detailed[0]?.product.currency || "USD";

  if (amountNumber <= 0) {
    return NextResponse.json(
      {
        error:
          "Zero-total checkouts are not supported with PayPal in this build. Use a partial discount.",
      },
      { status: 400 }
    );
  }

  const ratio = amountNumber / gross;
  const paypalItems = detailed.map((line, index) => {
    const isLast = index === detailed.length - 1;
    if (isLast) {
      const prior = detailed.slice(0, -1).reduce((sum, entry) => {
        return sum + Number((entry.product.price * ratio).toFixed(2)) * entry.quantity;
      }, 0);
      const remaining = Number((amountNumber - prior).toFixed(2));
      const unit = Number((remaining / line.quantity).toFixed(2));
      return {
        name: line.product.name,
        sku: line.product.slug,
        quantity: String(line.quantity),
        unitAmount: unit.toFixed(2),
      };
    }
    return {
      name: line.product.name,
      sku: line.product.slug,
      quantity: String(line.quantity),
      unitAmount: (line.product.price * ratio).toFixed(2),
    };
  });

  try {
    const order = await createPayPalOrder({
      amount,
      currency,
      customId: session.user.sub,
      items: paypalItems,
    });

    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal create failed" },
      { status: 502 }
    );
  }
}
