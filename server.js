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
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

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
              },
              required: ["type", "glyph", "name", "color"],
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
        },
        required: ["id", "glyph", "title", "brand", "store", "price", "color", "size", "rating", "match", "delivery"],
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
  res.json({ aiEnabled: HAS_KEY, model: HAS_KEY ? MODEL : null });
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
    res.json({ source: "ai", ...data });
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
  console.log(`Menga Mos ${HAS_KEY ? "(real AI: " + MODEL + ")" : "(mock — ANTHROPIC_API_KEY o'rnatilmagan)"} → http://localhost:${PORT}/`);
});
