/* MENGA MOS — main app: nav stack, theme, iPhone frame, tweaks */
const { useState: useS, useEffect: useE } = React;

const SCREENS = {
  home: HomeScreen,
  consent: ConsentScreen,
  upload: UploadScreen,
  survey: SurveyScreen,
  occasion: OccasionScreen,
  style: StyleScreen,
  budget: BudgetScreen,
  extras: ExtrasScreen,
  analyzing: AnalyzingScreen,
  summary: SummaryScreen,
  outfits: OutfitsScreen,
  tryon: TryOnScreen,
  products: ProductsScreen,
  premium: PremiumScreen,
  payment: PaymentScreen,
  success: SuccessScreen,
  pdf: PdfScreen,
};

const RADIUS = { Yumshoq: 18, "O'rtacha": 13, Keskin: 8 };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "bordo",
  "serif": true,
  "radius": "Yumshoq"
}/*EDITMODE-END*/;

function useFit(w, h) {
  const [s, setS] = useS(1);
  useE(() => {
    const calc = () => {
      const W = window.innerWidth || w, H = window.innerHeight || h;
      const next = Math.min(1, (W - 32) / w, (H - 32) / h);
      setS(next > 0.1 ? next : 1);
    };
    calc();
    requestAnimationFrame(calc);
    const tid = setTimeout(calc, 250);
    window.addEventListener("resize", calc);
    return () => { clearTimeout(tid); window.removeEventListener("resize", calc); };
  }, []);
  return s;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stack, setStack] = useS(["home"]);
  const [app, setAppState] = useS({ consent: {}, survey: {}, extras: {} });
  const current = stack[stack.length - 1];
  const scale = useFit(402, 874);

  const go = (id) => {
    if (id === "home") { setStack(["home"]); return; }
    setStack((s) => [...s, id]);
  };
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const setApp = (patch) => setAppState((a) => ({ ...a, ...(typeof patch === "function" ? patch(a) : patch) }));

  const Comp = SCREENS[current] || HomeScreen;
  const dirName = { bordo: "Bordo", atlas: "Atlas", sage: "Sage" }[t.direction] || "Bordo";

  return (
    <div className="mm-stage">
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice>
          <div data-theme={t.direction} data-serif={t.serif ? "on" : "off"}
            style={{ height: "100%", ["--r"]: (RADIUS[t.radius] || 16) + "px" }}>
            <div key={current} style={{ height: "100%" }}>
              <Comp go={go} back={back} app={app} setApp={setApp} />
            </div>
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Vizual yo'nalish" />
        <TweakRadio label="Yo'nalish" value={dirName}
          options={["Bordo", "Atlas", "Sage"]}
          onChange={(v) => setTweak("direction", { Bordo: "bordo", Atlas: "atlas", Sage: "sage" }[v])} />
        <TweakSection label="Uslub" />
        <TweakToggle label="Serif sarlavhalar" value={t.serif} onChange={(v) => setTweak("serif", v)} />
        <TweakRadio label="Burchaklar" value={t.radius}
          options={["Yumshoq", "O'rtacha", "Keskin"]}
          onChange={(v) => setTweak("radius", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
