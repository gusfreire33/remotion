import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import {
  LuLayoutDashboard,
  LuMegaphone,
  LuMessagesSquare,
  LuPackage,
  LuUsers,
  LuBadgeDollarSign,
  LuPlug,
  LuMessageCircle,
  LuSettings,
  LuSearch,
  LuBell,
  LuSparkles,
  LuArrowRight,
} from "react-icons/lu";
import { JAKARTA, SORA, SHADOW_FLOAT, WM } from "../lib/theme";

/* ------------------------------------------------------------------------
   PRIMITIVOS DE UI — recriação fiel do frontend do Wonne Max
   (apps/web shell v2 + docs/design-system/Wonne Max Dashboard.html).
   Tudo é função do frame: nada de Math.random (PLAYBOOK-2 9.3).
   --------------------------------------------------------------------- */

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IO = Easing.inOut(Easing.cubic);

/** spring de entrada a partir de `delay` frames do início local */
export const useEnter = (delay = 0, cfg?: { damping?: number; stiffness?: number; mass?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: cfg?.damping ?? 16, stiffness: cfg?.stiffness ?? 170, mass: cfg?.mass ?? 0.6 },
  });
};

/** 0→1 linear com easing entre dois frames locais */
export const prog = (frame: number, a: number, b: number, ease = EASE_OUT) =>
  b <= a ? (frame >= a ? 1 : 0) : interpolate(frame, [a, b], [0, 1], { ...CLAMP, easing: ease });

export const Wordmark: React.FC<{ size?: number; color?: string; dot?: string }> = ({
  size = 23,
  color = WM.ink,
  dot = WM.lime,
}) => (
  <div
    style={{
      fontFamily: SORA,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "-0.03em",
      color,
      display: "flex",
      alignItems: "baseline",
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}
  >
    wonne max
    <span
      style={{
        width: size * 0.3,
        height: size * 0.3,
        borderRadius: 999,
        background: dot,
        marginLeft: size * 0.12,
        display: "inline-block",
      }}
    />
  </div>
);

/** pílula escura com círculo lima e seta (CTA do design system) */
export const DarkPill: React.FC<{ label: string; w?: number; h?: number; fs?: number; glow?: number }> = ({
  label,
  w,
  h = 48,
  fs = 15,
  glow = 0,
}) => (
  <div
    style={{
      height: h,
      width: w,
      borderRadius: 999,
      background: WM.ink,
      color: WM.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `0 ${h * 0.12}px 0 ${h * 0.45}px`,
      gap: 18,
      fontFamily: JAKARTA,
      fontWeight: 700,
      fontSize: fs,
      boxShadow: glow ? `0 0 ${40 * glow}px rgba(212,245,0,${0.45 * glow})` : undefined,
      whiteSpace: "nowrap",
    }}
  >
    {label}
    <div
      style={{
        width: h * 0.72,
        height: h * 0.72,
        borderRadius: 999,
        background: WM.lime,
        color: WM.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LuArrowRight size={h * 0.36} strokeWidth={2.4} />
    </div>
  </div>
);

/** pílula lima (CTA primário — texto sempre ink, nunca branco) */
export const LimePill: React.FC<{ label: string; h?: number; fs?: number; pulse?: number }> = ({
  label,
  h = 64,
  fs = 22,
  pulse = 0,
}) => (
  <div
    style={{
      height: h,
      borderRadius: 999,
      background: WM.lime,
      color: WM.ink,
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      padding: `0 ${h * 0.14}px 0 ${h * 0.5}px`,
      fontFamily: SORA,
      fontWeight: 700,
      fontSize: fs,
      boxShadow: `0 0 0 ${pulse * 14}px rgba(212,245,0,${0.25 * (1 - pulse)}), 0 20px 60px -10px rgba(212,245,0,0.45)`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
    <div
      style={{
        width: h * 0.72,
        height: h * 0.72,
        borderRadius: 999,
        background: WM.ink,
        color: WM.lime,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LuArrowRight size={h * 0.34} strokeWidth={2.4} />
    </div>
  </div>
);

export const Badge: React.FC<{ text: string; bg?: string; fg?: string; fs?: number }> = ({
  text,
  bg = WM.limeSoft,
  fg = WM.limeDark,
  fs = 12,
}) => (
  <span
    style={{
      background: bg,
      color: fg,
      fontFamily: JAKARTA,
      fontWeight: 700,
      fontSize: fs,
      padding: `${fs * 0.35}px ${fs * 0.8}px`,
      borderRadius: 8,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
      display: "inline-block",
    }}
  >
    {text}
  </span>
);

export const Avatar: React.FC<{ txt: string; size?: number; bg?: string; fg?: string }> = ({
  txt,
  size = 34,
  bg = WM.lime,
  fg = WM.ink,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: bg,
      color: fg,
      fontFamily: SORA,
      fontWeight: 700,
      fontSize: size * 0.36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {txt}
  </div>
);

/** card branco padrão (raio 16, sombra quase invisível) */
export const Card: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pad?: number;
}> = ({ style, children, pad = 22 }) => (
  <div
    style={{
      background: WM.card,
      borderRadius: 16,
      border: `1px solid rgba(20,22,15,0.08)`,
      boxShadow: "0 1px 2px rgba(20,22,15,.04), 0 8px 24px rgba(20,22,15,.06)",
      padding: pad,
      fontFamily: JAKARTA,
      color: WM.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export type NavKey = "chat" | "visao" | "marketing" | "mensagens" | "produtos" | "contatos" | "vendas" | "integracoes";

const RAIL: { key: NavKey; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { key: "chat", Icon: LuMessageCircle },
  { key: "visao", Icon: LuLayoutDashboard },
  { key: "marketing", Icon: LuMegaphone },
  { key: "mensagens", Icon: LuMessagesSquare },
  { key: "produtos", Icon: LuPackage },
  { key: "contatos", Icon: LuUsers },
  { key: "vendas", Icon: LuBadgeDollarSign },
  { key: "integracoes", Icon: LuPlug },
];

/**
 * Janela do app (shell v2): rail de ícones 56px · topbar 56px · painel de
 * conteúdo #F6F6F2 com raio 24 no topo. `children` é o conteúdo da tela.
 */
export const AppWindow: React.FC<{
  w: number;
  h: number;
  active?: NavKey;
  crumb?: string;
  title?: string;
  children?: React.ReactNode;
  chrome?: boolean;
}> = ({ w, h, active = "visao", crumb, title, children, chrome = true }) => {
  const bar = chrome ? 40 : 0;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 22,
        overflow: "hidden",
        background: WM.bg,
        boxShadow: SHADOW_FLOAT,
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        fontFamily: JAKARTA,
        color: WM.ink,
      }}
    >
      {chrome ? (
        <div
          style={{
            height: bar,
            background: "#E3E3DC",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 16px",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 18,
              height: 24,
              flex: 1,
              maxWidth: 420,
              borderRadius: 99,
              background: "rgba(255,255,255,0.7)",
              fontSize: 12,
              color: WM.muted2,
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontWeight: 500,
            }}
          >
            app.wonnedigital.com.br
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", top: bar, left: 0, right: 0, bottom: 0, display: "flex" }}>
        {/* rail */}
        <div
          style={{
            width: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 14,
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: WM.ink,
              color: WM.lime,
              fontFamily: SORA,
              fontWeight: 800,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            W
          </div>
          {RAIL.map(({ key, Icon }) => {
            const on = key === active;
            return (
              <div
                key={key}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: on ? WM.ink : "transparent",
                  color: on ? WM.lime : WM.muted2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <div style={{ color: WM.muted2, marginBottom: 12 }}>
            <LuSettings size={19} strokeWidth={1.8} />
          </div>
        </div>
        {/* main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", gap: 14, paddingRight: 18 }}>
            <Wordmark size={19} />
            <div
              style={{
                marginLeft: 22,
                height: 34,
                width: 260,
                borderRadius: 99,
                background: WM.card,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 14px",
                color: WM.muted,
                fontSize: 13,
              }}
            >
              <LuSearch size={15} /> Buscar
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700 }}>⌘K</span>
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                height: 34,
                borderRadius: 99,
                background: WM.ink,
                color: WM.white,
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 14px",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: WM.lime }} /> Max
            </div>
            <div style={{ color: WM.muted2 }}>
              <LuSparkles size={18} />
            </div>
            <div style={{ color: WM.muted2 }}>
              <LuBell size={18} />
            </div>
            <Avatar txt="GF" size={32} />
          </div>
          <div
            style={{
              flex: 1,
              background: "#F6F6F2",
              borderTopLeftRadius: 24,
              padding: "22px 28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {crumb ? (
              <div style={{ fontSize: 12, color: WM.muted, fontWeight: 500, marginBottom: 6 }}>{crumb}</div>
            ) : null}
            {title ? (
              <div
                style={{
                  fontFamily: SORA,
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: "-0.02em",
                  marginBottom: 18,
                }}
              >
                {title}
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/** cursor de mouse que viaja entre pontos e "clica" (anel de onda) */
export const Cursor: React.FC<{
  path: { f: number; x: number; y: number; click?: boolean }[];
}> = ({ path }) => {
  const frame = useCurrentFrame();
  if (path.length === 0) return null;
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (b.f <= a.f) {
      if (frame >= b.f) {
        x = b.x;
        y = b.y;
      }
    } else if (frame >= a.f && frame <= b.f) {
      const t = interpolate(frame, [a.f, b.f], [0, 1], { ...CLAMP, easing: EASE_IO });
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  const clicks = path.filter((p) => p.click);
  let ring = 0;
  let press = 0;
  for (const c of clicks) {
    const l = frame - c.f;
    if (l >= 0 && l < 14) {
      ring = l / 14;
      press = l < 5 ? 1 : 0;
    }
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 50 }}>
      {ring > 0 ? (
        <div
          style={{
            position: "absolute",
            left: -26 * ring - 4,
            top: -26 * ring - 4,
            width: 52 * ring + 8,
            height: 52 * ring + 8,
            borderRadius: 999,
            border: `3px solid rgba(212,245,0,${1 - ring})`,
          }}
        />
      ) : null}
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        style={{ transform: `scale(${press ? 0.86 : 1})`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))" }}
      >
        <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.6 L17.6 13.6 Z" fill={WM.ink} stroke="#fff" strokeWidth="1.4" />
      </svg>
    </div>
  );
};

/** número que conta de `from` até `to` entre os frames locais a→b */
export const countTo = (frame: number, a: number, b: number, to: number, from = 0) =>
  from + (to - from) * prog(frame, a, b, Easing.out(Easing.cubic));

export const brl = (v: number, dec = 0) =>
  "R$ " +
  v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
