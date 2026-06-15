/* MENGA MOS — screens 3: Analyzing · Summary · Outfits · TryOn · Products */
const { useState, useEffect, useRef } = React;

/* Real product photo (Pinduoduo) with a graceful glyph fallback. */
function Thumb({ src, glyph, size }) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <img src={src} alt="" loading="lazy" onError={() => setBroken(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    );
  }
  return <Garment name={glyph} size={size} />;
}

/* ============ ANALYZING ============ */
function AnalyzingScreen({ go, app }) {
  const steps = window.ANALYSIS_STEPS;
  const [active, setActive] = useState(0);
  useEffect(() => {
    let done = false;
    const timers = [];
    const startedAt = Date.now();
    const minMs = steps.length * 900 + 600;
    // Animate the steps while the (possibly real) AI analysis runs.
    for (let i = 1; i <= steps.length; i++) {
      timers.push(setTimeout(() => !done && setActive(Math.min(i, steps.length)), i * 900));
    }
    const finish = () => { if (!done) { done = true; go("summary"); } };

    // Overwrite the sample catalogs with real AI results (same shapes).
    const apply = (res) => {
      if (res.profile) window.PROFILE = Object.assign({}, window.PROFILE, res.profile);
      if (Array.isArray(res.outfits) && res.outfits.length) {
        window.OUTFITS = res.outfits.map((o, i) => ({ ...o, id: o.id || "o" + (i + 1) }));
      }
      if (Array.isArray(res.products) && res.products.length) {
        window.PRODUCTS = res.products.map((p, i) => ({ ...p, id: p.id || "p" + (i + 1) }));
      }
    };

    const slot = document.querySelector("image-slot#mm-photo");
    const payload = {
      image: (slot && slot.dataUrl) || null,
      survey: app.survey || {},
      occasion: app.occasion, customOccasion: app.customOccasion,
      style: app.style, budget: app.budget, customBudget: app.customBudget,
      extras: app.extras || {},
    };

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .catch(() => ({ source: "mock" }))
      .then((res) => {
        if (done) return;
        if (res && res.source === "ai") { try { apply(res); } catch (e) {} }
        timers.push(setTimeout(finish, Math.max(0, minMs - (Date.now() - startedAt))));
      });

    // Hard cap so a slow/hung request never traps the user on this screen.
    timers.push(setTimeout(finish, 45000));
    return () => { done = true; timers.forEach(clearTimeout); };
  }, []);
  const pct = active / steps.length;
  return (
    <div className="mm-screen">
      <div className="mm-body center screen-anim" style={{ alignItems: "center", textAlign: "center" }}>
        <div style={{ position: "relative", width: 132, height: 132, marginBottom: 30 }}>
          <svg width="132" height="132" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="66" cy="66" r="60" fill="none" stroke="var(--line)" strokeWidth="3" />
            <circle cx="66" cy="66" r="60" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - pct)}
              style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.1,1)" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <div style={{ animation: "pulse 1.6s ease-in-out infinite" }}><Icon name="sparkle" size={42} /></div>
          </div>
        </div>
        <p className="eyebrow">AI tahlil</p>
        <h1 className="h2" style={{ maxWidth: 280 }}>Obrazlaringiz tayyorlanmoqda</h1>

        <div style={{ marginTop: 28, width: "100%", maxWidth: 300, textAlign: "left" }}>
          {steps.map((s, i) => {
            const done = i < active, cur = i === active;
            return (
              <div key={i} className="row gap12 center-x" style={{ padding: "9px 0", opacity: done || cur ? 1 : .4, transition: "opacity .4s" }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "var(--accent)" : "transparent",
                  border: done ? "none" : "2px solid var(--line-2)", color: "#fff",
                }}>
                  {done ? <Icon name="check" size={14} />
                    : cur ? <span style={{ width: 18, height: 18, borderRadius: 999, border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin .8s linear infinite" }} /> : null}
                </span>
                <span style={{ fontSize: 14, fontWeight: done || cur ? 600 : 500, color: done || cur ? "var(--ink)" : "var(--ink-3)" }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mm-footer">
        <p className="hint"><Icon name="lock" size={13} style={{ verticalAlign: "-2px", marginRight: 4 }} />Rasmingiz tahlildan keyin o'chiriladi</p>
      </div>
    </div>
  );
}

/* ============ SUMMARY ============ */
function PaletteRow({ label, colors }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div className="row gap10 wrap">
        {colors.map((c) => (
          <div key={c.name} className="col center-x" style={{ gap: 6 }}>
            <span className="swatch" style={{ width: 52, height: 52, background: c.hex, border: "1px solid var(--line-2)" }} />
            <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600 }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryScreen({ go, back }) {
  const P = window.PROFILE;
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="Stil profili" />
      <div className="mm-body screen-anim">
        <p className="eyebrow">AI stil xulosasi</p>
        <h1 className="h1">Sizning stil profilingiz</h1>
        <div className="row gap8 wrap" style={{ marginTop: 14 }}>
          {P.vibe.map((v) => <span key={v} className="tag accent">{v}</span>)}
        </div>

        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <p className="body" style={{ color: "var(--ink)" }}>{P.description}</p>
        </div>

        <div className="neutral-block" style={{ padding: 16, marginTop: 14 }}>
          <div className="row gap10 center-x"><span style={{ color: "var(--accent)" }}><Icon name="palette" size={20} /></span><span className="sans-title" style={{ fontSize: 15 }}>Mos rang palitrasi</span></div>
          <PaletteRow label="Asosiy ranglar" colors={P.best} />
          <PaletteRow label="Accent ranglar" colors={P.accent} />
          <PaletteRow label="Ehtiyot bo'ling" colors={P.avoid} />
        </div>

        <div className="card" style={{ padding: 16, marginTop: 14 }}>
          <span className="sans-title" style={{ fontSize: 15 }}>Mos siluetlar</span>
          <div style={{ marginTop: 10 }}>
            {P.silhouettes.map((s, i) => (
              <div key={i} className="row gap10 center-x" style={{ padding: "6px 0" }}>
                <span style={{ color: "var(--accent)" }}><Icon name="check" size={16} /></span>
                <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind="primary" iconRight="arrow" onClick={() => go("outfits")}>3 ta obrazni ko'rish</Btn>
      </div>
    </div>
  );
}

/* ============ OUTFITS ============ */
function OutfitCard({ o, go, setApp }) {
  return (
    <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
      <div style={{ position: "relative" }}>
        <div className="garment" style={{ aspectRatio: "5 / 4", borderRadius: 0, overflow: "hidden" }}>
          <Thumb src={o.image} glyph={o.glyph} size="40%" />
        </div>
        {o.accent && <span className="tag gold" style={{ position: "absolute", top: 12, right: 12 }}><Icon name="crown" size={13} /> Tanlangan</span>}
      </div>
      <div style={{ padding: 15 }}>
        <div style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 22, color: "var(--ink)", lineHeight: 1.1 }}>{o.name}</div>
        <div className="small" style={{ fontWeight: 600, marginTop: 2, marginBottom: 12 }}>{o.occasion}</div>
        <div className="row gap8" style={{ marginBottom: 12 }}>
          {o.items.map((it, i) => (
            <div key={i} className="garment" style={{ width: 52, height: 52, borderRadius: 11, flexShrink: 0, overflow: "hidden" }}>
              <Thumb src={it.image} glyph={it.glyph} size="60%" />
            </div>
          ))}
        </div>
        <p className="small" style={{ color: "var(--ink-2)", lineHeight: 1.45 }}>{o.why}</p>
        <div className="row between center-x" style={{ marginTop: 12 }}>
          <div><span className="small">Taxminiy narx</span><div style={{ fontWeight: 700, fontSize: 16 }}>{o.price} <span style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 500 }}>so'm</span></div></div>
        </div>
        <div className="row gap10" style={{ marginTop: 14 }}>
          <Btn kind="primary" icon="sparkle" onClick={() => { setApp({ outfit: o.id }); go("tryon"); }} style={{ flex: 1, height: 48, fontSize: 14.5 }}>Rasmimda</Btn>
          <Btn kind="secondary" icon="tag" onClick={() => { setApp({ outfit: o.id }); go("products"); }} style={{ flex: 1, height: 48, fontSize: 14.5 }}>Mahsulotlar</Btn>
        </div>
      </div>
    </div>
  );
}

function OutfitsScreen({ go, back, setApp }) {
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="Obrazlar" close onClose={back} />
      <div className="mm-body screen-anim" style={{ paddingTop: 6 }}>
        <p className="eyebrow">Sizning obrazlaringiz</p>
        <h1 className="h1">3 ta bepul obraz</h1>
        <p className="body" style={{ marginTop: 8 }}>Tanlovlaringiz asosida yaratildi. Har birini o'z rasmingizda ko'ring.</p>

        <div style={{ marginTop: 18 }}>
          {window.OUTFITS.map((o) => <OutfitCard key={o.id} o={o} go={go} setApp={setApp} />)}
        </div>

        <div className="neutral-block" style={{ padding: 14, marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "var(--ink-3)" }}><Icon name="info" size={18} /></span>
          <span className="small" style={{ color: "var(--ink-2)" }}>Bepul 3 ta obraz ishlatildi. Ko'proq obraz uchun Premium.</span>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 8, background: "linear-gradient(135deg, var(--accent), var(--accent-press))", border: "none" }}>
          <div className="row between center-x">
            <div>
              <div style={{ color: "#fff", fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600 }}>Ko'proq xohlaysizmi?</div>
              <div style={{ color: "rgba(255,255,255,.8)", fontSize: 13, marginTop: 2 }}>10+ obraz · PDF · realistik rasm</div>
            </div>
            <span style={{ color: "var(--gold-2)" }}><Icon name="crown" size={26} /></span>
          </div>
          <Btn kind="gold" icon="crown" onClick={() => go("premium")} style={{ marginTop: 14 }}>Premium'ga o'tish</Btn>
        </div>
        <div style={{ height: 4 }} />
      </div>
    </div>
  );
}

/* ============ TRY-ON ============ */
function TryOnScreen({ go, back, app }) {
  const o = window.OUTFITS.find((x) => x.id === app.outfit) || window.OUTFITS[0];
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="Rasmingizda" />
      <div className="mm-body screen-anim">
        <h1 className="h1" style={{ marginTop: 4 }}>{o.name}</h1>
        <p className="body" style={{ marginTop: 6 }}>Obraz sizning rasmingizda — yuz va pozangiz saqlanadi.</p>

        <div style={{ position: "relative", marginTop: 16, borderRadius: 20, overflow: "hidden" }}>
          <image-slot id="mm-photo" shape="rounded" radius="20"
            placeholder="Rasmingizni yuklang — try-on shu yerda"
            style={{ width: "100%", aspectRatio: "3 / 4", display: "block" }}></image-slot>
          <span className="tag" style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,.55)", color: "#fff", backdropFilter: "blur(6px)" }}>
            <Icon name="sparkle" size={13} /> AI try-on
          </span>
          <div className="row gap8" style={{ position: "absolute", right: 12, bottom: 12 }}>
            <button className="mm-iconbtn" style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(6px)", border: "none" }}><Icon name="share" size={18} /></button>
            <button className="mm-iconbtn" style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(6px)", border: "none" }}><Icon name="download" size={18} /></button>
          </div>
        </div>

        <div className="row gap8" style={{ marginTop: 14 }}>
          {o.items.map((it, i) => (
            <div key={i} className="col center-x" style={{ gap: 5, flex: 1 }}>
              <div className="garment" style={{ width: "100%", aspectRatio: "1", borderRadius: 12, overflow: "hidden" }}><Thumb src={it.image} glyph={it.glyph} size="58%" /></div>
              <span style={{ fontSize: 10.5, color: "var(--ink-3)", fontWeight: 600, textAlign: "center" }}>{it.type}</span>
            </div>
          ))}
        </div>

        <div className="neutral-block" style={{ padding: 14, marginTop: 16 }}>
          {["Yuz va poza saqlanadi", "Tana proporsiyasi o'zgarmaydi", "Kiyim tabiiy tushgan ko'rinadi"].map((t, i) => (
            <div key={i} className="row gap10 center-x" style={{ padding: "5px 0" }}>
              <span style={{ color: "var(--accent)" }}><Icon name="check" size={16} /></span>
              <span className="small" style={{ color: "var(--ink-2)" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind="primary" icon="tag" onClick={() => go("products")}>Mahsulotlarni ko'rish</Btn>
        <Btn kind="ghost" icon="refresh" onClick={() => go("premium")} style={{ marginTop: 2 }}>Qayta generatsiya</Btn>
      </div>
    </div>
  );
}

/* ============ PRODUCTS ============ */
function ProductCard({ p }) {
  return (
    <div className="card" style={{ padding: 12, marginBottom: 12, display: "flex", gap: 12 }}>
      <div className="garment" style={{ width: 84, height: 104, borderRadius: 12, flexShrink: 0, overflow: "hidden" }}><Thumb src={p.image} glyph={p.glyph} size="56%" /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row between" style={{ alignItems: "flex-start", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>{p.title}</div>
            <div className="small" style={{ marginTop: 2, fontWeight: 600 }}>{p.brand}</div>
          </div>
          <MatchRing value={p.match} size={42} />
        </div>
        <div className="row gap6 wrap" style={{ marginTop: 8 }}>
          <span className="tag">{p.store}</span>
          <span className="tag">{p.color}</span>
          <span className="tag">O'lcham {p.size}</span>
        </div>
        <div className="row between center-x" style={{ marginTop: 10 }}>
          <div className="row gap10 center-x">
            <span style={{ fontSize: 15, fontWeight: 700 }}>{p.price}</span>
            <Stars value={p.rating} />
          </div>
          {p.url ? (
            <a className="btn btn-sm" href={p.url} target="_blank" rel="noopener noreferrer"
              style={{ background: "var(--accent)", color: "#fff", height: 38, padding: "0 14px", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              Do'kon <Icon name="external" size={15} />
            </a>
          ) : (
            <button className="btn btn-sm" style={{ background: "var(--accent)", color: "#fff", height: 38, padding: "0 14px" }}>
              Do'kon <Icon name="external" size={15} />
            </button>
          )}
        </div>
        <div className="small" style={{ marginTop: 7 }}><Icon name="plane" size={12} style={{ verticalAlign: "-2px", marginRight: 3 }} />Yetkazib berish: {p.delivery}</div>
      </div>
    </div>
  );
}

function ProductsScreen({ go, back, app }) {
  const o = window.OUTFITS.find((x) => x.id === app.outfit) || window.OUTFITS[0];
  const [showCriteria, setShowCriteria] = useState(false);
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="Mahsulotlar" />
      <div className="mm-body screen-anim">
        <p className="eyebrow">{o.name}</p>
        <h1 className="h1">O'xshash mahsulotlar</h1>
        <p className="body" style={{ marginTop: 8 }}>O'xshashlik balli bo'yicha saralangan, ishonchli manbalardan.</p>

        <button onClick={() => setShowCriteria((v) => !v)} className="neutral-block" style={{ width: "100%", border: "none", textAlign: "left", padding: 14, marginTop: 16, cursor: "pointer" }}>
          <div className="row between center-x">
            <span className="sans-title" style={{ fontSize: 14 }}>O'xshashlik balli qanday hisoblanadi?</span>
            <Icon name="chevron" size={16} style={{ transform: showCriteria ? "rotate(90deg)" : "none", transition: "transform .2s", color: "var(--ink-3)" }} />
          </div>
          {showCriteria && (
            <div style={{ marginTop: 12 }}>
              {window.MATCH_CRITERIA.map((c) => (
                <div key={c.label} style={{ marginBottom: 9 }}>
                  <div className="row between" style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 4 }}><span>{c.label}</span><span style={{ fontWeight: 700, color: "var(--ink)" }}>{c.weight}%</span></div>
                  <div style={{ height: 5, background: "var(--line)", borderRadius: 999, overflow: "hidden" }}><i style={{ display: "block", height: "100%", width: c.weight * 3 + "%", background: "var(--accent)", borderRadius: 999 }} /></div>
                </div>
              ))}
            </div>
          )}
        </button>

        <div style={{ marginTop: 16 }}>
          {window.PRODUCTS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        <div className="neutral-block" style={{ padding: 13, marginBottom: 12, display: "flex", gap: 9, alignItems: "flex-start" }}>
          <span style={{ color: "var(--ink-3)", marginTop: 1 }}><Icon name="info" size={16} /></span>
          <span className="small" style={{ color: "var(--ink-2)" }}>Aynan topilmasa, rang, stil va narx bo'yicha eng yaqin variantlarni ko'rsatamiz.</span>
        </div>
        <div style={{ height: 4 }} />
      </div>
      <div className="mm-footer">
        <Btn kind="gold" icon="doc" onClick={() => go("premium")}>PDF hisobot olish · Premium</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { AnalyzingScreen, SummaryScreen, OutfitsScreen, TryOnScreen, ProductsScreen, OutfitCard, ProductCard, PaletteRow });
