import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FPS, secToFrame } from "./lib/constants";
import { CALLOUTS } from "./lib/map";
import type { Callout, Line } from "./lib/types";
import { TypeIn } from "../components/TypeIn";
import { TypeWriter } from "./components/TypeWriter";
import { AnimatedBg } from "./components/AnimatedBg";
import { Icon } from "./components/Icon";
import { INTER, SPACE_MONO } from "../lib/fonts";
import { COLORS, GLOW_ORANGE } from "../lib/theme";

/* ------------------------------------------------------------------------
   RENDERIZADORES do mapa `lib/map.ts` — "Vídeo 2 YT" (horizontal, YouTube).

     over   · texto typewriter num dos slots, sobre a pessoa (+ ícone opcional)
     chips  · lista acumulando (◉ item) embaixo ou em cima
     steps  · lista com marca grande que persiste
     card   · cartão full-screen sobre FUNDO ANIMADO; linhas `typed` são
              digitadas com cursor + teclado
     broll  · clipe do Pexels (full-bleed ou janela ao lado da pessoa)
     icons  · fileira de ícones com rótulo (+ setas = fluxo)
     stat   · número grande contando

   (`behind` fica em BehindLayer.tsx — camada entre o vídeo e o recorte)
   --------------------------------------------------------------------- */

const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.inOut(Easing.ease);

/** posição de cada slot na tela 1920x1080 (pessoa centralizada) */
const SLOT: Record<string, CSSProperties> = {
  tl: { left: 80, top: 150, width: 680, alignItems: "flex-start", textAlign: "left" },
  tr: { right: 80, top: 150, width: 680, alignItems: "flex-end", textAlign: "right" },
  // a cabeça deste vídeo encosta no topo do quadro (y≈120–520), então o slot
  // "top" NÃO fica em cima — fica logo abaixo do queixo; "chest" mais embaixo.
  top: { left: 0, right: 0, top: 560, alignItems: "center", textAlign: "center" },
  chest: { left: 0, right: 0, top: 770, alignItems: "center", textAlign: "center" },
  bl: { left: 80, bottom: 90, width: 760, alignItems: "flex-start", textAlign: "left" },
  br: { right: 80, bottom: 90, width: 760, alignItems: "flex-end", textAlign: "right" },
};

const SIZE: Record<string, { sans: number; mono: number }> = {
  tl: { sans: 50, mono: 80 },
  tr: { sans: 50, mono: 80 },
  top: { sans: 46, mono: 72 },
  chest: { sans: 48, mono: 74 },
  bl: { sans: 48, mono: 76 },
  br: { sans: 48, mono: 76 },
};

const alignOf = (slot: string): "center" | "flex-start" | "flex-end" =>
  slot === "tl" || slot === "bl" ? "flex-start" : slot === "tr" || slot === "br" ? "flex-end" : "center";

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
  const just = align === "flex-start" ? "flex-start" : align === "flex-end" ? "flex-end" : "center";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: 10 }}>
      {lines.map((l, i) =>
        l.typed ? (
          <TypeWriter
            key={i}
            text={l.text}
            voice={l.voice}
            size={l.size ?? sizes[l.voice]}
            color={l.orange ? COLORS.orange : COLORS.white}
            accentWords={l.accent ?? []}
            delay={lineDelay(from, l)}
            exit={[dur - 9, dur - 1]}
            align={align === "flex-start" ? "left" : align === "flex-end" ? "right" : "center"}
            cursorHold={i === lines.length - 1 ? undefined : 10}
          />
        ) : (
          <TypeIn
            key={i}
            text={l.text}
            voice={l.voice}
            size={l.size ?? sizes[l.voice]}
            color={l.orange ? COLORS.orange : COLORS.white}
            accentWords={l.accent ?? []}
            delay={lineDelay(from, l)}
            exit={[dur - 9, dur - 1]}
            style={{ justifyContent: just }}
          />
        ),
      )}
    </div>
  );
};

/* ---------------------------------- over -------------------------------- */

const Over: React.FC<{ c: Extract<Callout, { kind: "over" }> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const dur = secToFrame(c.to - c.from);
  const exit = interpolate(frame, [dur - 9, dur - 1], [1, 0], { ...OUT, easing: EASE });
  const align = alignOf(c.slot);
  return (
    <CameraMotionBlur shutterAngle={150} samples={6}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            ...SLOT[c.slot],
          }}
        >
          {c.icon ? (
            <div style={{ opacity: exit }}>
              <Icon name={c.icon} size={92} delay={lineDelay(c.from, c.lines[0])} pulse />
            </div>
          ) : null}
          <Lines from={c.from} to={c.to} lines={c.lines} sizes={SIZE[c.slot]} align={align} />
        </div>
      </AbsoluteFill>
    </CameraMotionBlur>
  );
};

/* ---------------------------------- chips ------------------------------- */

export const Chip: React.FC<{
  text: string;
  delay: number;
  orange?: boolean;
  muted?: boolean;
  icon?: Parameters<typeof Icon>[0]["name"];
  exitAt: number;
  size?: number;
}> = ({ text, delay, orange, muted, icon, exitAt, size = 40 }) => {
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
      {icon ? (
        <Icon name={icon} size={size * 1.1} color={orange ? COLORS.orange : COLORS.white} glow={false} />
      ) : (
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
      )}
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
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: 1500 }}>
          {c.items.map((it, i) => (
            <Chip
              key={i}
              text={it.text}
              delay={secToFrame(it.at - c.from)}
              orange={it.orange}
              muted={it.muted}
              icon={it.icon}
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
  icon?: Parameters<typeof Icon>[0]["name"];
  delay: number;
  exitAt: number;
  active: boolean;
}> = ({ mark, text, icon, delay, exitAt, active }) => {
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
          fontSize: 40,
          color: active ? "#1A0D04" : COLORS.orange,
        }}
      >
        {icon ? <Icon name={icon} size={42} color={active ? "#1A0D04" : COLORS.orange} glow={false} /> : mark}
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
  const nowS = c.from + frame / FPS;
  let activeIdx = -1;
  c.items.forEach((it, i) => {
    if (nowS >= it.at) activeIdx = i;
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", maxWidth: 1700 }}>
        {c.items.map((it, i) => (
          <Step
            key={i}
            mark={it.mark}
            text={it.text}
            icon={it.icon}
            delay={secToFrame(it.at - c.from)}
            exitAt={dur - 1}
            active={i === activeIdx}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------- icons ------------------------------- */

const IconItem: React.FC<{
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  delay: number;
  exitAt: number;
  orange?: boolean;
  size?: number;
}> = ({ icon, label, delay, exitAt, orange, size = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 190, mass: 0.7 } });
  const exit = interpolate(frame, [exitAt - 8, exitAt], [1, 0], { ...OUT, easing: EASE });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: Math.min(1, s * 1.5) * exit,
        transform: `translateY(${(1 - s) * 36}px)`,
      }}
    >
      <div
        style={{
          width: size * 1.7,
          height: size * 1.7,
          borderRadius: 26,
          background: "rgba(8,8,10,0.66)",
          border: `2px solid ${orange ? COLORS.orange : "rgba(255,255,255,0.28)"}`,
          boxShadow: orange ? "0 0 34px rgba(255,122,26,0.35)" : "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={size} color={orange ? COLORS.orange : COLORS.white} delay={delay} />
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 30,
          color: orange ? COLORS.orange : COLORS.white,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Arrow: React.FC<{ delay: number; exitAt: number }> = ({ delay, exitAt }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 10], [0, 1], { ...OUT, easing: EASE });
  const exit = interpolate(frame, [exitAt - 8, exitAt], [1, 0], { ...OUT, easing: EASE });
  return (
    <div style={{ display: "flex", alignItems: "center", height: 163, opacity: t * exit }}>
      <div
        style={{
          width: 70,
          height: 4,
          background: COLORS.orange,
          transform: `scaleX(${t})`,
          transformOrigin: "left",
          boxShadow: GLOW_ORANGE,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          borderLeft: `18px solid ${COLORS.orange}`,
          opacity: t,
        }}
      />
    </div>
  );
};

const Icons: React.FC<{ c: Extract<Callout, { kind: "icons" }> }> = ({ c }) => {
  const dur = secToFrame(c.to - c.from);
  return (
    <CameraMotionBlur shutterAngle={150} samples={6}>
      <AbsoluteFill
        style={{
          justifyContent: c.slot === "top" ? "flex-start" : c.slot === "center" ? "center" : "flex-end",
          alignItems: "center",
          paddingTop: 50,
          paddingBottom: 60,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: c.arrows ? 22 : 56 }}>
          {c.items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
              {i > 0 && c.arrows ? (
                <Arrow delay={secToFrame(it.at - c.from) - 6} exitAt={dur - 1} />
              ) : null}
              <IconItem
                icon={it.icon}
                label={it.label}
                delay={secToFrame(it.at - c.from)}
                exitAt={dur - 1}
                orange={it.orange}
              />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </CameraMotionBlur>
  );
};

/* ---------------------------------- stat -------------------------------- */

const Stat: React.FC<{ c: Extract<Callout, { kind: "stat" }> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = secToFrame(c.to - c.from);
  const delay = secToFrame((c.at ?? c.from) - c.from);
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120, mass: 0.9 } });
  const count = interpolate(frame, [delay, delay + 34], [0, c.value], { ...OUT, easing: Easing.out(Easing.cubic) });
  const exit = interpolate(frame, [dur - 9, dur - 1], [1, 0], { ...OUT, easing: EASE });
  const align = alignOf(c.slot);
  const text = `${c.prefix ?? ""}${count.toFixed(c.decimals ?? 0).replace(".", ",")}${c.suffix ?? ""}`;
  return (
    <CameraMotionBlur shutterAngle={150} samples={6}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            ...SLOT[c.slot],
            width: "auto",
            whiteSpace: "nowrap",
            alignItems: align,
            opacity: Math.min(1, s * 1.4) * exit,
            transform: `translateY(${(1 - s) * 40}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {c.icon ? <Icon name={c.icon} size={84} delay={delay} /> : null}
            <div
              style={{
                fontFamily: SPACE_MONO,
                fontWeight: 700,
                fontSize: 128,
                lineHeight: 1,
                color: COLORS.orange,
                textShadow: GLOW_ORANGE,
                letterSpacing: -2,
              }}
            >
              {text}
            </div>
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 40,
              color: COLORS.white,
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
            }}
          >
            {c.label}
          </div>
        </div>
      </AbsoluteFill>
    </CameraMotionBlur>
  );
};

/* ---------------------------------- broll ------------------------------- */

const KenBurns: React.FC<{ children: React.ReactNode; zoom: [number, number] }> = ({ children, zoom }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [0, durationInFrames], zoom, OUT);
  const whip = interpolate(frame, [0, 5], [1, 0], { ...OUT, easing: EASE });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${k + whip * 0.06})`,
        filter: whip > 0.02 ? `blur(${whip * 4}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const BRoll: React.FC<{ c: Extract<Callout, { kind: "broll" }> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = secToFrame(c.to - c.from);
  const video = (
    <Video
      src={staticFile(`broll/${c.slug}.mp4`)}
      style={{ width: "100%", height: "100%" }}
      objectFit="cover"
      muted
      trimBefore={Math.round((c.startAt ?? 0) * FPS)}
    />
  );
  const label = c.label ? (
    <div style={{ position: "absolute", left: 80, bottom: 80, maxWidth: 1400 }}>
      <TypeWriter
        text={c.label.text}
        voice={c.label.voice}
        size={c.label.size ?? 54}
        color={c.label.orange ? COLORS.orange : COLORS.white}
        accentWords={c.label.accent ?? []}
        delay={lineDelay(c.from, c.label)}
        exit={[dur - 9, dur - 1]}
        align="left"
      />
    </div>
  ) : null;

  if (c.layout === "full") {
    const out = interpolate(frame, [dur - 6, dur - 1], [1, 0], { ...OUT, easing: EASE });
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <KenBurns zoom={c.zoom ?? [1.02, 1.12]}>{video}</KenBurns>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 28%, rgba(0,0,0,0) 45%)",
          }}
        />
        {label}
      </AbsoluteFill>
    );
  }

  // PiP: janela ao lado da pessoa
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 160, mass: 0.8 } });
  const out = interpolate(frame, [dur - 9, dur - 1], [1, 0], { ...OUT, easing: EASE });
  const side = c.pipSide ?? "left";
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 150,
          [side]: 70,
          width: 820,
          height: 461,
          borderRadius: 22,
          overflow: "hidden",
          border: `3px solid ${COLORS.orange}`,
          boxShadow: "0 0 40px rgba(255,122,26,0.25), 0 30px 80px rgba(0,0,0,0.65)",
          transform: `translateX(${(1 - s) * (side === "left" ? -120 : 120)}px) scale(${0.9 + 0.1 * s})`,
          opacity: Math.min(1, s * 1.4) * out,
        }}
      >
        <KenBurns zoom={c.zoom ?? [1.04, 1.14]}>{video}</KenBurns>
      </div>
      {c.label ? (
        <div style={{ position: "absolute", top: 632, [side]: 70, width: 820 }}>
          <TypeWriter
            text={c.label.text}
            voice={c.label.voice}
            size={c.label.size ?? 40}
            color={c.label.orange ? COLORS.orange : COLORS.white}
            accentWords={c.label.accent ?? []}
            delay={lineDelay(c.from, c.label)}
            exit={[dur - 9, dur - 1]}
            align={side === "left" ? "left" : "right"}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------------------------- card -------------------------------- */

const Card: React.FC<{ c: Extract<Callout, { kind: "card" }> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dur = secToFrame(c.to - c.from);
  const inn = interpolate(frame, [0, 8], [0, 1], { ...OUT, easing: EASE });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], { ...OUT, easing: EASE });
  const cardPop = interpolate(frame, [0, 14], [0.94, 1], { ...OUT, easing: EASE });
  const withFrame = c.frame !== false;
  const width = c.width ?? 1240;

  const inner = (
    <>
      <Lines from={c.from} to={c.to} lines={c.lines} sizes={{ sans: 44, mono: 74 }} />
      {c.chips ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 18, maxWidth: width - 100 }}>
          {c.chips.map((it, i) => (
            <Chip key={i} text={it.text} delay={secToFrame(it.at - c.from)} orange={it.orange} icon={it.icon} exitAt={dur - 1} size={26} />
          ))}
        </div>
      ) : null}
      {c.icons ? (
        <div style={{ display: "flex", gap: 44, marginTop: 26 }}>
          {c.icons.map((it, i) => (
            <IconItem key={i} icon={it.icon} label={it.label} delay={secToFrame(it.at - c.from)} exitAt={dur - 1} orange={it.orange} size={72} />
          ))}
        </div>
      ) : null}
    </>
  );

  // sem CameraMotionBlur aqui: as amostras sub-frame do blur mostram contagens
  // diferentes de caracteres do typewriter e a letra sendo digitada "ghosta".
  return (
    <AbsoluteFill style={{ opacity: Math.min(inn, out) }}>
        <AnimatedBg kind={c.bg ?? "sparks"} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {withFrame ? (
            <div
              style={{
                width,
                minHeight: 300,
                borderRadius: 18,
                border: `2px solid ${COLORS.orange}`,
                background: "linear-gradient(180deg, rgba(20,12,8,0.78) 0%, rgba(8,5,3,0.85) 100%)",
                boxShadow: "0 0 40px rgba(255,122,26,0.18), 0 30px 80px rgba(0,0,0,0.6)",
                transform: `scale(${cardPop})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                padding: "36px 60px",
              }}
            >
              {inner}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "0 120px" }}>
              {inner}
            </div>
          )}
        </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------ montagem -------------------------------- */

const labelOf = (c: Callout): string => {
  switch (c.kind) {
    case "over":
    case "card":
    case "behind":
      return c.lines[c.lines.length - 1].text;
    case "chips":
      return c.items[0].text;
    case "steps":
      return c.items.map((s) => s.mark).join("");
    case "icons":
      return c.items.map((s) => s.label).join("/");
    case "broll":
      return c.slug;
    case "stat":
      return c.label;
  }
};

export const Callouts: React.FC = () => (
  <Sequence name="CALLOUTS" layout="none">
    {CALLOUTS.map((c, i) => {
      if (c.kind === "behind") return null;
      const from = secToFrame(c.from);
      const dur = Math.max(1, secToFrame(c.to - c.from));
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`${c.kind}: ${labelOf(c)}`}>
          {c.kind === "over" ? <Over c={c} /> : null}
          {c.kind === "chips" ? <Chips c={c} /> : null}
          {c.kind === "steps" ? <Steps c={c} /> : null}
          {c.kind === "card" ? <Card c={c} /> : null}
          {c.kind === "broll" ? <BRoll c={c} /> : null}
          {c.kind === "icons" ? <Icons c={c} /> : null}
          {c.kind === "stat" ? <Stat c={c} /> : null}
        </Sequence>
      );
    })}
  </Sequence>
);
