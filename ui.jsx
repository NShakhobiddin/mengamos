/* MENGA MOS — shared UI: icons, garment glyphs, primitives */

function Icon({ name, size = 22, stroke = 1.7, style }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    back: <path d="M15 5l-7 7 7 7" {...p} />,
    chevron: <path d="M9 5l7 7-7 7" {...p} />,
    arrow: <g {...p}><path d="M4 12h15" /><path d="M13 6l6 6-6 6" /></g>,
    camera: <g {...p}><path d="M3 8.5A2.5 2.5 0 015.5 6h1.2l1.1-1.8h8.4L17.3 6h1.2A2.5 2.5 0 0121 8.5v9A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5z" /><circle cx="12" cy="13" r="3.4" /></g>,
    image: <g {...p}><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M5 17l4.5-4.5L13 16l3-3 3 3" /></g>,
    shield: <g {...p}><path d="M12 3l7 2.5v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V5.5z" /><path d="M9 12l2 2 4-4.5" /></g>,
    lock: <g {...p}><rect x="5" y="10" width="14" height="10" rx="2.5" /><path d="M8 10V7.5a4 4 0 018 0V10" /></g>,
    check: <path d="M5 12.5l4.5 4.5L19 7" {...p} />,
    sparkle: <g {...p}><path d="M12 3.5l1.8 4.7L18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z" /><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></g>,
    x: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    heart: <path d="M12 20s-7-4.3-9.2-8.3C1.2 8.5 2.6 5.5 5.6 5.5c1.9 0 3.1 1.1 3.9 2.3l.5.8.5-.8c.8-1.2 2-2.3 3.9-2.3 3 0 4.4 3 2.8 6.2C19 15.7 12 20 12 20z" {...p} />,
    star: <path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.9 6.9 19.2 8 13.5l-4.3-4 5.8-.7z" {...p} />,
    starf: <path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.9 6.9 19.2 8 13.5l-4.3-4 5.8-.7z" fill="currentColor" stroke="none" />,
    external: <g {...p}><path d="M14 5h5v5" /><path d="M19 5l-8 8" /><path d="M18 14v4.5A1.5 1.5 0 0116.5 20h-10A1.5 1.5 0 015 18.5v-10A1.5 1.5 0 016.5 7H11" /></g>,
    download: <g {...p}><path d="M12 4v11" /><path d="M7.5 10.5L12 15l4.5-4.5" /><path d="M5 19h14" /></g>,
    refresh: <g {...p}><path d="M19 8a7 7 0 00-12.5-2.5M5 5v3.5h3.5" /><path d="M5 16a7 7 0 0012.5 2.5M19 19v-3.5h-3.5" /></g>,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    crown: <g {...p}><path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13z" /><path d="M5.5 18h13" /></g>,
    sun: <g {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2.5M12 18.5V21M4.2 4.2l1.8 1.8M18 18l1.8 1.8M3 12h2.5M18.5 12H21M4.2 19.8L6 18M18 6l1.8-1.8" /></g>,
    briefcase: <g {...p}><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" /><path d="M8.5 7.5V6A2 2 0 0110.5 4h3A2 2 0 0115.5 6v1.5" /><path d="M3.5 12.5h17" /></g>,
    book: <g {...p}><path d="M5 4.5h9a2 2 0 012 2v13a1.5 1.5 0 00-1.5-1.5H5z" /><path d="M5 4.5v15.5" /></g>,
    wine: <g {...p}><path d="M8 4h8l-.5 5a3.5 3.5 0 01-7 0z" /><path d="M12 12.5V19M9 19.5h6" /></g>,
    plane: <path d="M10.5 3.5l1 7L4 14.5v2l6.5-2 .3 4-2 1.3v1.4l3.2-1 3.2 1v-1.4l-2-1.3.3-4 6.5 2v-2l-7.5-4 1-7z" {...p} />,
    chart: <g {...p}><path d="M4 20h16" /><path d="M7 16v-4M12 16V7M17 16v-6" /></g>,
    shuffle: <g {...p}><path d="M4 7h3.5l9 10H20M4 17h3.5l3-3.4M14 7h6m0 0v-3m0 3v3M16 17h4m0 0v3m0-3v-3" /></g>,
    pen: <g {...p}><path d="M15.5 5.5l3 3L9 18l-4 1 1-4z" /><path d="M14 7l3 3" /></g>,
    palette: <g {...p}><path d="M12 3.5a8.5 8.5 0 100 17h1.5a2 2 0 001.4-3.4 2 2 0 011.4-3.4H19a3 3 0 003-3c0-4-4.9-7.2-10-7.2z" /><circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" /></g>,
    ruler: <g {...p}><rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(0 12 12)" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></g>,
    share: <g {...p}><circle cx="6" cy="12" r="2.5" /><circle cx="17" cy="6" r="2.5" /><circle cx="17" cy="18" r="2.5" /><path d="M8.2 10.8l6.6-3.6M8.2 13.2l6.6 3.6" /></g>,
    info: <g {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="7.8" r="0.4" fill="currentColor" /></g>,
    layers: <g {...p}><path d="M12 4l8 4-8 4-8-4z" /><path d="M4 12l8 4 8-4" /><path d="M4 16l8 4 8-4" /></g>,
    doc: <g {...p}><path d="M7 3.5h7l4 4V20a1.5 1.5 0 01-1.5 1.5h-9.5A1.5 1.5 0 015 20V5A1.5 1.5 0 016.5 3.5z" /><path d="M14 3.5V8h4" /><path d="M8.5 13h7M8.5 16.5h5" /></g>,
    cart: <g {...p}><path d="M3 4h2l2 11h10l2-7H6.5" /><circle cx="9" cy="19" r="1.4" /><circle cx="16" cy="19" r="1.4" /></g>,
    wardrobe: <g {...p}><rect x="5" y="3.5" width="14" height="17" rx="1.5" /><path d="M12 3.5v17M9.5 11v2M14.5 11v2" /></g>,
    eye: <g {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></g>,
    bolt: <path d="M13 3L5 13h5l-1 8 8-10h-5z" {...p} />,
    tag: <g {...p}><path d="M4 4h7l9 9-7 7-9-9z" /><circle cx="8.5" cy="8.5" r="1.3" /></g>,
    grid: <g {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}

/* ---- Garment line-art glyphs for placeholders ---- */
function Garment({ name, size }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };
  const g = {
    shirt: <g {...p}><path d="M16 8l8-3 6 4 8 2-3 7-5-1.5V58H18V16.5L13 18l-3-7z" /><path d="M16 8c0 4 3.5 6 8 6s8-2 8-6" /></g>,
    tshirt: <g {...p}><path d="M16 9l8-3 8 3 8 4-4 7-4-1.5V57H20V18.5L16 20l-4-7z" /><path d="M16 9c0 3.5 3.5 5 8 5s8-1.5 8-5" /></g>,
    trousers: <g {...p}><path d="M16 6h16l1 18 2 32h-9l-2-30-2 30h-9l2-32z" /><path d="M16 6h16" /></g>,
    shoes: <g {...p}><path d="M6 36c0-6 1-12 3-16l5 1 3 6 14 5c6 2 11 3 11 7v3a3 3 0 01-3 3H9a3 3 0 01-3-3z" /><path d="M14 27l-2 4M21 30l-2 4M28 33l-2 4" /></g>,
    knit: <g {...p}><path d="M14 9l10-4 10 4 6 4-3 7-5-2v40H16V18l-5 2-3-7z" /><path d="M14 9c0 4 4.5 6 10 6s10-2 10-6" /><path d="M20 26l8 8M28 26l-8 8" /></g>,
    coat: <g {...p}><path d="M14 7l10-3 10 3 6 5-3 9-4-2v39H15V19l-4 2-3-9z" /><path d="M24 7v50" /><path d="M21 24h-1M27 24h1M21 34h-1M27 34h1" /></g>,
    bag: <g {...p}><path d="M11 20h26l3 34H8z" /><path d="M18 22v-4a6 6 0 0112 0v4" /></g>,
    dress: <g {...p}><path d="M17 7l7-3 7 3 5 4-3 6-3-1.5L36 58H12l6-39.5L15 20l-3-6z" /><path d="M17 7c0 3 3 5 7 5s7-2 7-5" /></g>,
    palette: <g {...p}><path d="M24 7C13 7 5 14 5 24c0 8 6 13 13 13 3 0 4-2 4-4 0-3 2-4 4-4h6c6 0 11-4 11-10C43 11 35 7 24 7z" /><circle cx="15" cy="22" r="2" fill="currentColor" stroke="none" /><circle cx="24" cy="16" r="2" fill="currentColor" stroke="none" /><circle cx="33" cy="22" r="2" fill="currentColor" stroke="none" /></g>,
  };
  return (
    <svg viewBox="0 0 48 64" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>
      {g[name] || g.shirt}
    </svg>
  );
}

/* ---- Primitives ---- */
function TopBar({ onBack, step, skip, onSkip, close, onClose }) {
  return (
    <div className="mm-topbar">
      {onBack ? (
        <button className="mm-iconbtn" onClick={onBack} aria-label="Orqaga"><Icon name="back" size={20} /></button>
      ) : <div style={{ width: 40 }} />}
      <div className="mm-step-label">{step}</div>
      {close ? (
        <button className="mm-iconbtn" onClick={onClose} aria-label="Yopish"><Icon name="x" size={18} /></button>
      ) : skip ? (
        <button className="mm-skip" onClick={onSkip}>{skip}</button>
      ) : <div style={{ width: 40 }} />}
    </div>
  );
}

function Progress({ value }) {
  return <div className="mm-progress"><i style={{ width: `${Math.round(value * 100)}%` }} /></div>;
}

function Screen({ children, className = "", center }) {
  return (
    <div className={"mm-screen " + className}>
      <div className={"mm-body screen-anim " + (center ? "center " : "")} style={center ? { paddingTop: 8 } : { paddingTop: 8 }}>
        {children}
      </div>
    </div>
  );
}

function Btn({ kind = "primary", icon, iconRight, children, onClick, style }) {
  return (
    <button className={"btn btn-" + kind} onClick={onClick} style={style}>
      {icon && <Icon name={icon} size={20} />}
      {children}
      {iconRight && <Icon name={iconRight} size={20} />}
    </button>
  );
}

function GarmentTile({ glyph, ratio = "3 / 4", radius = 16, big, tag }) {
  return (
    <div className="garment" style={{ aspectRatio: ratio, borderRadius: radius }}>
      <Garment name={glyph} size={big ? "46%" : "44%"} />
      {tag && <div style={{ position: "absolute", left: 10, top: 10 }}>{tag}</div>}
    </div>
  );
}

function Stars({ value }) {
  return (
    <span className="row" style={{ gap: 1, color: "var(--gold-deep)" }}>
      <Icon name="starf" size={13} />
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", marginLeft: 3 }}>{value}</span>
    </span>
  );
}

function MatchRing({ value, size = 44 }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth="3"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 700, color: "var(--ink)" }}>
        {value}
      </div>
    </div>
  );
}

function Wordmark({ light }) {
  return (
    <div className="row" style={{ gap: 9, alignItems: "center" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: light ? "rgba(255,255,255,.16)" : "var(--accent)",
        color: light ? "#fff" : "var(--accent-on)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--serif)", fontWeight: 600, fontSize: 18,
      }}>M</div>
      <span style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 20, letterSpacing: "-0.01em", color: light ? "#fff" : "var(--ink)" }}>
        Menga&nbsp;Mos
      </span>
    </div>
  );
}

Object.assign(window, { Icon, Garment, TopBar, Progress, Screen, Btn, GarmentTile, Stars, MatchRing, Wordmark });
