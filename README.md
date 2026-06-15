# Menga Mos — AI shaxsiy stilist

Interaktiv prototip: O'zbek foydalanuvchilari uchun AI shaxsiy stilist
platformasi. iPhone ramkasida, mobile-first, 15 ta ekranning to'liq oqimi —
bosh sahifa → maxfiylik/rozilik → rasm yuklash → anketa → maqsad → stil →
byudjet → qo'shimcha sozlamalar → AI tahlil → stil xulosasi → 3 ta obraz →
o'z rasmida try-on → mahsulotlar → premium → to'lov → PDF hisobot.

## Texnologiya

- React 18 (UMD) + Babel Standalone — barcha `.jsx` brauzerda kompilyatsiya
  qilinadi, qurish (build) bosqichi shart emas.
- Sof CSS (`app.css`) — editorial uslub: nozik serif sarlavhalar
  (Cormorant Garamond) + toza grotesk matn (Hanken Grotesk).
- 3 vizual yo'nalish (Tweaks panelida almashtiriladi): **Bordo**, **Atlas**
  (chuqur ko'k), **Sage** (emerald).
- `<image-slot>` — foydalanuvchi rasmi uchun drag-drop slot (upload va try-on
  ekranlarida).

### To'liq mustaqil (offline)

Hech qanday CDN'ga bog'liq emas — barcha kutubxonalar va shriftlar loyiha
ichida joylashgan, shuning uchun prototip internetsiz, istalgan muhitda
ishonchli ishlaydi:

- `vendor/` — React, ReactDOM, Babel Standalone (local nusxalar)
- `fonts/` — Cormorant Garamond va Hanken Grotesk `.woff2` fayllari +
  `fonts.css`

## Ishga tushirish

Tavsiya etilgan yo'l — Node server (statik fayllar + real AI tahlil endpointi):

```bash
npm install
npm start
# brauzerda oching: http://localhost:8000/
```

> Faqat dizayn (backendsiz) ko'rmoqchi bo'lsangiz, istalgan statik server ham
> yetarli (`python3 -m http.server 8000`) — bu holda AI tahlil avtomatik
> ravishda namunaviy (mock) ma'lumotga qaytadi.

## Real AI tahlil (Claude)

`AnalyzingScreen` yuklangan rasmni va anketa javoblarini `POST /api/analyze`
orqali serverga yuboradi. Server **Claude vision** (`claude-opus-4-8`) yordamida
real stil profili, 3 ta obraz va 4 ta mahsulot tavsiyasini qaytaradi — UI shu
ma'lumotni o'sha ko'rinishda chizadi.

Real AI'ni yoqish uchun API kalitini o'rnating va serverni ishga tushiring:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
npm start
```

- **Kalit yo'q bo'lsa** — server `{ source: "mock" }` qaytaradi va ilova
  `data.jsx` ichidagi namunaviy ma'lumotdan foydalanadi (hozircha shu holatda
  ishlaydi). Kalit qo'shilishi bilan **hech qanday kod o'zgartirmasdan** real
  AI'ga o'tadi.
- Modelni o'zgartirish: `MENGA_MODEL` muhit o'zgaruvchisi.
- Tekshirish: `GET /api/config` → `{ "aiEnabled": true/false }`.

## Real mahsulot rasmlari — Pinduoduo (多多进宝)

Natija ekranlaridagi kiyim rasmlari real bo'lishi mumkin. Server Pinduoduo
**多多进宝 (Duoduo Jinbao)** ochiq platformasi orqali har bir mahsulot/obraz
uchun real **rasm + narx (so'mga aylantirilgan) + do'kon havolasi** oladi.

Bu ham kalitga bog'langan: kalit yo'q bo'lsa chizilgan ikonalar ko'rinadi,
kalit qo'shilishi bilan real rasmlar avtomatik chiqadi.

**Kalit olish:**
1. https://open.pinduoduo.com — 开放平台 da ro'yxatdan o'ting (xitoy raqami/biznes
   verifikatsiyasi talab qilinadi).
2. **多多进宝 (Duoduo Jinbao)** CPS/affiliate dasturiga a'zo bo'ling — `goods.search`
   API faqat tasdiqlangan a'zolarga ochiladi.
3. Ilova yarating → `client_id` va `client_secret` oling. Havola (komissiya) uchun
   推广位 (promotion position) `pid` ham yarating.

**Sozlash** (`.env` fayl yoki muhit o'zgaruvchilari — `.env` gitignore'da):

```bash
PDD_CLIENT_ID=...        # 开放平台 client_id
PDD_CLIENT_SECRET=...    # 开放平台 client_secret
PDD_PID=...              # ixtiyoriy — affiliate havola uchun 推广位
PDD_CNY_TO_UZS=1750      # ixtiyoriy — yuan→so'm kursi
PDD_DELIVERY="2–4 hafta" # ixtiyoriy — yetkazib berish yorlig'i
ANTHROPIC_API_KEY=...    # AI tahlil uchun
```

Tekshirish: `GET /api/config` → `{ "pddEnabled": true }`.

> Eslatma: men buni 多多进宝 hujjatidagi MD5 imzo algoritmi va `gw-api.pinduoduo.com`
> shlyuzi bo'yicha yozdim; u tasdiqlangan kalit bilan jonli ishlaydi. Har bir
> qadam fail-safe — Pinduoduo javob bermasa, karta ikonali holatga qaytadi.

## To'lov — Payme / Click

To'lov tugmasi `POST /api/pay` orqali real **Payme** yoki **Click** checkout
havolasini yaratadi va foydalanuvchini to'lov sahifasiga yo'naltiradi.
Merchant ma'lumotlari bo'lmasa — demo (success) ekrani ko'rsatiladi.

```bash
PAYME_MERCHANT_ID=...     # Payme kassa ID
CLICK_SERVICE_ID=...      # Click
CLICK_MERCHANT_ID=...
```

> Eslatma: bu to'lovni **boshlash** (checkout link) qismi — real. To'lovni
> tasdiqlash uchun ishlab chiqarishda Payme/Click **callback (Merchant API)**
> endpointini ham ulash kerak (premium statusni webhook orqali yoqish).

## Try-on — rasmingizda generatsiya

`Rasmingizda` ekrani `POST /api/tryon` orqali yuklangan rasmingizga AI obrazini
generatsiya qiladi: **rasm + obraz tavsifi (matn) → sizni o'sha kiyimda**.
Replicate'dagi rasm modeli orqali (default **flux-kontext-pro**).

```bash
REPLICATE_API_TOKEN=...   # FAQAT shu kerak — Pinduoduo SHART EMAS
```

- Token yo'q bo'lsa — ekran oddiy rasmni ko'rsatadi va aniq izoh chiqaradi.
- Ixtiyoriy: `REPLICATE_VTON_MODEL=cuuupid/idm-vton` qo'shsangiz va Pinduoduo
  kiyim rasmi bo'lsa, IDM-VTON (kiyim-almashtirish) rejimi ishlaydi.

> ⚠️ Bu funksiya uchun **rasmingiz yuklangan bo'lishi** kerak (boshida "Rasm
> bilan" yo'lini tanlang, "Rasmsiz" emas).

## Deploy (Render / Railway)

```bash
# 1) GitHub'ga push qiling
# 2) Render.com → New + → Blueprint → shu repo (render.yaml avtomatik o'qiladi)
#    yoki Railway → Deploy from repo (Procfile: web: node server.js)
# 3) Dashboard'da kerakli kalitlarni Environment sifatida qo'shing
```

Barcha kalitlar `.env.example` da ro'yxatlangan. Hech biri bo'lmasa ham ilova
ishlaydi — har bir kalit mos funksiyani "real" qiladi.

## Fayllar tuzilishi

| Fayl | Vazifasi |
| --- | --- |
| `index.html` | Kirish nuqtasi — skriptlar va uslublarni ulaydi |
| `app.css` | Tema tizimi, tipografiya, komponent uslublari |
| `app.jsx` | Asosiy ilova — navigatsiya steki, tema, iPhone ramkasi |
| `data.jsx` | Mock ma'lumotlar (matn, obrazlar, mahsulotlar) |
| `ui.jsx` | Umumiy UI primitivlari, ikonkalar |
| `screens1–4.jsx` | 15 ta ekran |
| `frames/ios-frame.jsx` | iPhone ramkasi komponenti |
| `tweaks-panel.jsx` | Vizual yo'nalish/uslub sozlamalari paneli |
| `image-slot.js` | Drag-drop rasm sloti (custom element) |
| `vendor/` | Self-hosted React/ReactDOM/Babel |
| `fonts/` | Self-hosted shriftlar (`.woff2`) + `fonts.css` |
| `favicon.svg` | Brend belgisi (M) |
| `server.js` | Node server + API (analyze · pay · tryon · config) |
| `pdd.js` | Pinduoduo 多多进宝 mijozi (qidiruv, narx→so'm, havola) |
| `pay.js` | Payme / Click checkout havolalari |
| `tryon.js` | Virtual try-on (Replicate) |
| `render.yaml` · `Procfile` · `.env.example` | Deploy konfiguratsiyasi |

> Eslatma: AI **tahlil**, **mahsulot rasmlari**, **try-on** va **to'lov
> boshlash** — barchasi real integratsiyalar, mos kalit qo'shilganda ishlaydi.
> Faqat to'lov **tasdig'i** (callback) ishlab chiqarishda qo'shilishi kerak.
