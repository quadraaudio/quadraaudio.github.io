import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/data/products.seed";
import {
  applyCouponToSubtotal,
  resolveCoupon,
  type ResolvedCoupon,
} from "@/lib/coupons";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type CartLineInput = { slug: string; quantity: number };

export type PricedLine = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  product: Product;
};

export type PricedOrder = {
  lines: PricedLine[];
  currency: string;
  gross: number;
  total: number;
  coupon: ResolvedCoupon | null;
};

export function makeOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QDA-${stamp}-${rand}`;
}

export async function priceCart(params: {
  items: CartLineInput[];
  couponCode?: string | null;
}): Promise<{ ok: true; order: PricedOrder } | { ok: false; error: string }> {
  if (!params.items?.length) {
    return { ok: false, error: "Bag is empty" };
  }

  const lines: PricedLine[] = [];
  for (const line of params.items) {
    const product = await getProductBySlug(line.slug);
    if (!product || product.availabilityStatus !== "available") {
      return { ok: false, error: `Product unavailable: ${line.slug}` };
    }
    const quantity = Math.max(1, Number(line.quantity) || 1);
    lines.push({
      slug: product.slug,
      name: product.name,
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
      currency: product.currency,
      product,
    });
  }

  const gross = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const coupon = await resolveCoupon(params.couponCode);
  const total = Number(applyCouponToSubtotal(gross, coupon).toFixed(2));
  const currency = lines[0]?.currency || "USD";

  return {
    ok: true,
    order: { lines, currency, gross, total, coupon },
  };
}

export type PersistOrderInput = {
  auth0Sub: string;
  email: string;
  name?: string | null;
  priced: PricedOrder;
  paypalOrderId?: string | null;
  status?: string;
};

export type PersistOrderResult =
  | { ok: true; orderNumber: string; orderId: string }
  | {
      ok: false;
      code: "admin_missing" | "persist_failed";
      error: string;
      orderNumber?: string;
    };

export async function persistCompletedOrder(
  input: PersistOrderInput
): Promise<PersistOrderResult> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      code: "admin_missing",
      error:
        "Order fulfillment is unavailable (missing SUPABASE_SERVICE_ROLE_KEY).",
    };
  }

  const orderNumber = makeOrderNumber();
  const itemsPayload = input.priced.lines.map((line) => ({
    slug: line.slug,
    name: line.name,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    currency: line.currency,
  }));

  try {
    await admin.from("profiles").upsert(
      {
        auth0_sub: input.auth0Sub,
        email: input.email,
        name: input.name || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "auth0_sub" }
    );

    const { data: orderRow, error: orderError } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        auth0_sub: input.auth0Sub,
        email: input.email,
        total_amount: input.priced.total,
        currency: input.priced.currency,
        paypal_order_id: input.paypalOrderId || null,
        status: input.status || "completed",
        items: itemsPayload,
        coupon_code: input.priced.coupon?.code || null,
      })
      .select("id")
      .single();

    if (orderError || !orderRow) {
      return {
        ok: false,
        code: "persist_failed",
        error: orderError?.message || "Order insert failed",
        orderNumber,
      };
    }

    const licenses = input.priced.lines.map((line) => ({
      order_id: orderRow.id,
      product_slug: line.slug,
      email: input.email,
      auth0_sub: input.auth0Sub,
      status: "active",
    }));

    if (licenses.length) {
      const { error: licenseError } = await admin.from("licenses").insert(licenses);
      if (licenseError) {
        return {
          ok: false,
          code: "persist_failed",
          error: licenseError.message,
          orderNumber,
        };
      }
    }

    return { ok: true, orderNumber, orderId: orderRow.id as string };
  } catch (error) {
    return {
      ok: false,
      code: "persist_failed",
      error: error instanceof Error ? error.message : "Persist failed",
      orderNumber,
    };
  }
}

/** Build PayPal unit amounts that sum exactly to total. */
export function buildPayPalUnits(priced: PricedOrder) {
  if (priced.gross <= 0) return [];
  const ratio = priced.total / priced.gross;
  return priced.lines.map((line, index) => {
    const isLast = index === priced.lines.length - 1;
    if (isLast) {
      const prior = priced.lines.slice(0, -1).reduce((sum, entry) => {
        return sum + Number((entry.unitPrice * ratio).toFixed(2)) * entry.quantity;
      }, 0);
      const remaining = Number((priced.total - prior).toFixed(2));
      const unit = Number((remaining / line.quantity).toFixed(2));
      return {
        name: line.name,
        sku: line.slug,
        quantity: String(line.quantity),
        unitAmount: unit.toFixed(2),
      };
    }
    return {
      name: line.name,
      sku: line.slug,
      quantity: String(line.quantity),
      unitAmount: (line.unitPrice * ratio).toFixed(2),
    };
  });
}
