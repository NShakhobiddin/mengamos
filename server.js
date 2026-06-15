/**
 * Menga Mos — server
 *
 * Serves the static prototype AND a real AI analysis endpoint that uses
 * Claude vision to turn an uploaded photo + the user's answers into a real
 * style profile, outfits, and product suggestions.
 *
 * The endpoint degrades gracefully: with no ANTHROPIC_API_KEY set it returns
 * `{ source: "mock" }` and the frontend keeps its built-in sample data, so the
 * prototype works locally with zero configuration. The moment a key is present
 * the same flow returns real AI results — no frontend change required.
 */
const path = require("path");
const fs = require("fs");

// Minimal .env loader (no dependency) so keys can live in a gitignored .env.
try {
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const pdd = require("./pdd");
const pay = require("./pay");
const tryon = require("./tryon");

const app = express();
const PORT = process.env.PORT || 8000;
const HAS_KEY = !!process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.MENGA_MODEL || "claude-opus-4-8";

// Photos arrive as base64 data URLs, so allow a generous JSON body.
app.use(express.json({ limit: "12mb" }));

const client = HAS_KEY ? new Anthropic() : null; // reads ANTHROPIC_API_KEY from env

// Garment glyph keys the UI knows how to draw.
const GLYPHS = ["shirt", "trousers", "jacket", "shoes", "knit", "coat", "tshirt", "bag", "dress"];

// JSON schema that mirrors the shapes the UI renders (window.PROFILE/OUTFITS/PRODUCTS).
const colorList = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string", description: "Rang nomi o'zbekcha, masalan 'Navy', 'Bej'" },
      hex: { type: "string", description: "Hex rang kodi, masalan '#27324F'" },
    },
    required: ["name", "hex"],
  },
};

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    profile: {
      type: "object",
      additionalProperties: false,
      properties: {
        vibe: { type: "array", items: { type: "string" }, description: "2-3 ta qisqa stil tegi" },
        description: { type: "string", description: "Stil xulosasi, 2-3 jumla, o'zbekcha" },
        best: colorList,
        accent: colorList,
        avoid: colorList,
        silhouettes: { type: "array", items: { type: "string" }, description: "3 ta mos sil- uet" },
      },
      required: ["vibe", "description", "best", "accent", "avoid", "silhouettes"],
    },
    outfits: {
      type: "array",
      description: "Aniq 3 ta obraz",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          occasion: { type: "string" },
          price: { type: "string", description: "Taxminiy umumiy narx so'mda, masalan '1 240 000'" },
          glyph: { type: "string", enum: GLYPHS },
          accent: { type: "boolean" },
          why: { type: "string", description: "Nega mos kelishi, 1 jumla" },
          items: {
            type: "array",
            description: "3-4 ta kiyim",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                type: { type: "string", description: "Kiyim turi, masalan 'Ko'ylak'" },
                glyph: { type: "string", enum: GLYPHS },
                name: { type: "string" },
                color: { type: "string" },
                query: { type: "string", description: "Pinduoduo qidiruvi uchun qisqa XITOYCHA kalit so'z (rang + tur + stil), masalan '白色 oversize 衬衫'" },
              },
              required: ["type", "glyph", "name", "color", "query"],
            },
          },
        },
        required: ["id", "name", "occasion", "price", "glyph", "accent", "why", "items"],
      },
    },
    products: {
      type: "array",
      description: "Aniq 4 ta mahsulot",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          glyph: { type: "string", enum: GLYPHS },
          title: { type: "string" },
          brand: { type: "string" },
          store: { type: "string", description: "Trendyol, Uzum yoki SHEIN" },
          price: { type: "string", description: "Narx so'mda, masalan '389 000'" },
          color: { type: "string" },
          size: { type: "string" },
          rating: { type: "number", description: "4.0 dan 4.9 gacha" },
          match: { type: "integer", description: "O'xshashlik balli 80-97" },
          delivery: { type: "string", description: "Masalan '5-7 kun'" },
          query: { type: "string", description: "Pinduoduo qidiruvi uchun qisqa XITOYCHA kalit so'z (rang + tur + stil), masalan '米色 chino 长裤'" },
        },
        required: ["id", "glyph", "title", "brand", "store", "price", "color", "size", "rating", "match", "delivery", "query"],
      },
    },
  },
  required: ["profile", "outfits", "products"],
};

const SYSTEM = `Sen "Menga Mos" — O'zbekiston foydalanuvchilari uchun professional AI shaxsiy stilist.
Foydalanuvchining rasmini (agar berilgan bo'lsa) va anketadagi javoblarini tahlil qilib, unga MOS keladigan:
- stil profili (vibe teglari, rang palitrasi, mos siluetlar),
- aniq 3 ta to'liq obraz,
- aniq 4 ta real mahsulot tavsiyasi
yaratasan.

Qoidalar:
- Barcha matn O'ZBEK tilida (lotin), tabiiy va premium ohangda.
- Rasm berilsa: teri/soch rangi, yuz va tana proporsiyasiga ko'ra mos ranglarni tanla. Rasm bo'lmasa anketaga tayan.
- Ranglar uchun aniq hex kodlar ber.
- Narxlar foydalanuvchi byudjetiga mos bo'lsin (so'mda).
- "glyph" maydoni faqat ruxsat etilgan ro'yxatdan bo'lsin.
- Har bir mahsulot va kiyim uchun "query" — Pinduoduo'da qidirish uchun aniq, qisqa XITOYCHA kalit so'z (rang + kiyim turi + stil) ber. Real mahsulot shu orqali topiladi.
- Do'konlar: Trendyol, Uzum yoki SHEIN. Brendlar realistik (COS, Mango, Zara, Massimo Dutti, LC Waikiki va h.k.).
- Iltimoslar (extras) hisobga olinsin: yopiqroq kiyim, qulaylik, brend muhimligi va h.k.
Faqat berilgan JSON sxemasiga mos javob qaytar.`;

function labelFromId(list, id) {
  const found = (list || []).find((x) => x.id === id);
  return found ? found.label : id;
}

// Mirror the frontend mock catalogs so the prompt can reference human labels.
const OCCASIONS = { kundalik: "Kundalik", ish: "Ish / ofis", univ: "Universitet", uchrashuv: "Uchrashuv", toy: "To'y / ziyofat", restoran: "Restoran", sayohat: "Sayohat", meeting: "Biznes meeting", random: "Random obraz", ozim: "O'zim" };
const STYLES = { casual: "Casual", smart: "Smart casual", business: "Business", street: "Streetwear", oldmoney: "Old money", minimal: "Minimal", sport: "Sport", luxury: "Luxury", toy: "To'y / ziyofat", ai: "AI tanlasin" };
const BUDGETS = { arzon: "Arzon (200–500 ming)", ortacha: "O'rtacha (500 ming–1.5 mln)", premium: "Premium (1.5–4 mln)", luxury: "Luxury (4 mln+)", ozim: "Maxsus summa" };
const EXTRAS = { aksessuar: "Aksessuar qo'shilsin", qulay: "Faqat qulay kiyimlar", noyorqin: "Juda yorqin ranglar bo'lmasin", brend: "Brend muhim", narx: "Narx muhim", yopiq: "Yopiqroq kiyim", trend: "Trenddagi kiyimlar", zamonaviy: "Zamonaviyroq vibe" };

function buildUserText(body) {
  const s = body.survey || {};
  const extras = Object.entries(body.extras || {})
    .filter(([, v]) => v)
    .map(([k]) => EXTRAS[k] || k);
  const lines = [
    body.image ? "Rasm berilgan — uni tahlil qil." : "Rasm berilmagan — anketaga tayan.",
    `Vaziyat: ${OCCASIONS[body.occasion] || body.customOccasion || "ko'rsatilmagan"}`,
    `Stil: ${STYLES[body.style] || "AI tanlasin"}`,
    `Byudjet: ${BUDGETS[body.budget] || body.customBudget || "o'rtacha"}`,
    `Jins: ${s.gender || "—"}, Yosh: ${s.age || "—"}, Bo'y: ${s.height || "—"}, Razmer: ${s.size || "—"}, Oyoq: ${s.shoe || "—"}`,
    `Teri rangi: ${s.skin || "—"}, Soch rangi: ${s.hair || "—"}, Kiyim ochiqligi: ${s.cover || "—"}`,
    extras.length ? `Qo'shimcha iltimoslar: ${extras.join(", ")}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

function imageBlockFromDataUrl(dataUrl) {
  const m = /^data:(image\/(png|jpeg|jpg|webp|gif));base64,(.+)$/i.exec(dataUrl || "");
  if (!m) return null;
  let mediaType = m[1].toLowerCase();
  if (mediaType === "image/jpg") mediaType = "image/jpeg";
  return { type: "image", source: { type: "base64", media_type: mediaType, data: m[3] } };
}

app.get("/api/config", (req, res) => {
  res.json({
    aiEnabled: HAS_KEY,
    model: HAS_KEY ? MODEL : null,
    pddEnabled: pdd.enabled(),
    payEnabled: pay.enabled(),
    tryonEnabled: tryon.enabled(),
  });
});

// Create a real Payme/Click checkout link (or signal demo mode).
app.post("/api/pay", (req, res) => {
  const body = req.body || {};
  const method = body.method || "payme";
  const amountSom = pay.digits(body.amount);
  const orderId = body.orderId || "mm-" + Date.now();
  const base = process.env.APP_BASE_URL || req.protocol + "://" + req.get("host");
  const url = pay.build(method, amountSom, orderId, base + "/?paid=" + orderId);
  res.json({ url: url || null, orderId, mock: !url });
});

// Virtual try-on: put the outfit garment on the user's uploaded photo.
app.post("/api/tryon", async (req, res) => {
  if (!tryon.enabled()) return res.json({ url: null, reason: "disabled" });
  try {
    const b = req.body || {};
    const url = await tryon.generate({ human: b.human, garment: b.garment, prompt: b.prompt });
    res.json({ url: url || null });
  } catch (err) {
    console.error("[tryon] error:", err && err.message);
    res.json({ url: null, error: String(err && err.message) });
  }
});

app.post("/api/analyze", async (req, res) => {
  if (!client) {
    return res.json({ source: "mock", reason: "no_api_key" });
  }
  try {
    const body = req.body || {};
    const content = [];
    const img = imageBlockFromDataUrl(body.image);
    if (img) content.push(img);
    content.push({ type: "text", text: buildUserText(body) });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: ANALYSIS_SCHEMA },
      },
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) throw new Error("No text block in response");
    const data = JSON.parse(textBlock.text);

    // Turn the suggestions into real Pinduoduo items (image/price/link) when
    // 多多进宝 credentials are present; otherwise leave the AI data as-is.
    if (pdd.enabled()) {
      try { await pdd.enrich(data); } catch (e) { console.error("[analyze] pdd enrich:", e && e.message); }
    }

    res.json({ source: "ai", products_real: pdd.enabled(), ...data });
  } catch (err) {
    console.error("[analyze] falling back to mock:", err && err.message);
    res.json({ source: "mock", error: String(err && err.message) });
  }
});

// Browsers auto-request /favicon.ico — point it at our SVG mark.
app.get("/favicon.ico", (req, res) => res.redirect(301, "/favicon.svg"));

// Static prototype (index.html, jsx, css, vendored libs, fonts).
app.use(express.static(__dirname, { extensions: ["html"] }));

app.listen(PORT, () => {
  const on = (b) => (b ? "✓" : "✗");
  console.log(
    `Menga Mos → http://localhost:${PORT}/  ` +
    `[AI ${on(HAS_KEY)}] [Pinduoduo ${on(pdd.enabled())}] [To'lov ${on(pay.enabled())}] [Try-on ${on(tryon.enabled())}]`
  );
});
