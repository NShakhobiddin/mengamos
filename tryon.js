/**
 * Try-on — foydalanuvchining rasmiga obrazni generatsiya qilish.
 *
 * Ikki rejim:
 *  1) Prompt rejimi (DEFAULT) — rasm + obraz tavsifi (matn) → odamni o'sha
 *     kiyimda generatsiya. Faqat REPLICATE_API_TOKEN kerak (Pinduoduo SHART EMAS).
 *     Default model: black-forest-labs/flux-kontext-pro (input_image + prompt).
 *  2) VTON rejimi (ixtiyoriy) — agar kiyim rasmi (Pinduoduo) bo'lsa va
 *     REPLICATE_VTON_MODEL berilgan bo'lsa, IDM-VTON uslubida (human_img + garment_img).
 *
 * Env:
 *   REPLICATE_API_TOKEN      Replicate API tokeni (majburiy)
 *   REPLICATE_TRYON_MODEL    prompt-model (default "black-forest-labs/flux-kontext-pro")
 *   REPLICATE_IMAGE_FIELD    rasm maydoni (default "input_image")
 *   REPLICATE_VTON_MODEL     ixtiyoriy VTON model (masalan "cuuupid/idm-vton")
 *   REPLICATE_HUMAN_FIELD    VTON inson maydoni (default "human_img")
 *   REPLICATE_GARMENT_FIELD  VTON kiyim maydoni (default "garment_img")
 *   REPLICATE_TIMEOUT_MS     kutish limiti (default 90000)
 */

function enabled() {
  return !!process.env.REPLICATE_API_TOKEN;
}

async function runModel(model, input, token, deadline) {
  let pred = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", Prefer: "wait" },
    body: JSON.stringify({ input }),
  }).then((r) => r.json());

  if (pred && (pred.error || pred.detail)) {
    console.error("[tryon]", pred.error || pred.detail);
    return null;
  }
  while (pred && (pred.status === "starting" || pred.status === "processing") && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    pred = await fetch(pred.urls.get, { headers: { Authorization: "Bearer " + token } }).then((r) => r.json());
  }
  if (pred && pred.status === "succeeded") {
    const out = Array.isArray(pred.output) ? pred.output[pred.output.length - 1] : pred.output;
    return typeof out === "string" ? out : (out && out.url) || null;
  }
  console.error("[tryon] status:", pred && pred.status, pred && pred.error);
  return null;
}

async function generate({ human, garment, prompt }) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token || !human) return null;
  const deadline = Date.now() + (Number(process.env.REPLICATE_TIMEOUT_MS) || 90000);

  // VTON rejimi — kiyim rasmi va VTON model bo'lsa.
  const vton = process.env.REPLICATE_VTON_MODEL;
  if (garment && vton) {
    const input = {
      [process.env.REPLICATE_HUMAN_FIELD || "human_img"]: human,
      [process.env.REPLICATE_GARMENT_FIELD || "garment_img"]: garment,
    };
    const url = await runModel(vton, input, token, deadline);
    if (url) return url;
    // VTON ishlamasa, prompt rejimiga tushadi (agar prompt bo'lsa).
  }

  // Prompt rejimi — faqat rasm + matn.
  if (!prompt) return null;
  const model = process.env.REPLICATE_TRYON_MODEL || "black-forest-labs/flux-kontext-pro";
  const input = { [process.env.REPLICATE_IMAGE_FIELD || "input_image"]: human, prompt };
  return runModel(model, input, token, deadline);
}

module.exports = { enabled, generate };
