/* MENGA MOS — mock data (Uzbek content from the texnik topshiriq) */

const OCCASIONS = [
  { id: "kundalik", label: "Kundalik", icon: "sun" },
  { id: "ish", label: "Ish / ofis", icon: "briefcase" },
  { id: "univ", label: "Universitet", icon: "book" },
  { id: "uchrashuv", label: "Uchrashuv", icon: "heart" },
  { id: "toy", label: "To'y / ziyofat", icon: "sparkle" },
  { id: "restoran", label: "Restoran", icon: "wine" },
  { id: "sayohat", label: "Sayohat", icon: "plane" },
  { id: "meeting", label: "Biznes meeting", icon: "chart" },
  { id: "random", label: "Random obraz", icon: "shuffle" },
  { id: "ozim", label: "O'zim yozaman", icon: "pen" },
];

const STYLES = [
  { id: "casual", label: "Casual", desc: "Erkin, kundalik qulaylik" },
  { id: "smart", label: "Smart casual", desc: "Tartibli, lekin yengil" },
  { id: "business", label: "Business", desc: "Rasmiy, ishchan" },
  { id: "street", label: "Streetwear", desc: "Shahar, dinamik" },
  { id: "oldmoney", label: "Old money", desc: "Vazmin, klassik nafosat" },
  { id: "minimal", label: "Minimal", desc: "Sokin, ortiqchasiz" },
  { id: "sport", label: "Sport", desc: "Faol, harakatchan" },
  { id: "luxury", label: "Luxury", desc: "Premium, e'tiborli" },
  { id: "toy", label: "To'y / ziyofat", desc: "Bayramona, yorqin" },
  { id: "ai", label: "Menga mosini AI tanlasin", desc: "Tahlilga ko'ra avtomatik", ai: true },
];

const BUDGETS = [
  { id: "arzon", label: "Arzon", range: "200 – 500 ming", desc: "Tejamkor variantlar" },
  { id: "ortacha", label: "O'rtacha", range: "500 ming – 1.5 mln", desc: "Sifat va narx muvozanati" },
  { id: "premium", label: "Premium", range: "1.5 – 4 mln", desc: "Yuqori sifatli brendlar" },
  { id: "luxury", label: "Luxury", range: "4 mln +", desc: "Hashamatli segment" },
  { id: "ozim", label: "O'zim summa kiritaman", range: "", desc: "Aniq limit belgilang", custom: true },
];

const EXTRAS = [
  { id: "aksessuar", label: "Aksessuar qo'shilsin" },
  { id: "qulay", label: "Faqat qulay kiyimlar" },
  { id: "noyorqin", label: "Juda yorqin ranglar bo'lmasin" },
  { id: "brend", label: "Brend muhim" },
  { id: "narx", label: "Narx muhim" },
  { id: "yopiq", label: "Yopiqroq kiyim" },
  { id: "trend", label: "Trenddagi kiyimlar" },
  { id: "zamonaviy", label: "Zamonaviyroq vibe" },
];

const ANALYSIS_STEPS = [
  "Rasmingiz tahlil qilinmoqda",
  "Sizga mos ranglar aniqlanmoqda",
  "Stil kombinatsiyalari yaratilmoqda",
  "O'xshash kiyimlar qidirilmoqda",
  "Obrazlar tayyorlanmoqda",
];

const PROFILE = {
  vibe: ["Zamonaviy", "Vazmin", "Minimal"],
  bodyNote: "Muvozanatli proporsiya — yelka va bel chizig'i uyg'un.",
  faceNote: "Oval yuz shakli — yumshoq va keskin yoqalar ikkalasi yarashadi.",
  description:
    "Sizga sokin, tartibli va biroz premium yo'nalish juda yarashadi. Toza siluetlar, neytral asos va bitta nozik accent rang — bu sizning kuchli tomoningiz. Ortiqcha detallarsiz, lekin sifatli matolar bilan obrazni ko'taramiz.",
  best: [
    { name: "Navy", hex: "#27324F" },
    { name: "Oq", hex: "#F4F1EC" },
    { name: "Bej", hex: "#D9C7AD" },
    { name: "Grafit", hex: "#3A3D42" },
  ],
  accent: [
    { name: "Bordo", hex: "#6E1A2E" },
    { name: "Zaytun", hex: "#6B6A3A" },
  ],
  avoid: [{ name: "Neon sariq", hex: "#E8F23C" }],
  silhouettes: [
    "To'g'ri kesim shimlar",
    "Yengil oversize ko'ylak",
    "Strukturali yengil ustki kiyim",
  ],
};

// Outfit garment glyph keys: shirt, trousers, jacket, shoes, knit, coat, tshirt, bag, dress
const OUTFITS = [
  {
    id: "o1",
    name: "Toza smart casual",
    occasion: "Universitet / kundalik",
    price: "1 240 000",
    glyph: "shirt",
    accent: false,
    why: "Neytral asos va bitta nozik accent — kunduzgi muhitga ideal, ortiqcha urg'usiz.",
    items: [
      { type: "Ko'ylak", glyph: "shirt", name: "Oq oversize ko'ylak", color: "Oq" },
      { type: "Shim", glyph: "trousers", name: "Bej chinos shim", color: "Bej" },
      { type: "Oyoq kiyim", glyph: "shoes", name: "Oq minimal krossovka", color: "Oq" },
      { type: "Ustki", glyph: "knit", name: "Grafit yengil jemper", color: "Grafit" },
    ],
  },
  {
    id: "o2",
    name: "Vazmin old money",
    occasion: "Uchrashuv / restoran",
    price: "2 980 000",
    glyph: "coat",
    accent: true,
    why: "Klassik proporsiya va issiq neytral palitra — vazmin, ishonchli va premium taassurot.",
    items: [
      { type: "Ustki", glyph: "coat", name: "Bej yengil palto", color: "Bej" },
      { type: "Ko'ylak", glyph: "knit", name: "Navy nozik jemper", color: "Navy" },
      { type: "Shim", glyph: "trousers", name: "Grafit jun shim", color: "Grafit" },
      { type: "Oyoq kiyim", glyph: "shoes", name: "Jigarrang charm tufli", color: "Jigarrang" },
    ],
  },
  {
    id: "o3",
    name: "Yengil minimal",
    occasion: "Sayohat / dam olish",
    price: "890 000",
    glyph: "tshirt",
    accent: false,
    why: "Qulay, nafas oladigan matolar va sodda forma — uzoq kun uchun erkin harakat.",
    items: [
      { type: "Futbolka", glyph: "tshirt", name: "Oq premium futbolka", color: "Oq" },
      { type: "Shim", glyph: "trousers", name: "Navy yengil shim", color: "Navy" },
      { type: "Oyoq kiyim", glyph: "shoes", name: "Bej krossovka", color: "Bej" },
      { type: "Aksessuar", glyph: "bag", name: "Tabiiy matoli sumka", color: "Bej" },
    ],
  },
];

const PRODUCTS = [
  {
    id: "p1", glyph: "shirt", title: "Oversize cotton ko'ylak",
    brand: "COS", store: "Trendyol", price: "389 000", color: "Oq", size: "M",
    rating: 4.6, match: 94, delivery: "5–7 kun",
  },
  {
    id: "p2", glyph: "shirt", title: "Relaxed oxford shirt",
    brand: "Mango", store: "SHEIN", price: "245 000", color: "Oq", size: "M",
    rating: 4.3, match: 88, delivery: "8–12 kun",
  },
  {
    id: "p3", glyph: "trousers", title: "Tapered chinos",
    brand: "Massimo Dutti", store: "Trendyol", price: "459 000", color: "Bej", size: "31",
    rating: 4.7, match: 91, delivery: "5–7 kun",
  },
  {
    id: "p4", glyph: "shoes", title: "Minimal leather sneaker",
    brand: "Zara", store: "Trendyol", price: "612 000", color: "Oq", size: "42",
    rating: 4.5, match: 86, delivery: "6–9 kun",
  },
];

const MATCH_CRITERIA = [
  { label: "Stil mosligi", weight: 30 },
  { label: "Rang mosligi", weight: 20 },
  { label: "Narx / byudjet", weight: 20 },
  { label: "O'lcham mavjudligi", weight: 15 },
  { label: "Brend / reyting", weight: 10 },
  { label: "Yetkazib berish", weight: 5 },
];

const PREMIUM_FEATURES = [
  { t: "10+ obraz", d: "Cheklovsiz yangi obrazlar", glyph: "layers" },
  { t: "Realistik rasm", d: "O'z rasmingizda yuqori sifat", glyph: "image" },
  { t: "PDF stil hisobot", d: "Saqlab qo'yiladigan to'liq profil", glyph: "doc" },
  { t: "Xarid ro'yxati", d: "Har bir obraz uchun to'liq ro'yxat", glyph: "cart" },
  { t: "Qayta generatsiya", d: "Yoqmasa — qaytadan yaratish", glyph: "refresh" },
  { t: "Garderob saqlash", d: "Tanlovlaringizni saqlab boring", glyph: "wardrobe" },
];

const PLANS = [
  { id: "once", name: "Bir martalik", price: "29 000", per: "/ obraz", desc: "1 premium obraz, try-on, shopping list", badge: "" },
  { id: "month", name: "Oylik obuna", price: "79 000", per: "/ oy", desc: "Cheklovsiz obraz, PDF, tarix, garderob", badge: "Ommabop" },
];

const QUESTIONNAIRE = {
  genders: ["Erkak", "Ayol", "Aytmayman"],
  ages: ["16–20", "21–27", "28–35", "36–45", "45+"],
  heights: ["155–165", "166–175", "176–185", "186+"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["38", "39", "40", "41", "42", "43", "44"],
  skin: [
    { name: "Iliq", hex: "#E7C9A6" },
    { name: "Neytral", hex: "#D9B894" },
    { name: "Sovuq", hex: "#C9A684" },
    { name: "To'q", hex: "#8A5A3C" },
  ],
  hair: [
    { name: "Qora", hex: "#1C1A19" },
    { name: "Jigarrang", hex: "#5A3B27" },
    { name: "Sariq", hex: "#C9A063" },
    { name: "Boshqa", hex: "#9A9A9A" },
  ],
  cover: ["Yopiqroq kiyim", "O'rtacha", "Ochiqroq kiyim"],
};

const PAY_METHODS = [
  { id: "payme", label: "Payme" },
  { id: "click", label: "Click" },
  { id: "uzum", label: "Uzum Bank" },
];

Object.assign(window, {
  OCCASIONS, STYLES, BUDGETS, EXTRAS, ANALYSIS_STEPS, PROFILE, OUTFITS,
  PRODUCTS, MATCH_CRITERIA, PREMIUM_FEATURES, PLANS, QUESTIONNAIRE, PAY_METHODS,
});
