import type { CSSProperties } from "react";
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
import { secToFrame } from "../lib/constants";
import { CALLOUTS, type Callout, type Line } from "../lib/callouts";
import { TypeIn } from "../components/TypeIn";
import { CardScene } from "../components/CardScene";
import { INTER, SPACE_MONO } from "../lib/fonts";
import { COLORS, GLOW_ORANGE } from "../lib/theme";

/* ------------------------------------------------------------------------
   RENDERIZADORES do mapa `lib/callouts.ts` — estilo VSL "Bilhon-OS".

     over   · texto em typewriter caótico num dos 4 cantos/slots, sobre a pessoa
     chips  · lista acumulando (◉ item) embaixo ou em cima
     steps  · lista com marca grande (R·A·D·A·R, 1·2·3) que persiste
     card   · cartão full-screen (fundo quente + fagulhas + moldura laranja)

   (o `behind` é renderizado por `components/BehindLayer.tsx`, porque fica
   numa camada diferente — entre o vídeo e o recorte da pessoa)
   --------------------------------------------------------------------- */

const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.inOut(Easing.ease);

/** posição de cada slot na tela 1920x1080 (pessoa centralizada) */
const SLOT: Record<string, CSSProperties> = {
  tl: { left: 80, top: 180, width: 800, alignItems: "flex-start", textAlign: "left" },
  tr: { right: 80, top: 180, width: 800, alignItems: "flex-end", textAlign: "right" },
  top: { left: 0, right: 0, top: 44, alignItems: "center", textAlign: "center" },
  chest: { left: 0, right: 0, top: 680, alignItems: "center", textAlign: "center" },
};

const SIZE: Record<string, { sans: number; mono: number }> = {
  tl: { sans: 48, mono: 76 },
  tr: { sans: 48, mono: 76 },
  top: { sans: 42, mono: 64 },
  chest: { sans: 44, mono: 68 },
};

/** frames (relativos ao início do evento) em que a linha começa a escrever */
export const lineDelay = (from: number, line: Line): number =>
  Math.max(0, secToFrame((line.at ?? from) - from));

export const Lines: React.FC<{
  from: number;
  to: number;
  lines: Line[];
  sizes: { sans: number; mono: number };
  align?: "center" | "flex-start" | "flex-end";
}> = ({ from, to, lines, sizes, align = "center" }) => {
  const dur = secToFrame(to - from);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        gap: 10,
      }}
    >
      {lines.map((l, i) => (
        <TypeIn
          key={i}
          text={l.text}
          voice={l.voice}
          size={l.size ?? sizes[l.voice]}
          color={l.orange ? COLORS.orange : COLORS.white}
          accentWords={l.accent ?? []}
          delay={lineDelay(from, l)}
          exit={[dur - 9, dur - 1]}
          style={{
            justifyContent:
              align === "flex-start" ? "flex-start" : align === "flex-end" ? "flex-end" : "center",
          }}
        />
      ))}
    </div>
  );
};

/* ---------------------------------- over -------------------------------- */

const Over: React.FC<{ c: Extract<Callout, { kind: "over" }> }> = ({ c }) => (
  <CameraMotionBlur shutterAngle={150} samples={6}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          ...SLOT[c.slot],
        }}
      >
        <Lines
          from={c.from}
          to={c.to}
          lines={c.lines}
          sizes={SIZE[c.slot]}
          align={
            c.slot === "tl" ? "flex-start" : c.slot === "tr" ? "flex-end" : "center"
          }
        />
      </div>
    </AbsoluteFill>
  </CameraMotionBlur>
);

/* ---------------------------------- chips ------------------------------- */

export const Chip: React.FC<{
  text: string;
  delay: number;
  orange?: boolean;
  muted?: boolean;
  exitAt: number;
  size?: number;
}> = ({ text, delay, orange, muted, exitAt, size = 34 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 190, mass: 0.6 } });
  const exit = interpolate(frame, [exitAt - 8, exitAt], [1, 0], { ...OUT, easing: EASE });
  const color = orange ? COLORS.orange : muted ? "rgba(255,255,255,0.55)" : COLORS.white;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 22px",
        borderRadius: 12,
        background: "rgba(8,8,10,0.62)",
        border: `1.5px solid ${orange ? "rgba(255,122,26,0.7)" : "rgba(255,255,255,0.22)"}`,
        backdropFilter: "blur(6px)",
        transform: `translateY(${(1 - s) * 22}px) scale(${0.85 + 0.15 * s})`,
        opacity: Math.min(1, s * 1.5) * exit,
        fontFamily: SPACE_MONO,
        fontWeight: 700,
        fontSize: size,
        color,
        whiteSpace: "nowrap",
        textDecoration: muted ? "line-through" : "none",
        textDecorationColor: COLORS.orange,
        textDecorationThickness: 3,
        textShadow: orange ? GLOW_ORANGE : "0 2px 8px rgba(0,0,0,0.6)",
      }}
    >
      {/* ◉ desenhado (não depende de glifo) */}
      <span
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: "50%",
          border: `2px solid ${orange ? COLORS.orange : "rgba(255,255,255,0.8)"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: "50%",
            background: orange ? COLORS.orange : "#fff",
            transform: `scale(${s})`,
          }}
        />
      </span>
      {text}
    </div>
  );
};

const Chips: React.FC<{ c: Extract<Callout, { kind: "chips" }> }> = ({ c }) => {
  const dur = secToFrame(c.to - c.from);
  return (
    <CameraMotionBlur shutterAngle={150} samples={6}>
      <AbsoluteFill
        style={{
          justifyContent: c.slot === "top" ? "flex-start" : "flex-end",
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 70,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            maxWidth: 1500,
          }}
        >
          {c.items.map((it, i) => (
            <Chip
              key={i}
              text={it.text}
              delay={secToFrame(it.at - c.from)}
              orange={it.orange}
              muted={it.muted}
              exitAt={dur - 1}
            />
          ))}
        </div>
        {c.tail ? (
          <div style={{ marginTop: 22 }}>
            <TypeIn
              text={c.tail.text}
              voice={c.tail.voice}
              size={c.tail.size ?? 52}
              color={c.tail.orange ? COLORS.orange : COLORS.white}
              delay={lineDelay(c.from, c.tail)}
              exit={[dur - 9, dur - 1]}
            />
          </div>
        ) : null}
      </AbsoluteFill>
    </CameraMotionBlur>
  );
};

/* ---------------------------------- steps ------------------------------- */

const Step: React.FC<{
  mark: string;
  text: string;
  delay: number;
  exitAt: number;
  active: boolean;
}> = ({ mark, text, delay, exitAt, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 200, mass: 0.6 } });
  const exit = interpolate(frame, [exitAt - 8, exitAt], [1, 0], { ...OUT, easing: EASE });
  const glowPulse = active ? 0.7 + 0.3 * Math.sin(frame * 0.18) : 0.35;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: Math.min(1, s * 1.5) * exit * (active ? 1 : 0.7),
        transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`,
      }}
    >
      <div
        style={{
          width: 74,
          height: 74,
          borderRadius: 14,
          background: active ? COLORS.orange : "rgba(10,10,12,0.7)",
          border: `2px solid ${COLORS.orange}`,
          boxShadow: `0 0 ${22 * glowPulse}px rgba(255,122,26,${glowPulse})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SPACE_MONO,
          fontWeight: 700,
          fontSize: 44,
          color: active ? "#1A0D04" : COLORS.orange,
        }}
      >
        {mark}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 500,
          fontSize: 32,
          color: COLORS.white,
          textShadow: "0 2px 8px rgba(0,0,0,0.7)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Steps: React.FC<{ c: Extract<Callout, { kind: "steps" }> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const dur = secToFrame(c.to - c.from);
  const nowS = c.from + frame / 30;
  // ativo = o último item cuja hora já chegou
  let activeIdx = -1;
  c.items.forEach((it, i) => {
    if (nowS >= it.at) activeIdx = i;
  });
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}
    >
      <div style={{ display: "flex", gap: 40 }}>
        {c.items.map((it, i) => (
          <Step
            key={i}
            mark={it.mark}
            text={it.text}
            delay={secToFrame(it.at - c.from)}
            exitAt={dur - 1}
            active={i === activeIdx}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------- money ------------------------------- */

const hash = (i: number, salt: number): number => {
  const x = Math.sin(i * 91.7 + salt * 47.3) * 43758.5453;
  return x - Math.floor(x);
};

/** notas verdes caindo e girando (como na referência, "virar a chave") */
const Money: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 18 }, (_, i) => {
        const x = hash(i, 1) * 1920;
        const start = hash(i, 2) * 40;
        const lt = t - start;
        if (lt < 0) return null;
        const vy = 9 + hash(i, 3) * 7;
        const y = -160 + lt * vy;
        const rot = hash(i, 4) * 360 + lt * (2 + hash(i, 5) * 4) * (hash(i, 6) > 0.5 ? 1 : -1);
        const w = 130 + hash(i, 7) * 50;
        const fade = interpolate(lt, [0, 6], [0, 1], OUT);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * 0.44,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.money} 0%, #1E9B5A 100%)`,
              border: "2px solid rgba(255,255,255,0.35)",
              transform: `rotate(${rot}deg) rotateX(${hash(i, 8) * 60}deg)`,
              opacity: fade * 0.95,
              boxShadow: "0 0 24px rgba(61,220,132,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SPACE_MONO,
              fontWeight: 700,
              fontSize: w * 0.2,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            $
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------------------------- card -------------------------------- */

const Card: React.FC<{ c: Extract<Callout, { kind: "card" }> }> = ({ c }) => {
  const dur = secToFrame(c.to - c.from);
  return (
    <CameraMotionBlur shutterAngle={150} samples={6}>
      <CardScene
        frame={c.frame !== false}
        width={c.width}
        backdrop={
          c.moneyAt !== undefined ? <Money delay={secToFrame(c.moneyAt - c.from)} /> : null
        }
      >
        <Lines
          from={c.from}
          to={c.to}
          lines={c.lines}
          sizes={{ sans: 44, mono: 74 }}
        />
        {c.chips ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 14,
              marginTop: 18,
              maxWidth: 1180,
            }}
          >
            {c.chips.map((it, i) => (
              <Chip
                key={i}
                text={it.text}
                delay={secToFrame(it.at - c.from)}
                orange={it.orange}
                exitAt={dur - 1}
                size={26}
              />
            ))}
          </div>
        ) : null}
      </CardScene>
    </CameraMotionBlur>
  );
};

/* ------------------------------ montagem -------------------------------- */

export const Callouts: React.FC = () => (
  <Sequence name="CALLOUTS" layout="none">
    {CALLOUTS.map((c, i) => {
      if (c.kind === "behind") return null;
      const from = secToFrame(c.from);
      const dur = Math.max(1, secToFrame(c.to - c.from));
      const label =
        c.kind === "over" || c.kind === "card"
          ? c.lines[c.lines.length - 1].text
          : c.kind === "chips"
            ? c.items[0].text
            : c.items.map((s) => s.mark).join("");
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`${c.kind}: ${label}`}>
          {c.kind === "over" ? <Over c={c} /> : null}
          {c.kind === "chips" ? <Chips c={c} /> : null}
          {c.kind === "steps" ? <Steps c={c} /> : null}
          {c.kind === "card" ? <Card c={c} /> : null}
        </Sequence>
      );
    })}
  </Sequence>
);
