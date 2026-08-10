import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { ANTON, MONTSERRAT } from "../lib/fonts";
import { COLORS, TEXT_SHADOW } from "../lib/theme";

/* =========================================================================
   Kit de animacao "cinetico" — linguagem visual propria deste video:
   tipografia que se monta letra a letra + tracos desenhados (trim paths,
   estilo After Effects) + wipes. Sem pills/icones/carimbos.
   ====================================================================== */

const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IO = Easing.inOut(Easing.ease);

export const prog = (
  frame: number,
  delay: number,
  dur: number,
  easing: (n: number) => number = EASE_OUT,
): number =>
  interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/* ------------------------------- palco --------------------------------- */

export const Stage: React.FC<{
  children: ReactNode;
  lift?: number;
  gap?: number;
}> = ({ children, lift = 540, gap = 22 }) => (
  <CameraMotionBlur shutterAngle={150} samples={6}>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `translateY(${-lift}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap,
          width: 1000,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  </CameraMotionBlur>
);

/* --------------------- 1. tipografia em cascata ------------------------- */
// Letras caem uma a uma, desfocadas, e assentam. Substitui o "PopIn".

export const Kinetic: React.FC<{
  text: string;
  size?: number;
  color?: string;
  delay?: number;
  stagger?: number;
  drop?: number;
  style?: CSSProperties;
}> = ({
  text,
  size = 96,
  color = COLORS.white,
  delay = 0,
  stagger = 2,
  drop = -70,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        fontFamily: ANTON,
        fontSize: size,
        color,
        letterSpacing: 1,
        textTransform: "uppercase",
        textShadow: TEXT_SHADOW,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {text.split("").map((ch, i) => {
        const t = prog(frame, delay + i * stagger, 10);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transform: `translateY(${(1 - t) * drop}px) scale(${0.7 + 0.3 * t})`,
              opacity: t,
              filter: `blur(${(1 - t) * 9}px)`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------ 2. texto em wipe ------------------------------ */
// Revela o texto por uma mascara que corre da esquerda pra direita.

export const WipeText: React.FC<{
  text: string;
  size?: number;
  color?: string;
  delay?: number;
  dur?: number;
  weight?: number;
  style?: CSSProperties;
}> = ({
  text,
  size = 34,
  color = COLORS.white,
  delay = 0,
  dur = 12,
  weight = 900,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, dur, EASE_IO);
  return (
    <div
      style={{
        clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
        fontFamily: MONTSERRAT,
        fontWeight: weight,
        fontSize: size,
        color,
        textShadow: TEXT_SHADOW,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/* --------------------- 3. traco desenhado (trim path) ------------------- */
// pathLength=1 normaliza o comprimento, entao o dashoffset vira progresso.
// Usar SEMPRE dentro de um <svg>.

export const DrawPath: React.FC<{
  d: string;
  delay?: number;
  dur?: number;
  color?: string;
  width?: number;
  fill?: string;
  fillDelay?: number;
}> = ({
  d,
  delay = 0,
  dur = 22,
  color = COLORS.white,
  width = 7,
  fill,
  fillDelay,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, dur, EASE_IO);
  const fillOp = fill ? prog(frame, fillDelay ?? delay + dur, 10) : 0;
  return (
    <>
      {fill ? <path d={d} fill={fill} opacity={fillOp} /> : null}
      <path
        d={d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - t}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
};

/* ----------------------- 4. marca-texto (rule bar) ---------------------- */
// Barra de cor que corre por tras da palavra, tipo marca-texto.

export const RuleBar: React.FC<{
  delay?: number;
  dur?: number;
  color?: string;
  inset?: number;
}> = ({ delay = 0, dur = 12, color = COLORS.accent, inset = -10 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, dur, EASE_IO);
  return (
    <div
      style={{
        position: "absolute",
        inset,
        background: color,
        borderRadius: 8,
        transform: `scaleX(${t})`,
        transformOrigin: "left center",
        zIndex: -1,
      }}
    />
  );
};

/* -------------------------- 5. risco / strike --------------------------- */
// Linha desenhada por cima de um texto (nega o que esta escrito).

export const Strike: React.FC<{
  delay?: number;
  dur?: number;
  color?: string;
  width?: number;
}> = ({ delay = 0, dur = 10, color = COLORS.danger, width = 8 }) => (
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <DrawPath
      d="M2 74 L98 26"
      delay={delay}
      dur={dur}
      color={color}
      width={width}
    />
  </svg>
);

/* ---------------------------- 6. contador ------------------------------- */
// Numero que "rola" de 0 ate o valor final.

export const NumberRoll: React.FC<{
  to: number;
  delay?: number;
  dur?: number;
  size?: number;
  color?: string;
}> = ({ to, delay = 0, dur = 22, size = 72, color = COLORS.white }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, dur, EASE_OUT);
  return (
    <div
      style={{
        fontFamily: ANTON,
        fontSize: size,
        color,
        textShadow: TEXT_SHADOW,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {Math.round(to * t)}
    </div>
  );
};
