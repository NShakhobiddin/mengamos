/**
 * Pinduoduo — 多多进宝 (Duoduo Jinbao) client.
 *
 * Turns the AI's product/outfit suggestions into REAL Pinduoduo items:
 * real photo, real price (converted to so'm), and a real shop link.
 *
 * Credential-gated: with no PDD_CLIENT_ID / PDD_CLIENT_SECRET the helpers
 * return null and the app keeps drawing its garment glyphs. Add approved
 * 多多进宝 credentials and real data flows in — no frontend change.
 *
 * Required env:
 *   PDD_CLIENT_ID       开放平台 client_id
 *   PDD_CLIENT_SECRET   开放平台 client_secret
 * Optional env:
 *   PDD_PID             推广位 (promotion position) — needed for affiliate links
 *   PDD_CNY_TO_UZS      CNY→UZS rate (default 1750)
 *   PDD_DELIVERY        delivery label shown in UI (default "2–4 hafta")
 */
const crypto = require("crypto");

const GATEWAY = "https://gw-api.pinduoduo.com/api/router";
const RATE = Number(process.env.PDD_CNY_TO_UZS || 1750);
const DELIVERY = process.env.PDD_DELIVERY || "2–4 hafta";

function enabled() {
  return !!(process.env.PDD_CLIENT_ID && process.env.PDD_CLIENT_SECRET);
}

// 多多进宝 MD5 sign: secret + sorted(k+v) + secret, uppercased.
function sign(params, secret) {
  const keys = Object.keys(params).sort();
  let str = secret;
  for (const k of keys) str += k + params[k];
  str += secret;
  return crypto.createHash("md5").update(str, "utf8").digest("hex").toUpperCase();
}

async function call(type, extra, timeoutMs = 7000) {
  if (!enabled()) return null;
  const params = {
    type,
    client_id: process.env.PDD_CLIENT_ID,
    timestamp: Math.floor(Date.now() / 1000).toString(),
    data_type: "JSON",
    ...extra,
  };
  params.sign = sign(params, process.env.PDD_CLIENT_SECRET);

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(GATEWAY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: new URLSearchParams(params).toString(),
      signal: ctrl.signal,
    });
    const json = await r.json();
    if (json && json.error_response) {
      console.error("[pdd]", type, json.error_response.error_msg || json.error_response);
      return null;
    }
    return json;
  } catch (e) {
    console.error("[pdd]", type, e && e.message);
    return null;
  } finally {
    clearTimeout(t);
  }
}

function uzs(minGroupPriceFen) {
  const yuan = Number(minGroupPriceFen || 0) / 100;
  const som = Math.round((yuan * RATE) / 1000) * 1000; // round to nearest 1000 so'm
  return som.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Search the catalog and return the best-matching normalized item, or null.
async function searchOne(keyword) {
  if (!keyword) return null;
  const resp = await call("pdd.ddk.goods.search", {
    keyword,
    page: "1",
    page_size: "10",
    ...(process.env.PDD_PID ? { pid: process.env.PDD_PID } : {}),
  });
  const list =
    resp &&
    resp.goods_search_response &&
    resp.goods_search_response.goods_list;
  if (!Array.isArray(list) || !list.length) return null;

  // Prefer an item that actually has an image.
  const g = list.find((x) => x.goods_image_url || x.goods_thumbnail_url) || list[0];
  const url = await promoUrl(g);
  return {
    title: g.goods_name,
    image: g.goods_image_url || g.goods_thumbnail_url || null,
    price: uzs(g.min_group_price),
    store: g.mall_name ? g.mall_name : "Pinduoduo",
    rating: g.goods_eval_count ? Math.min(4.9, 4.3 + (g.goods_eval_count > 5000 ? 0.5 : 0.2)) : undefined,
    delivery: DELIVERY,
    url,
  };
}

// Build a clickable link. With a PID we mint a real affiliate URL; otherwise
// fall back to a direct/ search link so the button still goes somewhere real.
async function promoUrl(g) {
  if (process.env.PDD_PID && g.goods_sign) {
    const resp = await call("pdd.ddk.goods.promotion.url.generate", {
      p_id: process.env.PDD_PID,
      goods_sign_list: JSON.stringify([g.goods_sign]),
    });
    const arr =
      resp &&
      resp.goods_promotion_url_generate_response &&
      resp.goods_promotion_url_generate_response.goods_promotion_url_list;
    if (Array.isArray(arr) && arr[0]) {
      return arr[0].mobile_short_url || arr[0].mobile_url || arr[0].short_url || arr[0].url || null;
    }
  }
  if (g.goods_id) return "https://mobile.yangkeduo.com/goods.html?goods_id=" + g.goods_id;
  return "https://mobile.yangkeduo.com/search_result.html?search_key=" + encodeURIComponent(g.goods_name || "");
}

// Run async tasks with limited concurrency (keeps us under rate limits).
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

/**
 * Enrich the AI result IN PLACE with real Pinduoduo images / prices / links.
 * Every step is fail-safe: anything that doesn't resolve keeps the AI/glyph
 * fallback, so the screen always renders.
 */
async function enrich(data, opts = {}) {
  if (!enabled()) return data;
  const overallMs = opts.timeoutMs || 25000;

  const run = (async () => {
    // Products — the main shopping result.
    if (Array.isArray(data.products)) {
      await mapLimit(data.products, 4, async (p) => {
        const hit = await searchOne(p.query || `${p.title} ${p.color || ""}`.trim());
        if (hit) {
          p.image = hit.image || p.image;
          p.url = hit.url || p.url;
          p.price = hit.price || p.price;
          p.store = hit.store || p.store;
          if (hit.rating) p.rating = hit.rating;
          p.delivery = hit.delivery || p.delivery;
        }
      });
    }
    // Outfits — real photo per garment + a hero image for the card.
    if (Array.isArray(data.outfits)) {
      for (const o of data.outfits) {
        if (!Array.isArray(o.items)) continue;
        await mapLimit(o.items, 3, async (it) => {
          const hit = await searchOne(it.query || `${it.name} ${it.color || ""}`.trim());
          if (hit) {
            it.image = hit.image || it.image;
            it.url = hit.url || it.url;
          }
        });
        const hero = o.items.find((x) => x.glyph === o.glyph && x.image) || o.items.find((x) => x.image);
        if (hero) o.image = hero.image;
      }
    }
  })();

  // Never let enrichment hang the whole request.
  await Promise.race([run, new Promise((res) => setTimeout(res, overallMs))]);
  return data;
}

module.exports = { enabled, enrich, searchOne };
