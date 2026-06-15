/**
 * To'lov — Payme & Click checkout havolalarini yaratish.
 *
 * Merchant ma'lumotlari berilsa real to'lov sahifasiga yo'naltiradi; berilmasa
 * null qaytaradi va ilova demo (mock) muvaffaqiyat ekraniga o'tadi.
 *
 * Env:
 *   PAYME_MERCHANT_ID    Payme kassa (merchant) ID
 *   PAYME_ORDER_FIELD    ac.<field> nomi (default "order_id")
 *   CLICK_SERVICE_ID     Click service_id
 *   CLICK_MERCHANT_ID    Click merchant_id
 */

// "79 000" -> 79000
function digits(s) {
  return parseInt(String(s == null ? "" : s).replace(/\D/g, ""), 10) || 0;
}

// Payme Checkout: base64(m=...;ac.field=order;a=tiyin;c=return;l=uz)
function paymeUrl({ amountSom, orderId, returnUrl }) {
  const mid = process.env.PAYME_MERCHANT_ID;
  if (!mid || !amountSom) return null;
  const field = process.env.PAYME_ORDER_FIELD || "order_id";
  const parts = [`m=${mid}`, `ac.${field}=${orderId}`, `a=${amountSom * 100}`];
  if (returnUrl) parts.push(`c=${returnUrl}`);
  parts.push("l=uz");
  return "https://checkout.paycom.uz/" + Buffer.from(parts.join(";")).toString("base64");
}

// Click redirect checkout.
function clickUrl({ amountSom, orderId, returnUrl }) {
  const sid = process.env.CLICK_SERVICE_ID;
  const mid = process.env.CLICK_MERCHANT_ID;
  if (!sid || !mid || !amountSom) return null;
  const u = new URL("https://my.click.uz/services/pay");
  u.searchParams.set("service_id", sid);
  u.searchParams.set("merchant_id", mid);
  u.searchParams.set("amount", String(amountSom));
  u.searchParams.set("transaction_param", orderId);
  if (returnUrl) u.searchParams.set("return_url", returnUrl);
  return u.toString();
}

function build(method, amountSom, orderId, returnUrl) {
  const o = { amountSom, orderId, returnUrl };
  if (method === "payme") return paymeUrl(o);
  if (method === "click") return clickUrl(o);
  return null; // Uzum va boshqalar hozircha sozlanmagan
}

function enabled() {
  return !!(process.env.PAYME_MERCHANT_ID || (process.env.CLICK_SERVICE_ID && process.env.CLICK_MERCHANT_ID));
}

module.exports = { build, digits, enabled };
