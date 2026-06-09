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

## Ishga tushirish

Babel `.jsx` fayllarni `fetch` orqali yuklaydi, shuning uchun loyihani HTTP
orqali ochish kerak (`file://` ishlamaydi):

```bash
python3 -m http.server 8000
# brauzerda oching: http://localhost:8000/
```

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

> Eslatma: bu interaktiv dizayn prototipi. Orqa tomonda haqiqiy backend, AI
> tahlili va to'lov integratsiyasi yo'q — barcha ma'lumotlar `data.jsx`
> ichidagi mock qiymatlar.
