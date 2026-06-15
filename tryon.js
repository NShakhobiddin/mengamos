/**
 * Try-on — foydalanuvchining rasmiga kiyimni kiygizish (virtual try-on).
 *
 * Replicate'dagi try-on modeli (default IDM-VTON) orqali ishlaydi: human =
 * yuklangan rasm (data URL), garment = Pinduoduo mahsulot rasmi (URL).
 * REPLICATE_API_TOKEN bo'lmasa null qaytaradi va ekran oddiy rasmni ko'rsatadi.
 *
 * Env:
 *   REPLICATE_API_TOKEN     Replicate API tokeni
 *   REPLICATE_TRYON_MODEL   model slug (default "cuuupid/idm-vton")
 *   REPLICATE_HUMAN_FIELD   inson rasmi maydon nomi (default "human_img")
 *   REPLICATE_GARMENT_FIELD kiyim rasmi maydon nomi (default "garment_img")
 *   REPLICATE_TIMEOUT_MS    kutish limiti (default 70000)
 */

function enabled() {
  return !!process.env.REPLICATE_API_TOKEN;
}

async function generate({ human, garment }) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token || !human || !garment) return null;

  const model = process.env.REPLICATE_TRYON_MODEL || "cuuupid/idm-vton";
  const humanField = process.env.REPLICATE_HUMAN_FIELD || "human_img";
  const garmentField = process.env.REPLICATE_GARMENT_FIELD || "garment_img";
  const deadline = Date.now() + (Number(process.env.REPLICATE_TIMEOUT_MS) || 70000);

  const input = { [humanField]: human, [garmentField]: garment };
  // Model endpoint uses the latest version; Prefer: wait holds for the result.
  let pred = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({ input }),
  }).then((r) => r.json());

  if (pred && pred.error) {
    console.error("[tryon]", pred.error);
    return null;
  }
  // Backup polling if it wasn't finished synchronously.
  while (pred && (pred.status === "starting" || pred.status === "processing") && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    pred = await fetch(pred.urls.get, { headers: { Authorization: "Bearer " + token } }).then((r) => r.json());
  }

  if (pred && pred.status === "succeeded") {
    const out = Array.isArray(pred.output) ? pred.output[pred.output.length - 1] : pred.output;
    return typeof out === "string" ? out : (out && out.url) || null;
  }
  console.error("[tryon] status:", pred && pred.status);
  return null;
}

module.exports = { enabled, generate };
