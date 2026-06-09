/* MENGA MOS — screens 2: Occasion · Style · Budget · Extras */

function GridTile({ icon, label, on, onClick }) {
  return (
    <button onClick={onClick} className={"opt" + (on ? " on" : "")} style={{ flexDirection: "column", alignItems: "flex-start", gap: 12, marginBottom: 0, padding: 15, minHeight: 92 }}>
      <span style={{ color: on ? "var(--accent)" : "var(--ink-2)" }}><Icon name={icon} size={24} /></span>
      <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.15 }}>{label}</span>
    </button>
  );
}

/* ============ OCCASION ============ */
function OccasionScreen({ go, back, app, setApp }) {
  const v = app.occasion;
  const sel = (id) => setApp({ occasion: id });
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="2 / 6" />
      <Progress value={2 / 6} />
      <div className="mm-body screen-anim" style={{ paddingTop: 16 }}>
        <p className="eyebrow">Maqsad</p>
        <h1 className="h1">Qayerga kerak?</h1>
        <p className="body" style={{ marginTop: 8 }}>Vaziyatni tanlang — obrazni shunga moslaymiz.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
          {window.OCCASIONS.map((o) => (
            <GridTile key={o.id} icon={o.icon} label={o.label} on={v === o.id} onClick={() => sel(o.id)} />
          ))}
        </div>

        {v === "ozim" && (
          <input autoFocus value={app.customOccasion || ""} onChange={(e) => setApp({ customOccasion: e.target.value })}
            placeholder="Masalan: konsert, intervyu..."
            style={{ width: "100%", marginTop: 14, padding: "15px 16px", borderRadius: 14, border: "1.5px solid var(--accent)", background: "var(--surface)", fontSize: 15, fontFamily: "var(--sans)", color: "var(--ink)", outline: "none" }} />
        )}
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind={v ? "primary" : "secondary"} iconRight="arrow" onClick={() => v && go("style")}
          style={v ? {} : { opacity: .5, pointerEvents: "none" }}>Davom etish</Btn>
      </div>
    </div>
  );
}

/* ============ STYLE ============ */
function StyleScreen({ go, back, app, setApp }) {
  const v = app.style;
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="3 / 6" />
      <Progress value={3 / 6} />
      <div className="mm-body screen-anim" style={{ paddingTop: 16 }}>
        <p className="eyebrow">Stil</p>
        <h1 className="h1">Qaysi yo'nalish<br />sizga yoqadi?</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
          {window.STYLES.filter((s) => !s.ai).map((s) => (
            <button key={s.id} onClick={() => setApp({ style: s.id })}
              className={"opt" + (v === s.id ? " on" : "")} style={{ flexDirection: "column", alignItems: "stretch", gap: 0, marginBottom: 0, padding: 0, overflow: "hidden" }}>
              <div className="garment" style={{ aspectRatio: "16 / 11", borderRadius: 0 }}>
                <Garment name={({ casual: "tshirt", smart: "shirt", business: "coat", street: "tshirt", oldmoney: "coat", minimal: "knit", sport: "tshirt", luxury: "dress", toy: "dress" })[s.id] || "shirt"} size="42%" />
              </div>
              <div style={{ padding: "10px 13px 12px", textAlign: "left" }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{s.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.3 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {window.STYLES.filter((s) => s.ai).map((s) => (
          <button key={s.id} onClick={() => setApp({ style: s.id })}
            className={"opt" + (v === s.id ? " on" : "")} style={{ marginTop: 10, marginBottom: 0 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--accent-tint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="sparkle" size={22} />
            </span>
            <div className="opt-main">
              <div className="t">{s.label}</div>
              <div className="d">{s.desc}</div>
            </div>
            <span className="opt-radio" />
          </button>
        ))}
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind={v ? "primary" : "secondary"} iconRight="arrow" onClick={() => v && go("budget")}
          style={v ? {} : { opacity: .5, pointerEvents: "none" }}>Davom etish</Btn>
      </div>
    </div>
  );
}

/* ============ BUDGET ============ */
function BudgetScreen({ go, back, app, setApp }) {
  const v = app.budget;
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="4 / 6" />
      <Progress value={4 / 6} />
      <div className="mm-body screen-anim" style={{ paddingTop: 16 }}>
        <p className="eyebrow">Byudjet</p>
        <h1 className="h1">Narx oralig'i</h1>
        <p className="body" style={{ marginTop: 8 }}>AI mahsulotlarni shu chegarada qidiradi (so'mda).</p>

        <div style={{ marginTop: 18 }}>
          {window.BUDGETS.map((b) => (
            <button key={b.id} onClick={() => setApp({ budget: b.id })} className={"opt" + (v === b.id ? " on" : "")}>
              <div className="opt-main">
                <div className="t">{b.label}</div>
                <div className="d">{b.desc}</div>
              </div>
              {b.range && <span style={{ fontSize: 13, fontWeight: 600, color: v === b.id ? "var(--accent)" : "var(--ink-2)" }}>{b.range}</span>}
              <span className="opt-radio" />
            </button>
          ))}
        </div>

        {v === "ozim" && (
          <div className="row gap10" style={{ marginTop: 4 }}>
            <input value={app.customBudget || ""} onChange={(e) => setApp({ customBudget: e.target.value })}
              placeholder="Umumiy summa, so'm" inputMode="numeric"
              style={{ flex: 1, padding: "15px 16px", borderRadius: 14, border: "1.5px solid var(--accent)", background: "var(--surface)", fontSize: 15, fontFamily: "var(--sans)", color: "var(--ink)", outline: "none" }} />
          </div>
        )}
        <div className="neutral-block" style={{ padding: 14, marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "var(--ink-3)", marginTop: 1 }}><Icon name="info" size={18} /></span>
          <span className="small" style={{ color: "var(--ink-2)" }}>Kiyim qismlari bo'yicha alohida limit ham qo'ya olasiz — keyingi qadamda.</span>
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind={v ? "primary" : "secondary"} iconRight="arrow" onClick={() => v && go("extras")}
          style={v ? {} : { opacity: .5, pointerEvents: "none" }}>Davom etish</Btn>
      </div>
    </div>
  );
}

/* ============ EXTRAS ============ */
function ExtrasScreen({ go, back, app, setApp }) {
  const ex = app.extras || {};
  const toggle = (id) => setApp({ extras: { ...ex, [id]: !ex[id] } });
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="5 / 6" skip="O'tkazish" onSkip={() => go("analyzing")} />
      <Progress value={5 / 6} />
      <div className="mm-body screen-anim" style={{ paddingTop: 16 }}>
        <p className="eyebrow">Qo'shimcha</p>
        <h1 className="h1">Natijani<br />shaxsiylashtiring</h1>
        <p className="body" style={{ marginTop: 8 }}>Ixtiyoriy — sizga muhim bo'lganini belgilang.</p>

        <div className="chip-wrap" style={{ marginTop: 20 }}>
          {window.EXTRAS.map((e) => (
            <button key={e.id} className={"chip" + (ex[e.id] ? " on" : "")} onClick={() => toggle(e.id)}>
              {ex[e.id] && <Icon name="check" size={15} />}
              {e.label}
            </button>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind="primary" icon="sparkle" onClick={() => go("analyzing")}>AI tahlilni boshlash</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { OccasionScreen, StyleScreen, BudgetScreen, ExtrasScreen, GridTile });
