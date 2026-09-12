import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { ANTON, MONTSERRAT } from "../lib/fonts";
import { COLORS, TEXT_SHADOW } from "../lib/theme";
import { BRoll } from "../overlays/BRoll";
import { BEAT_TIMING, ELEMENT_FRAMES, type BeatKey } from "./lib/beats";
import { BROLL } from "./lib/broll";
import { frameAt } from "./lib/constants";

/* ------------------------------------------------------------------------
   MOTION DESIGN INÉDITO — "Reels 34" (marketing não é muro)

   ETAPA 9 do PLAYBOOK-2 — o verbo primeiro, a forma depois:
     muro       · ENXERGAR COMO (cobrir)  → fileira de unidades (tijolos)
     veReal     · VER vs NÃO VER          → split / versus (olho aberto / fechado)
     muroSobe   · SUBIR cada dia          → medida crescente (fileiras + dias)
     otimizacao · OTIMIZAR sem ser visto  → interface familiar (painel de anúncios)
     pagina     · DIGITAR e COBRIR        → campo de entrada (código → página)
   --------------------------------------------------------------------- */

const EASE = Easing.inOut(Easing.ease);
const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = ELEMENT_FRAMES;

const LIFT: CSSProperties = { justifyContent: "center", alignItems: "center", paddingBottom: 700 };

const useEnter = (delay = 0, stiffness = 170, damping = 14): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.6, stiffness } });
};
const useRamp = (a: number, b: number): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [a, b], [0, 1], { ...OUT, easing: EASE });
};
const on = (s: number, k = 2): number => Math.min(1, s * k);

const kicker: CSSProperties = {
  fontFamily: MONTSERRAT, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase",
  fontSize: 22, color: "rgba(255,255,255,0.8)",
};
const display: CSSProperties = { fontFamily: ANTON, letterSpacing: 1, textShadow: TEXT_SHADOW };
const panel: CSSProperties = {
  background: COLORS.panel, border: "3px solid rgba(255,255,255,0.16)", borderRadius: 22,
  boxShadow: "0 22px 60px rgba(0,0,0,0.5)",
};
const TIJOLO = "#B5533A";
const ARGAMASSA = "#E8DCC8";

/** Olho desenhado; `aberto` 1 = aberto, 0 = fechado (pálpebra desce). */
const Olho: React.FC<{ w: number; aberto: number; color: string }> = ({ w, aberto, color }) => {
  const h = w * 0.52;
  return (
    <svg width={w} height={h} viewBox="0 0 100 52">
      <path d="M2 26 Q50 -14 98 26 Q50 66 2 26 Z" fill="none" stroke={color} strokeWidth={6} />
      <circle cx={50} cy={26} r={13 * aberto + 0.01} fill={color} />
      <path d={`M2 26 Q50 ${26 + 40 * (1 - aberto) - 40 * aberto * 0} 98 26`} fill="none" stroke={color} strokeWidth={0} />
      <rect x={0} y={0} width={100} height={26 * (1 - aberto)} fill="rgba(18,18,20,0.92)" />
      {aberto < 0.5 ? <line x1={10} y1={44} x2={90} y2={8} stroke={COLORS.danger} strokeWidth={7} strokeLinecap="round" /> : null}
    </svg>
  );
};

const Check: React.FC<{ size: number; color: string; grow: number }> = ({ size, color, grow }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div style={{ position: "absolute", left: size * 0.12, top: size * 0.48, width: size * 0.34 * grow, height: Math.max(4, size * 0.14), borderRadius: 6, background: color, transform: "rotate(42deg)", transformOrigin: "left center" }} />
    <div style={{ position: "absolute", left: size * 0.33, top: size * 0.66, width: size * 0.58 * grow, height: Math.max(4, size * 0.14), borderRadius: 6, background: color, transform: "rotate(-52deg)", transformOrigin: "left center" }} />
  </div>
);
const Cruz: React.FC<{ size: number; color: string; grow: number }> = ({ size, color, grow }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    {[45, -45].map((deg) => (
      <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", width: size * 0.86 * grow, height: Math.max(4, size * 0.16), borderRadius: size * 0.08, background: color, transform: `translate(-50%, -50%) rotate(${deg}deg)` }} />
    ))}
  </div>
);

/* ================= 1. MURO · FILEIRA DE UNIDADES (tijolos) ================= */
/**
 * "você enxerga MARKETING como se fosse um MURO"
 * VERBO: COBRIR → a palavra MARKETING aparece e, em "como se fosse um muro",
 * doze tijolos voam um a um e a emparedam. O que o cliente vê é o muro.
 */
const MuroBeat: React.FC = () => {
  const palavra = useEnter(E.muro.palavra, 240, 12);
  const tijolos = E.muro.tijolos.map((d) => useEnter(d, 300, 13));
  const rotulo = useEnter(E.muro.rotulo, 260, 12);
  const W = 760;
  const H = 250;
  const cols = 4;
  const rows = 3;
  const bw = W / cols;
  const bh = H / rows;

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(palavra) }}>você enxerga</div>
      <div style={{ position: "relative", width: W, height: H, overflow: "hidden", borderRadius: 6 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...display, fontSize: 124, color: COLORS.white, opacity: on(palavra), transform: `scale(${interpolate(palavra, [0, 1], [0.7, 1])})` }}>
          MARKETING
        </div>
        {tijolos.map((e, i) => {
          const r = rows - 1 - Math.floor(i / cols); // de baixo pra cima
          const c = i % cols;
          const off = r % 2 === 1 ? -bw / 2 : 0; // fileiras ímpares deslocadas meio tijolo
          const extra = r % 2 === 1 && c === cols - 1; // o 5º tijolo fecha a fileira deslocada
          const estilo = (left: number): CSSProperties => ({
            position: "absolute",
            left: left + 3,
            top: r * bh + 3,
            width: bw - 6,
            height: bh - 6,
            borderRadius: 4,
            background: TIJOLO,
            boxShadow: `inset 0 0 0 3px rgba(0,0,0,0.18), 0 0 0 3px ${ARGAMASSA}`,
            opacity: on(e, 3),
            transform: `translateY(${interpolate(e, [0, 1], [-120, 0])}px) scale(${interpolate(e, [0, 1], [1.4, 1])})`,
          });
          return (
            <div key={i}>
              <div style={estilo(c * bw + off)} />
              {extra ? <div style={estilo((c + 1) * bw + off)} /> : null}
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: -8, borderRadius: 6, border: `3px solid ${ARGAMASSA}`, opacity: on(rotulo) * 0.7 }} />
      </div>
      <div style={{ ...display, fontSize: 60, color: COLORS.white, marginTop: 22, letterSpacing: 6, opacity: on(rotulo), transform: `translateY(${interpolate(rotulo, [0, 1], [16, 0])}px)` }}>= MURO</div>
    </AbsoluteFill>
  );
};

/* ================= 2. VÊ / NÃO VÊ · SPLIT / VERSUS ================= */
/**
 * "só o que ela está VENDO é REAL, aquilo que ela NÃO VÊ NÃO É REAL"
 * VERBO: VER vs NÃO VER → dois painéis: olho aberto → "real" com check;
 * olho que FECHA → "não é real" com a cruz. Cada metade entra quando é dita.
 */
const VeRealBeat: React.FC = () => {
  const a = useEnter(E.veReal.painelA, 200, 14);
  const olhoA = useEnter(E.veReal.olhoA, 240, 13);
  const realA = useEnter(E.veReal.realA, 320, 11);
  const b = useEnter(E.veReal.painelB, 200, 14);
  const fecha = useRamp(E.veReal.olhoB, E.veReal.olhoB + 10);
  const realB = useEnter(E.veReal.realB, 320, 11);

  const Painel: React.FC<{ s: number; dx: number; borda: string; children: ReactNode }> = ({ s, dx, borda, children }) => (
    <div style={{ ...panel, border: `3px solid ${borda}`, width: 486, padding: "22px 22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: on(s), transform: `translateX(${interpolate(s, [0, 1], [dx, 0])}px)` }}>{children}</div>
  );

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(a) }}>programadas a entender</div>
      <div style={{ display: "flex", gap: 20 }}>
        <Painel s={a} dx={-120} borda="rgba(48,209,88,0.7)">
          <div style={{ ...kicker, fontSize: 18, color: COLORS.success }}>o que ela vê</div>
          <div style={{ opacity: on(olhoA), transform: `scale(${interpolate(olhoA, [0, 1], [0.6, 1])})` }}>
            <Olho w={170} aberto={1} color={COLORS.white} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, height: 60, opacity: on(realA), transform: `scale(${interpolate(realA, [0, 1], [1.6, 1])})` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.success, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={30} color="#fff" grow={on(realA, 1.5)} /></div>
            <div style={{ ...display, fontSize: 56, color: COLORS.white, lineHeight: 1 }}>real</div>
          </div>
        </Painel>
        <Painel s={b} dx={120} borda="rgba(255,59,48,0.7)">
          <div style={{ ...kicker, fontSize: 18, color: COLORS.danger }}>o que não vê</div>
          <div><Olho w={170} aberto={1 - fecha} color={COLORS.white} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, height: 60, opacity: on(realB), transform: `scale(${interpolate(realB, [0, 1], [1.6, 1])})` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.danger, display: "flex", alignItems: "center", justifyContent: "center" }}><Cruz size={26} color="#fff" grow={on(realB, 1.5)} /></div>
            <div style={{ ...display, fontSize: 56, color: COLORS.white, lineHeight: 1, whiteSpace: "nowrap" }}>não é real</div>
          </div>
        </Painel>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 3. MURO SOBE · MEDIDA CRESCENTE ================= */
/**
 * "o cliente consegue ver o muro SUBINDO CADA DIA que passa"
 * VERBO: SUBIR → o muro ganha uma fileira por dia; o contador de dias e o
 * olho do cliente acompanham. A medida que cresce é o muro.
 */
const MuroSobeBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const base = useEnter(E.muroSobe.base, 200, 14);
  const olho = useEnter(E.muroSobe.olho, 240, 13);
  const fileiras = E.muroSobe.fileiras.map((d) => useEnter(d, 300, 13));
  const dia = E.muroSobe.fileiras.filter((d) => frame >= d).length;
  const W = 620;
  const bh = 34;

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(base) }}>o cliente vê</div>
      <div style={{ ...panel, width: 860, padding: "22px 30px 20px", display: "flex", gap: 26, alignItems: "flex-end", opacity: on(base), transform: `translateY(${interpolate(base, [0, 1], [34, 0])}px)` }}>
        <div style={{ position: "relative", width: W, height: bh * 6 + 12, borderBottom: `6px solid ${ARGAMASSA}` }}>
          {fileiras.map((e, i) => {
            const bricks = 5;
            const off = i % 2 === 1;
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 6 + i * bh, height: bh - 4, display: "flex", gap: 4, opacity: on(e, 3), transform: `translateY(${interpolate(e, [0, 1], [-60, 0])}px)`, paddingLeft: off ? W / bricks / 2 : 0, overflow: "hidden" }}>
                {Array.from({ length: bricks + 1 }).map((_, k) => (
                  <div key={k} style={{ width: W / bricks - 4, flex: "none", height: "100%", borderRadius: 3, background: TIJOLO, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.18)" }} />
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 150 }}>
          <div style={{ opacity: on(olho) }}><Olho w={90} aberto={1} color={COLORS.success} /></div>
          <div style={{ ...kicker, fontSize: 16, letterSpacing: 3, color: "rgba(255,255,255,0.65)" }}>dia</div>
          <div style={{ ...display, fontSize: 84, lineHeight: 1, color: COLORS.white }}>{dia}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 4. OTIMIZAÇÃO · INTERFACE FAMILIAR ================= */
/**
 * "não vai conseguir ver a campanha sendo OTIMIZADA, ele vai sentir os RESULTADOS"
 * VERBO: OTIMIZAR sem ser visto → um painel de anúncios com os controles se
 * mexendo, apagado e com o selo "não vê"; ao lado, o RESULTADO nítido e
 * grande — é só isso que o cliente sente.
 */
const OtimizacaoBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const painel = useEnter(E.otimizacao.painel, 200, 14);
  const sliders = E.otimizacao.sliders.map((d) => useEnter(d, 240, 13));
  const selo = useEnter(E.otimizacao.selo, 320, 10);
  const resultado = useEnter(E.otimizacao.resultado, 300, 11);
  const apaga = interpolate(frame, [E.otimizacao.selo, E.otimizacao.selo + 10], [1, 0.38], OUT);
  const pct = Math.round(interpolate(frame, [E.otimizacao.resultado, E.otimizacao.resultado + 20], [0, 38], OUT));

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(painel) }}>a campanha</div>
      <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
        <div style={{ ...panel, width: 560, padding: "20px 22px", position: "relative", opacity: on(painel) * apaga, transform: `translateY(${interpolate(painel, [0, 1], [34, 0])}px)` }}>
          <div style={{ ...kicker, fontSize: 15, letterSpacing: 3, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>gerenciador de anúncios</div>
          {["público", "lance", "criativo"].map((l, i) => {
            const e = sliders[i];
            const t = (frame - E.otimizacao.sliders[i]) / 30;
            const pos = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.2 + i));
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, opacity: on(e), transform: `translateX(${interpolate(e, [0, 1], [40, 0])}px)` }}>
                <div style={{ ...kicker, fontSize: 16, letterSpacing: 2, width: 110, color: COLORS.white }}>{l}</div>
                <div style={{ flex: 1, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.14)", position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pos * 100}%`, borderRadius: 6, background: COLORS.blue }} />
                  <div style={{ position: "absolute", top: -8, left: `calc(${pos * 100}% - 14px)`, width: 28, height: 28, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ ...panel, width: 300, border: `3px solid ${COLORS.success}`, padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: on(resultado), transform: `scale(${interpolate(resultado, [0, 1], [0.6, 1])})` }}>
          <div style={{ ...kicker, fontSize: 15, letterSpacing: 3, color: COLORS.success }}>ele sente</div>
          <div style={{ ...display, fontSize: 84, lineHeight: 1, color: COLORS.success }}>+{pct}%</div>
          <div style={{ ...kicker, fontSize: 16, color: COLORS.white }}>resultados</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 130, top: "50%", marginTop: -330, padding: "8px 18px", borderRadius: 10, border: `5px solid ${COLORS.danger}`, color: COLORS.danger, ...display, textShadow: "none", fontSize: 40, background: "rgba(0,0,0,0.5)", opacity: on(selo, 3), transform: `rotate(-10deg) scale(${interpolate(selo, [0, 1], [2, 1])})` }}>
        não vê
      </div>
    </AbsoluteFill>
  );
};

/* ================= 5. PÁGINA · CAMPO DE ENTRADA ================= */
/**
 * "todo o CÓDIGO… na hora de desenvolver a PÁGINA, ele vai ver a página,
 *  mas não vai ver o TRABALHO sendo feito"
 * VERBO: DIGITAR e COBRIR → linhas de código são digitadas com cursor;
 * em "ele vai ver a página" a janela do site desliza por cima; em "não vai
 * ver o trabalho" o código atrás some de vez.
 */
const CODIGO = ["<header>", "  <nav/>", "</header>", "<section>", "  <h1>", "  <form>", "</section>", "<footer/>"];
const PaginaBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const codigo = useEnter(E.pagina.codigo, 200, 14);
  const linhas = E.pagina.linhas.map((d) => useEnter(d, 400, 12));
  const pagina = useEnter(E.pagina.pagina, 190, 15);
  const some = useRamp(E.pagina.some, E.pagina.some + 10);
  const selo = useEnter(E.pagina.selo, 320, 10);
  const caret = frame % 14 < 8 ? 1 : 0;
  const digitando = frame < E.pagina.pagina;

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(codigo) }}>desenvolver a página</div>
      <div style={{ position: "relative", width: 820, height: 420 }}>
        <div style={{ ...panel, position: "absolute", left: 0, top: 0, width: 620, padding: "18px 22px", background: "rgba(10,12,18,0.94)", opacity: on(codigo) * (1 - some), transform: `translateY(${interpolate(codigo, [0, 1], [34, 0])}px)` }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[COLORS.danger, COLORS.accent, COLORS.success].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
          </div>
          {CODIGO.map((l, i) => (
            <div key={i} style={{ fontFamily: "Consolas, monospace", fontSize: 28, lineHeight: "36px", color: i % 3 === 1 ? COLORS.accent : "#9CDCFE", whiteSpace: "pre", opacity: on(linhas[i], 3) }}>
              {l}
              {i === linhas.filter((x) => x > 0.01).length - 1 && digitando ? <span style={{ opacity: caret, color: "#fff" }}>▍</span> : null}
            </div>
          ))}
        </div>
        <div style={{ ...panel, position: "absolute", right: 0, top: 30, width: 560, height: 360, overflow: "hidden", background: "#F6F7FB", border: "4px solid rgba(255,255,255,0.9)", opacity: on(pagina, 3), transform: `translateX(${interpolate(pagina, [0, 1], [700, 0])}px)` }}>
          <div style={{ height: 40, background: "#E4E7EE", display: "flex", alignItems: "center", gap: 8, padding: "0 14px" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} /><div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} /><div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
            <div style={{ flex: 1, height: 20, borderRadius: 10, background: "#fff", marginLeft: 10 }} />
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ height: 30, width: "60%", borderRadius: 8, background: "#1A1A2E", marginBottom: 14 }} />
            <div style={{ height: 14, width: "90%", borderRadius: 7, background: "#C9CEDB", marginBottom: 8 }} />
            <div style={{ height: 14, width: "75%", borderRadius: 7, background: "#C9CEDB", marginBottom: 20 }} />
            <div style={{ height: 52, width: 200, borderRadius: 12, background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", ...kicker, fontSize: 16, color: "#fff" }}>comprar</div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 90, borderRadius: 12, background: "#DCE0EA" }} />)}
            </div>
          </div>
          <div style={{ position: "absolute", left: 16, bottom: 14, ...kicker, fontSize: 15, color: "#1A1A2E", opacity: 0.8 }}>ele vê a página</div>
        </div>
        <div style={{ position: "absolute", left: 20, top: 150, padding: "8px 18px", borderRadius: 10, border: `5px solid ${COLORS.danger}`, color: COLORS.danger, ...display, textShadow: "none", fontSize: 38, background: "rgba(0,0,0,0.55)", whiteSpace: "nowrap", opacity: on(selo, 3), transform: `rotate(-8deg) scale(${interpolate(selo, [0, 1], [2, 1])})` }}>
          trabalho: não vê
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ wrapper */

const BEATS: Partial<Record<BeatKey, React.FC>> = {
  muro: MuroBeat,
  veReal: VeRealBeat,
  muroSobe: MuroSobeBeat,
  otimizacao: OtimizacaoBeat,
  pagina: PaginaBeat,
};

const BeatScrim: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = Math.min(interpolate(frame, [0, 8], [0, 1], OUT), interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], OUT));
  return <AbsoluteFill style={{ opacity: o, background: "radial-gradient(125% 95% at 50% 40%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.64) 100%)" }} />;
};

const ExitFade: React.FC<{ children: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], { ...OUT, easing: EASE });
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${1 + (1 - o) * 0.05})` }}>{children}</AbsoluteFill>;
};

export const Overlays: React.FC = () => (
  <Sequence name="MOTION DESIGN" layout="none">
    {BEAT_TIMING.map(({ key, from, to }) => {
      const Comp = BEATS[key];
      const clip = BROLL.find((c) => c.key === key);
      if (!Comp && !clip) return null;
      const scrim = Boolean(Comp) && clip?.layout !== "full";
      return (
        <Sequence key={key} from={frameAt(from)} durationInFrames={frameAt(to) - frameAt(from)} name={`beat:${key}`}>
          {scrim ? <BeatScrim /> : null}
          <ExitFade>
            {clip ? <BRoll clip={clip} /> : null}
            {Comp ? (
              <CameraMotionBlur shutterAngle={150} samples={6}>
                <Comp />
              </CameraMotionBlur>
            ) : null}
          </ExitFade>
        </Sequence>
      );
    })}
  </Sequence>
);
