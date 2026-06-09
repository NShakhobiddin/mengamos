/* MENGA MOS — screens 4: Premium · Payment · PDF · Error states */

/* ============ PREMIUM PAYWALL ============ */
function PremiumScreen({ go, back, app, setApp }) {
  const plan = app.plan || "month";
  return (
    <div className="mm-screen" style={{ background: "#14110C" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% 0%, rgba(200,167,102,.22), transparent 60%)", pointerEvents: "none" }} />
      <TopBar onBack={back} step="Premium" close onClose={back} />
      <div className="mm-body screen-anim" style={{ position: "relative" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, var(--gold-1), var(--gold-2))", color: "#3A2C12", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 6 }}>
          <Icon name="crown" size={28} />
        </div>
        <h1 className="h1" style={{ color: "#fff", marginTop: 16 }}>Menga Mos<br />Premium</h1>
        <p className="body" style={{ color: "rgba(255,255,255,.7)", marginTop: 8 }}>To'liq stilist tajribasi — cheklovsiz obraz, realistik rasm va saqlanadigan hisobot.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          {window.PREMIUM_FEATURES.map((f) => (
            <div key={f.t} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: 14 }}>
              <span style={{ color: "var(--gold-2)" }}><Icon name={f.glyph} size={22} /></span>
              <div style={{ color: "#fff", fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>{f.t}</div>
              <div style={{ color: "rgba(255,255,255,.55)", fontSize: 11.5, marginTop: 2, lineHeight: 1.3 }}>{f.d}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          {window.PLANS.map((p) => {
            const on = plan === p.id;
            return (
              <button key={p.id} onClick={() => setApp({ plan: p.id })}
                style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14, padding: 16, marginBottom: 10, borderRadius: 16, cursor: "pointer",
                  background: on ? "rgba(231,211,161,.12)" : "rgba(255,255,255,.04)",
                  border: on ? "1.5px solid var(--gold-2)" : "1.5px solid rgba(255,255,255,.12)" }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, border: on ? "2px solid var(--gold-2)" : "2px solid rgba(255,255,255,.3)", flexShrink: 0, position: "relative" }}>
                  {on && <span style={{ position: "absolute", inset: 4, borderRadius: 999, background: "var(--gold-2)" }} />}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="row gap8 center-x">
                    <span style={{ color: "#fff", fontSize: 15.5, fontWeight: 600 }}>{p.name}</span>
                    {p.badge && <span className="tag gold" style={{ fontSize: 10 }}>{p.badge}</span>}
                  </div>
                  <div style={{ color: "rgba(255,255,255,.55)", fontSize: 12, marginTop: 3 }}>{p.desc}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{p.price}</div>
                  <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11 }}>so'm{p.per}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer" style={{ background: "linear-gradient(to top, #14110C 62%, transparent)" }}>
        <Btn kind="gold" icon="crown" onClick={() => go("payment")}>Premium'ni faollashtirish</Btn>
        <p className="hint" style={{ color: "rgba(255,255,255,.4)" }}>Istalgan vaqt bekor qilasiz · Payme · Click · Uzum</p>
      </div>
    </div>
  );
}

/* ============ PAYMENT ============ */
function PaymentScreen({ go, back, app, setApp }) {
  const method = app.payMethod || "payme";
  const plan = window.PLANS.find((p) => p.id === (app.plan || "month"));
  const [err, setErr] = React.useState(false);
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="To'lov" />
      <div className="mm-body screen-anim">
        <h1 className="h1" style={{ marginTop: 4 }}>To'lov</h1>

        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <div className="row between center-x">
            <div><div className="small">Tanlangan reja</div><div className="sans-title" style={{ marginTop: 2 }}>{plan.name}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 700 }}>{plan.price}</div><div className="small">so'm{plan.per}</div></div>
          </div>
        </div>

        <p className="sans-title" style={{ fontSize: 15, marginTop: 22 }}>To'lov usuli</p>
        <div style={{ marginTop: 12 }}>
          {window.PAY_METHODS.map((m) => (
            <button key={m.id} onClick={() => setApp({ payMethod: m.id })} className={"opt" + (method === m.id ? " on" : "")}>
              <span style={{ width: 42, height: 30, borderRadius: 8, background: "var(--neutral-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "var(--ink-2)", flexShrink: 0 }}>{m.label[0]}</span>
              <div className="opt-main"><div className="t">{m.label}</div></div>
              <span className="opt-radio" />
            </button>
          ))}
        </div>

        {err && (
          <div style={{ marginTop: 6, padding: 14, borderRadius: 14, background: "var(--accent-tint)", border: "1px solid var(--accent)", display: "flex", gap: 10 }}>
            <span style={{ color: "var(--accent)", marginTop: 1 }}><Icon name="info" size={18} /></span>
            <span style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.4 }}>To'lov amalga oshmadi. Iltimos, boshqa to'lov usulini tanlang yoki qayta urinib ko'ring.</span>
          </div>
        )}

        <div className="row gap10 center-x" style={{ marginTop: 18, justifyContent: "center", color: "var(--ink-3)" }}>
          <Icon name="lock" size={15} /><span className="small">To'lovlar xavfsiz shifrlanadi</span>
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind="primary" icon="lock" onClick={() => { setApp({ premium: true }); go("success"); }}>{plan.price} so'm to'lash</Btn>
        <Btn kind="ghost" onClick={() => setErr((v) => !v)} style={{ marginTop: 0, fontSize: 13 }}>{err ? "Xatolikni yashirish" : "Xatolik holatini ko'rish"}</Btn>
      </div>
    </div>
  );
}

/* ============ SUCCESS ============ */
function SuccessScreen({ go }) {
  return (
    <div className="mm-screen">
      <div className="mm-body center screen-anim" style={{ alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", animation: "mm-pop .5s cubic-bezier(.32,.72,0,1)" }}>
          <Icon name="check" size={48} />
        </div>
        <h1 className="h1" style={{ marginTop: 24 }}>Premium faollashdi</h1>
        <p className="body" style={{ marginTop: 10, maxWidth: 280 }}>Endi cheklovsiz obraz, realistik rasm va PDF hisobot ochiq.</p>
      </div>
      <div className="mm-footer">
        <Btn kind="primary" icon="doc" onClick={() => go("pdf")}>PDF hisobotni ko'rish</Btn>
        <Btn kind="ghost" onClick={() => go("outfits")} style={{ marginTop: 0 }}>Obrazlarga qaytish</Btn>
      </div>
    </div>
  );
}

/* ============ PDF REPORT ============ */
function PdfScreen({ go, back }) {
  const P = window.PROFILE;
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="PDF hisobot" />
      <div className="mm-body screen-anim">
        <h1 className="h1" style={{ marginTop: 4 }}>Stil hisobotingiz</h1>
        <p className="body" style={{ marginTop: 6 }}>Saqlab qo'ying yoki ulashing — to'liq shaxsiy stil profili.</p>

        {/* document preview */}
        <div style={{ marginTop: 18, background: "#fff", borderRadius: 14, boxShadow: "0 18px 40px -18px rgba(0,0,0,.3)", border: "1px solid var(--line)", overflow: "hidden" }}>
          <div style={{ background: "var(--accent)", padding: "18px 18px 16px", color: "#fff" }}>
            <Wordmark light />
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 600, marginTop: 14 }}>Shaxsiy stil hisoboti</div>
            <div style={{ fontSize: 12, opacity: .8, marginTop: 2 }}>2026-yil iyun · Menga Mos AI</div>
          </div>
          <div style={{ padding: 18 }}>
            <div className="eyebrow">Stil profili</div>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, margin: "4px 0 0" }}>{P.description}</p>

            <div className="eyebrow" style={{ marginTop: 18 }}>Rang palitrasi</div>
            <div className="row gap6" style={{ marginTop: 6 }}>
              {[...P.best, ...P.accent].map((c) => <span key={c.name} style={{ width: 30, height: 30, borderRadius: 7, background: c.hex, border: "1px solid var(--line-2)" }} />)}
            </div>

            <div className="eyebrow" style={{ marginTop: 18 }}>Obrazlar</div>
            <div className="row gap8" style={{ marginTop: 6 }}>
              {window.OUTFITS.map((o) => (
                <div key={o.id} style={{ flex: 1 }}>
                  <div className="garment" style={{ aspectRatio: "3/4", borderRadius: 9 }}><Garment name={o.glyph} size="48%" /></div>
                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: "var(--ink-2)" }}>{o.name}</div>
                </div>
              ))}
            </div>

            <div className="eyebrow" style={{ marginTop: 18 }}>Xarid ro'yxati</div>
            <div style={{ marginTop: 6 }}>
              {window.PRODUCTS.slice(0, 3).map((p) => (
                <div key={p.id} className="row between" style={{ padding: "6px 0", borderBottom: "1px solid var(--line)", fontSize: 12 }}>
                  <span style={{ color: "var(--ink-2)" }}>{p.title} · {p.brand}</span>
                  <span style={{ fontWeight: 700 }}>{p.price}</span>
                </div>
              ))}
              <div className="row between" style={{ padding: "8px 0 0", fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>Umumiy</span>
                <span style={{ fontWeight: 700, color: "var(--accent)" }}>1 093 000 so'm</span>
              </div>
            </div>

            <div className="neutral-block" style={{ padding: 12, marginTop: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink)" }}>Garderob maslahati</div>
              <p style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.45, margin: "4px 0 0" }}>Neytral asosni 2–3 ta sifatli accent bilan to'ldiring — bir nechta obraz bitta garderobdan chiqadi.</p>
            </div>
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <div className="row gap10">
          <Btn kind="primary" icon="download" style={{ flex: 1 }}>Yuklab olish</Btn>
          <Btn kind="secondary" icon="share" style={{ flex: 1 }}>Ulashish</Btn>
        </div>
        <Btn kind="ghost" onClick={() => go("home")} style={{ marginTop: 2 }}>Bosh sahifaga</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { PremiumScreen, PaymentScreen, SuccessScreen, PdfScreen });
