import { formatPrice } from "@/lib/products";
import {
  formatAccountDate,
  orderDiscount,
  orderGross,
  type AccountOrder,
} from "@/lib/accountTypes";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build a printable receipt HTML document for an account order. */
export function buildOrderInvoiceHtml(order: AccountOrder, buyerEmail?: string | null) {
  const currency = order.currency || "USD";
  const items = order.items || [];
  const gross = orderGross(order);
  const discount = orderDiscount(order);
  const paid = Number(order.total_amount) || 0;
  const tax = 0;

  const rows = items.length
    ? items
        .map((item) => {
          const qty = Number(item.quantity) || 1;
          const unit = Number(item.unitPrice) || 0;
          const line = unit * qty;
          return `<tr>
            <td>${escapeHtml(item.name || item.slug)}</td>
            <td>${qty}</td>
            <td>${escapeHtml(formatPrice(unit, item.currency || currency))}</td>
            <td>${escapeHtml(formatPrice(line, item.currency || currency))}</td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="4">No line items on file</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(order.order_number)} — Quadra Audio</title>
  <style>
    body { font-family: Manrope, "Avenir Next", "Segoe UI", sans-serif; color: #15202b; margin: 2.5rem; line-height: 1.45; }
    h1 { font-size: 1.6rem; margin: 0 0 0.25rem; letter-spacing: -0.02em; font-weight: 700; }
    .muted { color: #5a6570; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { text-align: left; padding: 0.55rem 0.4rem; border-bottom: 1px solid #d7dde5; }
    th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #5a6570; }
    .totals { width: min(100%, 280px); margin-left: auto; }
    .totals td { border: 0; padding: 0.3rem 0; }
    .totals .grand { font-weight: 700; font-size: 1.05rem; padding-top: 0.6rem; }
    .foot { margin-top: 2rem; font-size: 0.9rem; color: #5a6570; }
    @media print { body { margin: 1rem; } }
  </style>
</head>
<body>
  <h1>Quadra Audio</h1>
  <p class="muted">Invoice / receipt</p>
  <p>
    <strong>Order</strong> ${escapeHtml(order.order_number)}<br />
    <strong>Date</strong> ${escapeHtml(formatAccountDate(order.created_at))}<br />
    <strong>Status</strong> ${escapeHtml(order.status)}
    ${buyerEmail ? `<br /><strong>Billed to</strong> ${escapeHtml(buyerEmail)}` : ""}
  </p>
  <table>
    <thead>
      <tr><th>Item</th><th>Qty</th><th>Unit</th><th>Amount</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <table class="totals">
    <tr><td>Subtotal</td><td>${escapeHtml(formatPrice(gross, currency))}</td></tr>
    ${
      discount > 0
        ? `<tr><td>Discount${
            order.coupon_code ? ` (${escapeHtml(order.coupon_code)})` : ""
          }</td><td>−${escapeHtml(formatPrice(discount, currency))}</td></tr>`
        : ""
    }
    <tr><td>Tax</td><td>${escapeHtml(formatPrice(tax, currency))}</td></tr>
    <tr class="grand"><td>Total paid</td><td>${escapeHtml(formatPrice(paid, currency))}</td></tr>
  </table>
  <p class="foot">
    Tax was not itemized separately for this digital purchase
    ${
      order.paypal_order_id
        ? ` · PayPal reference ${escapeHtml(order.paypal_order_id)}`
        : order.coupon_code
          ? ` · Fulfilled with coupon ${escapeHtml(order.coupon_code)}`
          : ""
    }.
    Questions: support@quadraaudio.com
  </p>
</body>
</html>`;
}

export function downloadOrderInvoice(order: AccountOrder, buyerEmail?: string | null) {
  const html = buildOrderInvoiceHtml(order, buyerEmail);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quadra-invoice-${order.order_number}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
