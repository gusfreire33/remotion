import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, EASE_OUT } from "./ui";
import { JAKARTA, SORA, WM } from "../lib/theme";

/* ------------------------------------------------------------------------
   GRAMÁTICA DE ENTRADA (PLAYBOOK-2 9.3): cada elemento entra no frame da
   palavra que o nomeia, escalonado, com mola curta. Saída limpa.
   --------------------------------------------------------------------- */

type Dir = "up" | "down" | "left" | "right" | "scale" | "drop" | "none";

export const Appear: React.FC<{
  f: number; // frame local de entrada
  dir?: Dir;
  dist?: number;
  out?: number; // frame local de saída (opcional)
  style?: React.CSSProperties;
  children?: React.ReactNode;
  stiff?: number;
}> = ({ f, dir = "up", dist = 40, out, style, children, stiff = 190 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - f, fps, config: { damping: 15, stiffness: stiff, mass: 0.6 } });
  const o = out !== undefined ? interpolate(frame, [out, out + 8], [1, 0], CLAMP) : 1;
  const op = Math.min(1, interpolate(frame - f, [0, 5], [0, 1], CLAMP)) * o;
  let tf = "";
  const k = 1 - s;
  if (dir === "up") tf = `translateY(${dist * k}px)`;
  if (dir === "down") tf = `translateY(${-dist * k}px)`;
  if (dir === "left") tf = `translateX(${dist * k}px)`;
  if (dir === "right") tf = `translateX(${-dist * k}px)`;
  if (dir === "scale") tf = `scale(${0.6 + 0.4 * s})`;
  if (dir === "drop") tf = `translateY(${-dist * k}px) scale(${1 + 0.25 * k})`;
  return (
    <div style={{ ...style, opacity: frame < f ? 0 : op, transform: `${style?.transform ?? ""} ${tf}` }}>
      {children}
    </div>
  );
};

/** carimbo: bate grande e torto, com recuo (família Selo/carimbo) */
export const Stamp: React.FC<{
  f: number;
  text: string;
  color?: string;
  rot?: number;
  size?: number;
  style?: React.CSSProperties;
  fill?: boolean;
  ink?: string;
}> = ({ f, text, color = WM.danger, rot = -8, size = 56, style, fill = false, ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - f, fps, config: { damping: 11, stiffness: 260, mass: 0.7 } });
  if (frame < f) return null;
  const sc = interpolate(s, [0, 1], [2.4, 1]);
  return (
    <div
      style={{
        position: "absolute",
        ...style,
        transform: `rotate(${rot}deg) scale(${sc})`,
        opacity: Math.min(1, (frame - f) / 3),
        border: `${size * 0.09}px solid ${color}`,
        color: ink ?? (fill ? WM.white : color),
        background: fill ? color : "rgba(255,255,255,0.0)",
        borderRadius: size * 0.22,
        padding: `${size * 0.12}px ${size * 0.4}px`,
        fontFamily: SORA,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        lineHeight: 1.05,
      }}
    >
      {text}
    </div>
  );
};

/** X desenhado à mão (o glifo ✕ cai em fallback fino — APÊNDICE PLAYBOOK-2) */
export const DrawX: React.FC<{ f: number; size?: number; color?: string; stroke?: number }> = ({
  f,
  size = 60,
  color = WM.danger,
  stroke = 10,
}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [f, f + 5], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const b = interpolate(frame, [f + 3, f + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const L = size * 1.414;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <line x1={0} y1={0} x2={size} y2={size} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - a)} />
      <line x1={size} y1={0} x2={0} y2={size} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - b)} />
    </svg>
  );
};

/** check desenhado */
export const DrawCheck: React.FC<{ f: number; size?: number; color?: string; stroke?: number }> = ({
  f,
  size = 40,
  color = WM.ink,
  stroke = 6,
}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [f, f + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const L = size * 1.6;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: "visible" }}>
      <path d="M7 21 L16 30 L33 11" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L * 1.4} strokeDashoffset={L * 1.4 * (1 - a)} />
    </svg>
  );
};

/** texto digitado com cursor (família Campo de entrada); 1 char a cada `cpf` frames */
export const Typed: React.FC<{ f: number; text: string; cpf?: number; caret?: boolean; style?: React.CSSProperties }> = ({
  f,
  text,
  cpf = 1.6,
  caret = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - f) / cpf)));
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret ? <span style={{ opacity: blink || n < text.length ? 1 : 0, marginLeft: 2, fontWeight: 400 }}>|</span> : null}
    </span>
  );
};

/** quantos frames um Typed leva (pra cronometrar SFX de tecla) */
export const typedFrames = (text: string, cpf = 1.6) => Math.ceil(text.length * cpf);

/** rótulo pequeno em caixa alta (kicker) para cenas de motion */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = WM.lime,
  style,
}) => (
  <div
    style={{
      fontFamily: JAKARTA,
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
      display: "flex",
      alignItems: "center",
      gap: 12,
      ...style,
    }}
  >
    <span style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
    {children}
  </div>
);

/** título grande de motion (Sora) */
export const Big: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  weight?: number;
}> = ({ children, size = 96, color = WM.white, style, weight = 800 }) => (
  <div
    style={{
      fontFamily: SORA,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: "-0.035em",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
