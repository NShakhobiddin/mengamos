/* MENGA MOS — screens 1: Home · Consent · Upload · Survey */

function Figure({ size = 120, accent }) {
  const col = accent ? "var(--accent)" : "color-mix(in srgb, var(--ink) 26%, transparent)";
  return (
    <svg viewBox="0 0 80 150" width={size * 0.62} height={size} aria-hidden="true">
      <g fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="20" r="11" />
        <path d="M22 54c0-9 8-15 18-15s18 6 18 15l-3 30H25z" />
        <path d="M25 84l-2 60h12l5-46 5 46h12l-2-60" />
        <path d="M24 56l-9 26M56 56l9 26" />
      </g>
    </svg>
  );
}

/* ============ HOME ============ */
function HomeScreen({ go }) {
  return (
    <div className="mm-screen">
      <div className="mm-body screen-anim" style={{ paddingTop: "var(--safe-top)" }}>
        <div className="row between center-x">
          <Wordmark />
          <button className="mm-skip" onClick={() => go("consent")}>Kirish</button>
        </div>

        <div style={{ marginTop: 34 }}>
          <p className="eyebrow">AI shaxsiy stilist</p>
          <h1 className="display">Sizga mos<br />kiyimni<br />topamiz.</h1>
          <p className="lead" style={{ maxWidth: 320 }}>
            Bitta rasm yuklang — AI tashqi ko'rinishingizga mos rang, stil va tayyor obrazlarni yaratadi.
          </p>
        </div>

        {/* before / after demo */}
        <div className="card" style={{ marginTop: 26, padding: 12, borderRadius: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, position: "relative" }}>
            <div className="neutral-block" style={{ aspectRatio: "3/4.2", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Figure size={104} />
              <span className="small" style={{ fontWeight: 600 }}>Oldin</span>
            </div>
            <div style={{ aspectRatio: "3/4.2", borderRadius: 14, background: "var(--accent-tint)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", overflow: "hidden" }}>
              <Figure size={104} accent />
              <span className="small" style={{ fontWeight: 700, color: "var(--accent)" }}>Menga Mos</span>
              <div style={{ position: "absolute", top: 10, right: 10, color: "var(--accent)" }}><Icon name="sparkle" size={18} /></div>
            </div>
          </div>
        </div>

        <div className="row gap8 wrap" style={{ marginTop: 18 }}>
          <span className="tag"><Icon name="shield" size={14} /> Rasm saqlanmaydi</span>
          <span className="tag"><Icon name="sparkle" size={14} /> 3 ta bepul obraz</span>
          <span className="tag"><Icon name="bolt" size={14} /> 30 soniyada</span>
        </div>
      </div>

      <div className="mm-footer">
        <Btn kind="primary" icon="camera" onClick={() => go("consent")}>Rasm yuklash</Btn>
        <Btn kind="ghost" onClick={() => { go("consent"); }} style={{ marginTop: 4 }}>Rasmsiz boshlash</Btn>
      </div>
    </div>
  );
}

/* ============ CONSENT ============ */
function ConsentScreen({ go, back, app, setApp }) {
  const c = app.consent || {};
  const set = (k) => setApp((a) => ({ consent: { ...a.consent, [k]: !a.consent[k] } }));
  const ready = c.use && c.terms;
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="Maxfiylik" />
      <div className="mm-body screen-anim">
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-tint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 6 }}>
          <Icon name="shield" size={28} />
        </div>
        <h1 className="h1" style={{ marginTop: 18 }}>Rasmingiz xavfsiz</h1>
        <p className="body" style={{ marginTop: 10 }}>
          Davom etishdan oldin maxfiylik shartlarini tasdiqlang. Rasmingiz faqat sizga yaxshi tavsiya berish uchun ishlatiladi.
        </p>

        <div className="neutral-block" style={{ padding: 16, marginTop: 18 }}>
          {[
            ["lock", "Faqat stil tahlili uchun ishlatiladi"],
            ["refresh", "Tahlildan so'ng avtomatik o'chiriladi"],
            ["eye", "Doimiy saqlanmaydi va hech kimga ko'rsatilmaydi"],
          ].map(([ic, tx], i) => (
            <div key={i} className="row gap12 center-x" style={{ padding: "8px 0" }}>
              <span style={{ color: "var(--accent)" }}><Icon name={ic} size={20} /></span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{tx}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <button className={"check" + (c.use ? " on" : "")} onClick={() => set("use")}>
            <span className="box">{c.use && <Icon name="check" size={14} style={{ color: "#fff" }} />}</span>
            <span className="ctext">Rasmim <b>faqat stil tavsiyasi</b> uchun ishlatilishiga roziman.</span>
          </button>
          <button className={"check" + (c.terms ? " on" : "")} onClick={() => set("terms")}>
            <span className="box">{c.terms && <Icon name="check" size={14} style={{ color: "#fff" }} />}</span>
            <span className="ctext"><b>Foydalanish shartlari</b> va <b>Maxfiylik siyosati</b>ga roziman.</span>
          </button>
          <button className={"check" + (c.minor ? " on" : "")} onClick={() => set("minor")}>
            <span className="box">{c.minor && <Icon name="check" size={14} style={{ color: "#fff" }} />}</span>
            <span className="ctext">16–17 yoshda bo'lsam, ota-onam / vakilim roziligi bor.</span>
          </button>
        </div>
      </div>
      <div className="mm-footer">
        <Btn kind={ready ? "primary" : "secondary"} iconRight="arrow" onClick={() => ready && go("upload")}
          style={ready ? {} : { opacity: .5, pointerEvents: "none" }}>
          Roziman, davom etish
        </Btn>
        <p className="hint">Roziligingizni istalgan vaqtda bekor qila olasiz.</p>
      </div>
    </div>
  );
}

/* ============ UPLOAD ============ */
function UploadScreen({ go, back }) {
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="1 / 6" />
      <Progress value={1 / 6} />
      <div className="mm-body screen-anim" style={{ paddingTop: 16 }}>
        <h1 className="h1">Rasmingizni yuklang</h1>
        <p className="body" style={{ marginTop: 8 }}>To'liq bo'y ko'ringan, aniq rasm eng yaxshi natija beradi.</p>

        <div style={{ marginTop: 16 }}>
          <image-slot id="mm-photo" shape="rounded" radius="18"
            placeholder="Rasmni tashlang yoki tanlang"
            style={{ width: "100%", aspectRatio: "3 / 4", display: "block" }}></image-slot>
        </div>

        <div className="card" style={{ padding: 14, marginTop: 16 }}>
          {[
            "To'liq bo'y ko'rinsin",
            "Yorug'lik yaxshi bo'lsin",
            "Fon iloji boricha oddiy bo'lsin",
            "Rasm xira bo'lmasin",
          ].map((tx, i) => (
            <div key={i} className="row gap10 center-x" style={{ padding: "6px 0" }}>
              <span style={{ color: "var(--accent)", display: "flex" }}><Icon name="check" size={16} /></span>
              <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{tx}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mm-footer">
        <Btn kind="primary" iconRight="arrow" onClick={() => go("occasion")}>Davom etish</Btn>
        <Btn kind="ghost" onClick={() => go("survey")} style={{ marginTop: 2 }}>Rasmsiz davom etish</Btn>
      </div>
    </div>
  );
}

/* ============ SURVEY (rasmsiz anketa) ============ */
function ChipSingle({ options, value, onChange, getLabel = (o) => o, getId = (o) => o }) {
  return (
    <div className="chip-wrap">
      {options.map((o) => {
        const id = getId(o);
        return (
          <button key={id} className={"chip" + (value === id ? " on" : "")} onClick={() => onChange(id)}>
            {getLabel(o)}
          </button>
        );
      })}
    </div>
  );
}

function SwatchRow({ options, value, onChange }) {
  return (
    <div className="row gap10 wrap">
      {options.map((o) => (
        <button key={o.name} onClick={() => onChange(o.name)} className="col center-x" style={{ gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{
            width: 46, height: 46, borderRadius: 12, background: o.hex,
            border: value === o.name ? "2.5px solid var(--accent)" : "1.5px solid var(--line-2)",
            boxShadow: value === o.name ? "0 0 0 3px var(--accent-tint)" : "none",
            display: "block",
          }} />
          <span style={{ fontSize: 11.5, color: value === o.name ? "var(--ink)" : "var(--ink-3)", fontWeight: 600 }}>{o.name}</span>
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <p className="sans-title" style={{ fontSize: 15, marginBottom: 12 }}>{label}</p>
      {children}
    </div>
  );
}

function SurveyScreen({ go, back, app, setApp }) {
  const s = app.survey || {};
  const set = (k, v) => setApp({ survey: { ...s, [k]: v } });
  const Q = window.QUESTIONNAIRE;
  return (
    <div className="mm-screen">
      <TopBar onBack={back} step="1 / 6" skip="O'tkazib yuborish" onSkip={() => go("occasion")} />
      <Progress value={1 / 6} />
      <div className="mm-body screen-anim" style={{ paddingTop: 16 }}>
        <h1 className="h1">Rasmsiz anketa</h1>
        <p className="body" style={{ marginTop: 8 }}>Bir nechta savol — rasmsiz ham aniq tavsiya beramiz.</p>

        <Field label="Jins"><ChipSingle options={Q.genders} value={s.gender} onChange={(v) => set("gender", v)} /></Field>
        <Field label="Yosh oralig'i"><ChipSingle options={Q.ages} value={s.age} onChange={(v) => set("age", v)} /></Field>
        <Field label="Bo'y (sm)"><ChipSingle options={Q.heights} value={s.height} onChange={(v) => set("height", v)} /></Field>
        <Field label="Kiyim razmeri"><ChipSingle options={Q.sizes} value={s.size} onChange={(v) => set("size", v)} /></Field>
        <Field label="Oyoq kiyim razmeri"><ChipSingle options={Q.shoes} value={s.shoe} onChange={(v) => set("shoe", v)} /></Field>
        <Field label="Teri rangi"><SwatchRow options={Q.skin} value={s.skin} onChange={(v) => set("skin", v)} /></Field>
        <Field label="Soch rangi"><SwatchRow options={Q.hair} value={s.hair} onChange={(v) => set("hair", v)} /></Field>
        <Field label="Kiyim ochiqligi"><ChipSingle options={Q.cover} value={s.cover} onChange={(v) => set("cover", v)} /></Field>
        <div style={{ height: 8 }} />
      </div>
      <div className="mm-footer">
        <Btn kind="primary" iconRight="arrow" onClick={() => go("occasion")}>Davom etish</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, ConsentScreen, UploadScreen, SurveyScreen, Figure, ChipSingle, SwatchRow, Field });
