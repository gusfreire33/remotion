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
   MOTION DESIGN INÉDITO — "Reels 35" (as três perguntas)

   ETAPA 9 do PLAYBOOK-2 — o verbo primeiro, a forma depois:
     roubadas        · ROUBAR              → fileira de unidades (3 cartas mudam de caixa)
     relatorios      · PERDER TEMPO        → contadores / barras (relógio escorre, pilha sobe)
     ontemHojeAmanha · RESPONDER as 3      → lista com estado
     feito3          · VER em 3 tempos     → split (3 painéis)
     projetar        · PROJETAR (carimbar) → selo / carimbo
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

const Check: React.FC<{ size: number; color: string; grow: number }> = ({ size, color, grow }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div style={{ position: "absolute", left: size * 0.12, top: size * 0.48, width: size * 0.34 * grow, height: Math.max(4, size * 0.14), borderRadius: 6, background: color, transform: "rotate(42deg)", transformOrigin: "left center" }} />
    <div style={{ position: "absolute", left: size * 0.33, top: size * 0.66, width: size * 0.58 * grow, height: Math.max(4, size * 0.14), borderRadius: 6, background: color, transform: "rotate(-52deg)", transformOrigin: "left center" }} />
  </div>
);

/** Parede de tijolos pequena (pra carta e pro carimbo). */
const Parede: React.FC<{ w: number; h: number; opacity?: number }> = ({ w, h, opacity = 1 }) => {
  const rows = 4;
  const cols = 4;
  const bw = w / cols;
  const bh = h / rows;
  return (
    <div style={{ width: w, height: h, position: "relative", overflow: "hidden", borderRadius: 6, opacity }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols + 1 }).map((__, c) => (
          <div key={`${r}-${c}`} style={{ position: "absolute", left: c * bw - (r % 2 ? bw / 2 : 0) + 2, top: r * bh + 2, width: bw - 4, height: bh - 4, borderRadius: 3, background: TIJOLO, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.18)" }} />
        )),
      )}
    </div>
  );
};

/* ================= 1. ROUBADAS · FILEIRA DE UNIDADES ================= */
/**
 * "foram ROUBADAS no mundo da ENGENHARIA DO SOFTWARE e ADAPTADAS"
 * VERBO: ROUBAR → três cartas "?" nascem na caixa "engenharia de software"
 * e, em "adaptadas", saem uma a uma pra caixa "seu negócio".
 */
const RoubadasBeat: React.FC = () => {
  const caixa = useEnter(E.roubadas.caixa, 200, 14);
  const cartas = E.roubadas.cartas.map((d) => useEnter(d, 280, 12));
  const rotulo = useEnter(E.roubadas.rotulo, 260, 12);
  const saem = E.roubadas.saem.map((d) => useRamp(d, d + 12));
  const destino = useEnter(E.roubadas.destino, 260, 12);

  const Caixa: React.FC<{ s: number; titulo: string; cor: string; children?: ReactNode }> = ({ s, titulo, cor, children }) => (
    <div style={{ ...panel, width: 470, height: 250, border: `3px dashed ${cor}`, position: "relative", opacity: on(s), transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)` }}>
      <div style={{ ...kicker, fontSize: 15, letterSpacing: 3, color: cor, position: "absolute", top: 12, left: 0, right: 0, textAlign: "center" }}>{titulo}</div>
      {children}
    </div>
  );

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(caixa) }}>foram roubadas</div>
      <div style={{ position: "relative", width: 1000, height: 250 }}>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: on(rotulo) }}>
          <Caixa s={caixa} titulo="engenharia de software" cor="rgba(255,255,255,0.45)" />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Caixa s={caixa} titulo="" cor="transparent" />
        </div>
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <Caixa s={destino} titulo="seu negócio" cor={COLORS.accent} />
        </div>
        {cartas.map((e, i) => {
          const x = 40 + i * 130 + saem[i] * 530;
          const y = 60 + Math.sin(saem[i] * Math.PI) * -70;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 120,
                height: 160,
                borderRadius: 14,
                background: saem[i] > 0.5 ? COLORS.accent : "#F4EFE1",
                boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...display,
                textShadow: "none",
                fontSize: 84,
                color: "#1A1A1A",
                opacity: on(e, 3),
                transform: `rotate(${-6 + i * 6 + saem[i] * 8}deg) scale(${interpolate(e, [0, 1], [0.5, 1])})`,
              }}
            >
              ?
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================= 2. RELATÓRIOS · CONTADORES / BARRAS ================= */
/**
 * "ao invés de PERDER SEU TEMPO diagramando e enviando relatórios"
 * VERBO: PERDER TEMPO → um relógio cujo arco ESCORRE enquanto folhas de
 * relatório empilham uma a uma. O tempo desce, a pilha sobe.
 */
const RelatoriosBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const relogio = useEnter(E.relatorios.relogio, 200, 14);
  const folhas = E.relatorios.folhas.map((d) => useEnter(d, 280, 12));
  const rotulo = useEnter(E.relatorios.rotulo, 260, 12);
  const gasto = interpolate(frame, [4, 46], [0, 1], { ...OUT, easing: Easing.linear });
  const R = 70;
  const C = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(relogio) }}>perder seu tempo</div>
      <div style={{ ...panel, width: 800, padding: "24px 32px", display: "flex", alignItems: "center", gap: 36, opacity: on(relogio), transform: `translateY(${interpolate(relogio, [0, 1], [34, 0])}px)` }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <svg width={180} height={180} viewBox="0 0 180 180">
            <circle cx={90} cy={90} r={R} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={16} />
            <circle cx={90} cy={90} r={R} fill="none" stroke={gasto > 0.7 ? COLORS.danger : COLORS.accent} strokeWidth={16} strokeDasharray={C} strokeDashoffset={C * gasto} strokeLinecap="round" transform="rotate(-90 90 90)" />
            <line x1={90} y1={90} x2={90 + 48 * Math.sin(gasto * 2 * Math.PI)} y2={90 - 48 * Math.cos(gasto * 2 * Math.PI)} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            <circle cx={90} cy={90} r={7} fill="#fff" />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, textAlign: "center", ...kicker, fontSize: 14, letterSpacing: 2, color: "rgba(255,255,255,0.6)" }}>tempo</div>
        </div>
        <div style={{ flex: 1, position: "relative", height: 200 }}>
          {folhas.map((e, i) => (
            <div key={i} style={{ position: "absolute", left: 20 + i * 6, bottom: i * 26, width: 320, height: 120, borderRadius: 8, background: "#F4EFE1", boxShadow: "0 8px 20px rgba(0,0,0,0.45)", padding: "14px 16px", opacity: on(e, 3), transform: `translateY(${interpolate(e, [0, 1], [-80, 0])}px) rotate(${-2 + i * 1.2}deg)` }}>
              <div style={{ height: 10, width: "55%", borderRadius: 5, background: "rgba(26,26,26,0.7)", marginBottom: 10 }} />
              {[0.9, 0.75, 0.82].map((w, k) => <div key={k} style={{ height: 7, width: `${w * 100}%`, borderRadius: 4, background: "rgba(26,26,26,0.22)", marginBottom: 7 }} />)}
            </div>
          ))}
          <div style={{ position: "absolute", right: 0, top: 0, ...display, fontSize: 60, color: COLORS.danger, lineHeight: 1, opacity: on(rotulo), transform: `rotate(-8deg) scale(${interpolate(rotulo, [0, 1], [1.8, 1])})` }}>
            {folhas.filter((f) => f > 0.3).length}×
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 3. ONTEM / HOJE / AMANHÃ · LISTA COM ESTADO ================= */
/**
 * "o que eu fiz ONTEM, o que eu fiz HOJE e o que eu farei AMANHÃ"
 * VERBO: RESPONDER → três linhas entram no instante de cada palavra e ganham
 * o estado: ontem ✓ (feito), hoje ● (em andamento), amanhã ○ (a fazer).
 */
const PERGUNTAS = [
  { q: "o que eu fiz", t: "ontem", cor: COLORS.success },
  { q: "o que eu fiz", t: "hoje", cor: COLORS.accent },
  { q: "o que eu farei", t: "amanhã", cor: "rgba(255,255,255,0.85)" },
];
const OntemHojeAmanhaBeat: React.FC = () => {
  const kick = useEnter(E.ontemHojeAmanha.kicker, 210, 14);
  const linhas = E.ontemHojeAmanha.linhas.map((d) => useEnter(d, 250, 13));
  const estados = E.ontemHojeAmanha.estados.map((d) => useEnter(d, 340, 10));

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(kick) }}>as três perguntas</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 860 }}>
        {PERGUNTAS.map((p, i) => {
          const e = linhas[i];
          const s = estados[i];
          return (
            <div key={p.t} style={{ ...panel, display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", opacity: on(e), transform: `translateX(${interpolate(e, [0, 1], [90, 0])}px)` }}>
              <div style={{ width: 62, height: 62, borderRadius: "50%", border: `5px solid ${p.cor}`, background: i === 0 ? p.cor : i === 1 ? "transparent" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", opacity: on(s, 3), transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})` }}>
                {i === 0 ? <Check size={36} color="#fff" grow={on(s, 1.4)} /> : i === 1 ? <div style={{ width: 26, height: 26, borderRadius: "50%", background: p.cor }} /> : null}
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 14 }}>
                <div style={{ ...kicker, fontSize: 20, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>{p.q}</div>
                <div style={{ ...display, fontSize: 60, lineHeight: 1, color: COLORS.white }}>{p.t}</div>
              </div>
              <div style={{ ...kicker, fontSize: 18, color: "rgba(255,255,255,0.4)" }}>{String(i + 1).padStart(2, "0")}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================= 4. FEITO ×3 · SPLIT (3 painéis) ================= */
/**
 * "ele vai ver o que está SENDO FEITO, o que SERÁ FEITO e o que JÁ FOI FEITO"
 * VERBO: VER em três tempos → três colunas entram na ordem falada e cada
 * uma recebe o seu cartão: em andamento (pulsa), a fazer (vazio), feito (check).
 */
const COLUNAS = [
  { t: "sendo feito", cor: COLORS.accent },
  { t: "será feito", cor: "rgba(255,255,255,0.7)" },
  { t: "já foi feito", cor: COLORS.success },
];
const Feito3Beat: React.FC = () => {
  const frame = useCurrentFrame();
  const kick = useEnter(E.feito3.kicker, 210, 14);
  const colunas = E.feito3.colunas.map((d) => useEnter(d, 240, 13));
  const cartoes = E.feito3.cartoes.map((d) => useEnter(d, 300, 11));
  const pulso = 0.5 + 0.5 * Math.sin(frame * 0.35);

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(kick) }}>ele vai ver</div>
      <div style={{ display: "flex", gap: 14 }}>
        {COLUNAS.map((c, i) => {
          const e = colunas[i];
          const k = cartoes[i];
          return (
            <div key={c.t} style={{ ...panel, width: 330, height: 300, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12, border: `3px solid ${c.cor}`, opacity: on(e), transform: `translateY(${interpolate(e, [0, 1], [50, 0])}px)` }}>
              <div style={{ ...kicker, fontSize: 15, letterSpacing: 2, color: c.cor, textAlign: "center" }}>{c.t}</div>
              <div style={{ flex: 1, borderRadius: 14, background: "rgba(255,255,255,0.05)", padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ height: 84, borderRadius: 12, background: i === 1 ? "rgba(255,255,255,0.08)" : c.cor, border: i === 1 ? `3px dashed ${c.cor}` : "none", opacity: on(k, 3) * (i === 0 ? 0.7 + 0.3 * pulso : 1), transform: `translateY(${interpolate(k, [0, 1], [-30, 0])}px)`, display: "flex", alignItems: "center", justifyContent: "center", ...display, textShadow: "none", fontSize: 30, color: i === 1 ? c.cor : "#0B0B0D" }}>
                  {i === 0 ? "em andamento" : i === 1 ? "a fazer" : <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Check size={34} color="#0B0B0D" grow={on(k, 1.4)} />feito</div>}
                </div>
                {[0, 1].map((r) => <div key={r} style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,0.06)", opacity: on(k) * 0.8 }} />)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================= 5. PROJETAR · SELO / CARIMBO ================= */
/**
 * "PROJETASSE ele no SUBCONSCIENTE do teu cliente"
 * VERBO: PROJETAR → um projetor abre o feixe sobre a silhueta da cabeça do
 * cliente e o muro é CARIMBADO dentro dela, em "subconsciente".
 */
const ProjetarBeat: React.FC = () => {
  const cabeca = useEnter(E.projetar.cabeca, 200, 14);
  const projetor = useEnter(E.projetar.projetor, 240, 13);
  const feixe = useRamp(E.projetar.feixe, E.projetar.feixe + 12);
  const carimbo = useEnter(E.projetar.carimbo, 340, 9);
  const rotulo = useEnter(E.projetar.rotulo, 260, 12);

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 20, opacity: on(cabeca) }}>o muro invisível</div>
      <div style={{ position: "relative", width: 960, height: 360 }}>
        {/* projetor */}
        <div style={{ position: "absolute", left: 0, top: 130, width: 150, height: 90, borderRadius: 16, background: "#1C1C22", border: "3px solid rgba(255,255,255,0.3)", opacity: on(projetor), transform: `translateX(${interpolate(projetor, [0, 1], [-60, 0])}px)` }}>
          <div style={{ position: "absolute", right: -22, top: 22, width: 46, height: 46, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 ${20 + feixe * 30}px ${COLORS.accent}` }} />
        </div>
        {/* feixe */}
        <svg width={960} height={360} style={{ position: "absolute", left: 0, top: 0 }}>
          <polygon points={`170,175 ${170 + 500 * feixe},${175 - 150 * feixe} ${170 + 500 * feixe},${175 + 150 * feixe}`} fill="rgba(255,214,10,0.18)" />
        </svg>
        {/* cabeça */}
        <div style={{ position: "absolute", right: 60, top: 10, width: 300, height: 340, opacity: on(cabeca), transform: `translateX(${interpolate(cabeca, [0, 1], [60, 0])}px)` }}>
          <div style={{ position: "absolute", left: 20, top: 0, width: 260, height: 260, borderRadius: "50%", border: "5px solid rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.35)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: on(carimbo, 3), transform: `rotate(-8deg) scale(${interpolate(carimbo, [0, 1], [2.4, 1])})` }}>
              <Parede w={190} h={130} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 90, top: 250, width: 120, height: 90, borderBottom: "none", borderRadius: "0 0 0 0", background: "rgba(255,255,255,0.85)", clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }} />
        </div>
      </div>
      <div style={{ ...display, fontSize: 52, color: COLORS.white, marginTop: 14, letterSpacing: 4, opacity: on(rotulo), transform: `translateY(${interpolate(rotulo, [0, 1], [16, 0])}px)` }}>no subconsciente do cliente</div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ wrapper */

const BEATS: Partial<Record<BeatKey, React.FC>> = {
  roubadas: RoubadasBeat,
  relatorios: RelatoriosBeat,
  ontemHojeAmanha: OntemHojeAmanhaBeat,
  feito3: Feito3Beat,
  projetar: ProjetarBeat,
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
