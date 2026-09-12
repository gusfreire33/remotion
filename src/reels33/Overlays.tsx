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
   MOTION DESIGN INÉDITO — "Reels 33" (recorrência: até concessionária tem)

   ETAPA 9 do PLAYBOOK-2 — o verbo primeiro, a forma depois:
     anos2026   · AVANÇAR no tempo        → ticker / marquee (faixa de anos rola)
     falir      · DESABAR                 → contadores / barras (receita cai)
     naoPermite · NÃO PERMITIR (travar)   → lista com estado (toggle que não vira)
     cada34anos · ESPERAR (1 a cada 4)    → fileira de unidades (4 casas, 2 carros)
     semestral  · REPETIR a cada 6 meses  → medida crescente (degraus)

   Nada aqui veio de vídeo anterior (o Reels 32 usou fileira pra clientes
   apagando; aqui a fileira são ANOS com carro — outro movimento, outra ideia).
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

/** Carrinho desenhado (emoji de carro varia por plataforma; forma na mão). */
const Carro: React.FC<{ w: number; color: string }> = ({ w, color }) => {
  const h = w * 0.46;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.38, height: h * 0.4, borderRadius: h * 0.16, background: color }} />
      <div style={{ position: "absolute", left: w * 0.22, right: w * 0.22, top: 0, height: h * 0.5, borderRadius: `${h * 0.3}px ${h * 0.3}px 0 0`, background: color }} />
      {[0.18, 0.82].map((x) => (
        <div key={x} style={{ position: "absolute", left: w * x - h * 0.16, top: h * 0.66, width: h * 0.32, height: h * 0.32, borderRadius: "50%", background: "#0B0B0D", border: `${Math.max(3, h * 0.07)}px solid ${color}` }} />
      ))}
    </div>
  );
};

/** Cadeado fechado (pequeno, pro toggle bloqueado). */
const Cadeadinho: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <div style={{ position: "absolute", left: "50%", top: 0, width: size * 0.5, height: size * 0.44, border: `${Math.max(3, size * 0.11)}px solid ${color}`, borderBottom: "none", borderRadius: `${size * 0.25}px ${size * 0.25}px 0 0`, transform: "translateX(-50%)" }} />
    <div style={{ position: "absolute", left: "50%", top: size * 0.42, width: size * 0.8, height: size * 0.54, background: color, borderRadius: size * 0.12, transform: "translateX(-50%)" }} />
  </div>
);

/* ================= 1. ANOS 2026 · TICKER / MARQUEE ================= */
/**
 * "em 2026 e nos PRÓXIMOS ANOS"
 * VERBO: AVANÇAR → uma faixa de anos. "2026" cai no centro quando é dito;
 * em "próximos anos" a faixa ROLA pra esquerda e 2027, 2028, 2029 passam.
 */
const ANOS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const Anos2026Beat: React.FC = () => {
  const frame = useCurrentFrame();
  const faixa = useEnter(E.anos2026.faixa, 200, 15);
  const ano = useEnter(E.anos2026.ano, 300, 11);
  const rola = interpolate(frame, [E.anos2026.rola[0], E.anos2026.rola[2] + 8], [0, 3], { ...OUT, easing: EASE });
  const passo = 300;
  const foco = 2 + rola; // índice do ano em foco (2 = 2026)

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(faixa) }}>a real é</div>
      <div
        style={{
          width: 1080,
          height: 200,
          position: "relative",
          overflow: "hidden",
          opacity: on(faixa),
          transform: `scaleY(${interpolate(faixa, [0, 1], [0.2, 1])})`,
          background: "rgba(0,0,0,0.55)",
          borderTop: "3px solid rgba(255,255,255,0.25)",
          borderBottom: "3px solid rgba(255,255,255,0.25)",
        }}
      >
        {ANOS.map((a, i) => {
          const dx = (i - foco) * passo;
          const dist = Math.abs(i - foco);
          const emFoco = Math.max(0, 1 - dist);
          const escala = 0.62 + 0.38 * emFoco;
          const entra = i === 2 ? ano : 1;
          return (
            <div
              key={a}
              style={{
                ...display,
                position: "absolute",
                left: "50%",
                top: 0,
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 128,
                color: emFoco > 0.5 ? COLORS.accent : "rgba(255,255,255,0.45)",
                transform: `translateX(-50%) translateX(${dx}px) translateY(${interpolate(entra, [0, 1], [-160, 0])}px) scale(${escala})`,
                opacity: Math.min(1, entra * 2) * (0.35 + 0.65 * emFoco + (dist > 1.6 ? 0 : 0)),
                whiteSpace: "nowrap",
              }}
            >
              {a}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, background: COLORS.accent, transform: "translateX(-50%)", opacity: 0.5 }} />
      </div>
      <div style={{ ...kicker, marginTop: 20, opacity: interpolate(rola, [0, 0.4], [0, 1], OUT), color: COLORS.white }}>e nos próximos anos</div>
    </AbsoluteFill>
  );
};

/* ================= 2. FALIR · CONTADORES / BARRAS ================= */
/**
 * "você tá fadado a FALIR"
 * VERBO: DESABAR → cinco barras de receita caem uma a uma, da direita pra
 * esquerda, o número vai a zero e a palavra FALIR bate por cima.
 */
const FALIR_ALT = [0.55, 0.7, 0.62, 0.8, 0.9];
const FalirBeat: React.FC = () => {
  const painel = useEnter(E.falir.painel, 200, 14);
  const cai = E.falir.cai.map((d) => useRamp(d, d + 8));
  const palavra = useEnter(E.falir.palavra, 340, 9);
  const caidas = cai.filter((c) => c > 0.5).length;
  const receita = Math.round((1 - caidas / 5) * 100);

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(painel) }}>fadado a</div>
      <div style={{ ...panel, width: 760, padding: "22px 30px 20px", position: "relative", opacity: on(painel), transform: `translateY(${interpolate(painel, [0, 1], [34, 0])}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div style={{ ...kicker, fontSize: 17, letterSpacing: 3, color: "rgba(255,255,255,0.65)" }}>receita</div>
          <div style={{ ...display, fontSize: 52, lineHeight: 1, color: receita === 0 ? COLORS.danger : COLORS.white }}>{receita}%</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 190 }}>
          {FALIR_ALT.map((alt, i) => {
            // as barras desabam da direita pra esquerda
            const c = cai[4 - i];
            return (
              <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", height: `${Math.round(alt * (1 - c) * 100)}%`, minHeight: 6, borderRadius: 10, background: c > 0.5 ? COLORS.danger : "rgba(255,255,255,0.85)", transform: `scaleX(${1 + c * 0.25})` }} />
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...display,
            fontSize: 150,
            color: COLORS.danger,
            letterSpacing: 6,
            opacity: on(palavra, 3),
            transform: `scale(${interpolate(palavra, [0, 1], [2.2, 1])}) rotate(-6deg)`,
          }}
        >
          FALIR
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 3. NÃO PERMITE · LISTA COM ESTADO (toggle) ================= */
/**
 * "o meu modelo de negócio NÃO ME PERMITE pôr uma recorrência"
 * VERBO: NÃO PERMITIR → um painel de "modelo de negócio" com dois
 * interruptores: "pagamento único" ligado; "recorrência" TENTA virar no
 * instante de "permite", volta, e ganha o cadeado. É a objeção em forma.
 */
const NaoPermiteBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const painel = useEnter(E.naoPermite.painel, 200, 14);
  const linhas = E.naoPermite.linhas.map((d) => useEnter(d, 250, 13));
  const trava = useEnter(E.naoPermite.trava, 380, 9);
  const t0 = E.naoPermite.tentativa;
  // o botão tenta ir até 60% do curso e volta batendo
  const tentativa = interpolate(frame, [t0, t0 + 5, t0 + 10, t0 + 13], [0, 0.6, 0, 0.08], { ...OUT, easing: EASE });
  const tremor = frame >= E.naoPermite.trava && frame < E.naoPermite.trava + 8 ? Math.sin((frame - E.naoPermite.trava) * 2.6) * (8 - (frame - E.naoPermite.trava)) * 0.9 : 0;

  const Toggle: React.FC<{ ligado: number; cor: string }> = ({ ligado, cor }) => (
    <div style={{ width: 96, height: 52, borderRadius: 26, background: ligado > 0.5 ? cor : "rgba(255,255,255,0.14)", position: "relative", transition: "none" }}>
      <div style={{ position: "absolute", top: 5, left: 5 + ligado * 44, width: 42, height: 42, borderRadius: "50%", background: "#fff", boxShadow: "0 3px 10px rgba(0,0,0,0.5)" }} />
    </div>
  );

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(painel) }}>meu modelo de negócio</div>
      <div style={{ ...panel, width: 820, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12, opacity: on(painel), transform: `translate(${tremor}px, ${interpolate(painel, [0, 1], [34, 0])}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 18px", borderRadius: 16, background: "rgba(255,255,255,0.05)", opacity: on(linhas[0]), transform: `translateX(${interpolate(linhas[0], [0, 1], [60, 0])}px)` }}>
          <div style={{ ...display, fontSize: 46, color: COLORS.white, flex: 1, lineHeight: 1 }}>pagamento único</div>
          <Toggle ligado={1} cor={COLORS.success} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 18px", borderRadius: 16, background: trava > 0.3 ? "rgba(255,59,48,0.14)" : "rgba(255,255,255,0.05)", border: `3px solid ${trava > 0.3 ? COLORS.danger : "transparent"}`, opacity: on(linhas[1]), transform: `translateX(${interpolate(linhas[1], [0, 1], [60, 0])}px)` }}>
          <div style={{ ...display, fontSize: 46, color: COLORS.white, flex: 1, lineHeight: 1 }}>recorrência</div>
          <div style={{ position: "relative" }}>
            <Toggle ligado={tentativa} cor={COLORS.success} />
            <div style={{ position: "absolute", right: -14, top: -16, opacity: on(trava, 3), transform: `scale(${interpolate(trava, [0, 1], [2, 1])})` }}>
              <Cadeadinho size={40} color={COLORS.danger} />
            </div>
          </div>
        </div>
        <div style={{ ...kicker, fontSize: 18, color: COLORS.danger, alignSelf: "flex-end", paddingRight: 6, opacity: on(trava, 3) }}>não permitido</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================= 4. CADA 3, 4 ANOS · FILEIRA DE UNIDADES ================= */
/**
 * "um brasileiro médio, A CADA 3, 4 ANOS"
 * VERBO: ESPERAR → quatro casas de ano. Um carro na primeira; as três
 * seguintes entram vazias; "3" e "4" acendem quando ditos, e o segundo
 * carro só aparece na quarta casa. O vazio no meio É o intervalo.
 */
const Cada34AnosBeat: React.FC = () => {
  const casas = E.cada34anos.casas.map((d) => useEnter(d, 250, 13));
  const tres = useEnter(E.cada34anos.tres, 320, 11);
  const quatro = useEnter(E.cada34anos.quatro, 320, 11);
  const rotulo = useEnter(E.cada34anos.rotulo, 240, 12);

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(casas[0]) }}>brasileiro médio</div>
      <div style={{ display: "flex", gap: 16 }}>
        {casas.map((e, i) => {
          const comCarro = i === 0 || i === 3;
          const carroOn = i === 0 ? on(e) : on(quatro);
          const num = i === 2 ? on(tres) : i === 3 ? on(quatro) : 1;
          return (
            <div
              key={i}
              style={{
                width: 232,
                height: 230,
                borderRadius: 24,
                background: comCarro && carroOn > 0.5 ? "rgba(255,214,10,0.14)" : "rgba(255,255,255,0.06)",
                border: comCarro && carroOn > 0.5 ? `3px solid ${COLORS.accent}` : "3px dashed rgba(255,255,255,0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                opacity: on(e),
                transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{ height: 76, display: "flex", alignItems: "center", opacity: comCarro ? carroOn : 0, transform: `scale(${comCarro ? interpolate(carroOn, [0, 1], [0.4, 1]) : 0.4})` }}>
                <Carro w={150} color={COLORS.accent} />
              </div>
              <div style={{ ...display, fontSize: 54, lineHeight: 1, color: i >= 2 ? COLORS.white : "rgba(255,255,255,0.55)", opacity: 0.4 + 0.6 * num, transform: `scale(${1 + (i >= 2 ? (1 - num) * 0.6 : 0)})` }}>
                {i === 0 ? "ano 1" : i === 1 ? "ano 2" : i === 2 ? "3" : "4"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ ...kicker, marginTop: 22, color: COLORS.white, opacity: on(rotulo) }}>1 carro a cada 3–4 anos</div>
    </AbsoluteFill>
  );
};

/* ================= 5. SEMESTRAL · MEDIDA CRESCENTE (degraus) ================= */
/**
 * "a recorrência que eles têm é uma recorrência SEMESTRAL"
 * VERBO: REPETIR a cada 6 meses → linha do tempo de 24 meses; em
 * "semestral" a receita SOBE em degraus nos meses 6, 12, 18 e 24.
 */
const SemestralBeat: React.FC = () => {
  const painel = useEnter(E.semestral.painel, 200, 14);
  const linha = useRamp(E.semestral.linha, E.semestral.linha + 16);
  const degraus = E.semestral.degraus.map((d) => useRamp(d, d + 6));
  const rotulo = useEnter(E.semestral.rotulo, 260, 12);
  const W = 760;
  const H = 190;
  const stepX = W / 4;
  const stepY = H / 4.6;
  // caminho em escada
  let d = `M 0 ${H}`;
  let y = H;
  degraus.forEach((s, i) => {
    const x0 = i * stepX;
    const x1 = (i + 1) * stepX;
    d += ` L ${x0 + (x1 - x0) * Math.min(1, s * 1.4)} ${y}`;
    const ny = y - stepY * s;
    d += ` L ${x1} ${ny}`;
    y = ny;
  });

  return (
    <AbsoluteFill style={LIFT}>
      <div style={{ ...kicker, marginBottom: 22, opacity: on(painel) }}>a recorrência deles</div>
      <div style={{ ...panel, width: 840, padding: "22px 40px 16px", opacity: on(painel), transform: `translateY(${interpolate(painel, [0, 1], [34, 0])}px)` }}>
        <svg width={W} height={H + 40} viewBox={`0 0 ${W} ${H + 40}`}>
          <line x1={0} y1={H} x2={W * linha} y2={H} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} opacity={linha > i / 4 ? 1 : 0}>
              <line x1={i * stepX} y1={H - 8} x2={i * stepX} y2={H + 8} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
              <text x={i * stepX} y={H + 34} fill="rgba(255,255,255,0.7)" fontFamily={MONTSERRAT} fontWeight={800} fontSize={18} textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}>
                {i === 0 ? "mês 0" : `${i * 6}`}
              </text>
            </g>
          ))}
          <path d={d} fill="none" stroke={COLORS.success} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
          {degraus.map((s, i) => (
            <circle key={i} cx={(i + 1) * stepX} cy={H - stepY * (i + 1)} r={12 * Math.min(1, s * 1.5)} fill={COLORS.success} opacity={s > 0.7 ? 1 : 0} />
          ))}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
          <div style={{ ...kicker, fontSize: 17, letterSpacing: 3, color: "rgba(255,255,255,0.65)" }}>receita</div>
          <div style={{ ...display, fontSize: 46, lineHeight: 1, color: COLORS.success, opacity: on(rotulo), transform: `translateY(${interpolate(rotulo, [0, 1], [12, 0])}px)` }}>a cada 6 meses</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ wrapper */

const BEATS: Partial<Record<BeatKey, React.FC>> = {
  anos2026: Anos2026Beat,
  falir: FalirBeat,
  naoPermite: NaoPermiteBeat,
  cada34anos: Cada34AnosBeat,
  semestral: SemestralBeat,
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
