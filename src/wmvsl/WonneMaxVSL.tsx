import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FilmLook } from "../components/FilmLook";
import { Transitions } from "../components/Transitions";
import { PLACED, isBehindAt, type Placed } from "./lib/map";
import { CUTS } from "./lib/cuts";
import { CUES, MASTER } from "./lib/sfx";
import { DURATION_IN_FRAMES, FPS, sec, WORDS } from "./lib/sync";
import { SORA, WM } from "./lib/theme";
import { MONTSERRAT } from "../lib/fonts";
import type { Marks } from "./lib/types";

/**
 * "VSL Wonne Max" — 1920x1080 @30fps, 100% motion design + narração IA
 * (ElevenLabs). Framework 2 adaptado a um vídeo SEM apresentador:
 *   · PALAVRA ATRÁS → a tipografia gigante fica atrás do objeto principal
 *     da cena (janela/card do produto), que a corta — a janela faz o papel
 *     do recorte da pessoa.
 *   · B-ROLL → telas do Wonne Max recriadas (design system do repo).
 *   · Legenda simples branca (Etapa 8), some durante as palavras-atrás.
 *   · Cortes whip/punch/glitch e SFX DERIVADOS do mesmo mapa (cuts.ts).
 *
 * Pilha:
 *   1. Palco (tinta #15160F + halo lima) — contínuo, não corta
 *   2. por cena: palavra-atrás → conteúdo da cena (câmera: Ken Burns + push + soco)
 *   3. FilmLook (grão + vinheta)
 *   4. Legenda
 *   5. Transitions — sempre por último (backdrop-filter)
 *   6. Narração + SoundFX
 */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.inOut(Easing.ease);

/* ───────────── 1. palco ───────────── */
const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const hx = 50 + Math.sin(t / 9) * 18;
  const hy = 42 + Math.cos(t / 11) * 12;
  return (
    <AbsoluteFill style={{ background: WM.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 55% at ${hx}% ${hy}%, rgba(212,245,0,0.10), rgba(212,245,0,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(236,236,231,0.07) 1.4px, transparent 1.6px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `${(frame * 0.25) % 44}px ${(frame * 0.12) % 44}px`,
          maskImage: "radial-gradient(75% 70% at 50% 45%, #000 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── 2a. palavra-atrás ───────────── */
const BehindWord: React.FC<{ p: Placed }> = ({ p }) => {
  const frame = useCurrentFrame(); // local à cena
  const { fps } = useVideoConfig();
  const b = p.behind!;
  const a = sec(b.mark ? p.marks[b.mark] : p.from) - p.f0;
  const z = Math.min(a + sec(b.dur ?? 1.5), p.f1 - p.f0);
  if (frame < a - 1 || frame > z + 6) return null;
  const s = spring({ frame: frame - a, fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });
  const out = interpolate(frame, [z - 6, z], [1, 0], CLAMP);
  const color = b.tone === "lime" ? WM.lime : b.tone === "danger" ? "#FF4D57" : "#F2F2EC";
  const size = b.size ?? 300;
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: b.top,
          textAlign: "center",
          fontFamily: SORA,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 0.88,
          letterSpacing: "-0.05em",
          color: b.outline ? "transparent" : color,
          WebkitTextStroke: b.outline ? `5px ${color}` : undefined,
          opacity: Math.min(1, s * 1.4) * out,
          transform: `translateY(${(1 - s) * 70}px) scale(${0.92 + 0.08 * s})`,
          textShadow: b.outline ? undefined : `0 0 80px ${b.tone === "lime" ? "rgba(212,245,0,0.35)" : "rgba(0,0,0,0.4)"}`,
          whiteSpace: "nowrap",
        }}
      >
        {b.lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── câmera ───────────── */
const PUNCH_FRAMES = PLACED.filter((p) => p.behind).map((p) =>
  sec(p.behind!.mark ? p.marks[p.behind!.mark] : p.from),
);

const useCamera = (): number => {
  const frame = useCurrentFrame();
  const kb = interpolate(frame, [0, DURATION_IN_FRAMES], [1.0, 1.04], CLAMP);
  // push-in sustentado durante cada cena (bordas de 9 frames)
  let push = 0;
  for (const p of PLACED) {
    if (frame >= p.f0 && frame < p.f1) {
      const d = p.f1 - p.f0;
      const l = frame - p.f0;
      push = 0.035 * interpolate(l, [0, 9, Math.max(9, d - 9), d], [0, 1, 1.25, 1.3], { ...CLAMP, easing: EASE });
      break;
    }
  }
  // socos nas palavras-atrás (PLAYBOOK-2 Etapa 11)
  let punch = 0;
  for (const f of PUNCH_FRAMES) {
    const l = frame - f;
    if (l >= 0 && l <= 16) {
      punch = 0.04 * Math.sin((l / 16) * Math.PI);
      break;
    }
  }
  return kb + push + punch;
};

const SceneBody: React.FC<{ p: Placed }> = ({ p }) => {
  const frame = useCurrentFrame();
  const m: Marks = {};
  for (const [k, v] of Object.entries(p.marks)) m[k] = sec(v) - p.f0;
  const dur = p.f1 - p.f0;
  const Comp = p.Comp;
  // saída: no último frame da cena a tela está limpa (ExitFade curto)
  const exit = interpolate(frame, [dur - 5, dur], [1, 0], CLAMP);
  const body = (
    <AbsoluteFill style={{ opacity: exit }}>
      {p.behind ? <BehindWord p={p} /> : null}
      <Comp m={m} dur={dur} />
    </AbsoluteFill>
  );
  // motion blur só nas entradas (é onde há movimento rápido) — custo de render controlado
  if (frame < 14) {
    return (
      <CameraMotionBlur shutterAngle={150} samples={5}>
        {body}
      </CameraMotionBlur>
    );
  }
  return body;
};

/* ───────────── 4. legenda simples (Etapa 8) ───────────── */
type Page = { words: typeof WORDS; startMs: number; endMs: number };
const PAGES: Page[] = (() => {
  const pages: Page[] = [];
  let cur: typeof WORDS = [];
  const flush = () => {
    if (cur.length) pages.push({ words: cur, startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs });
    cur = [];
  };
  for (const w of WORDS) {
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (cur.length >= 3 || chars > 24) flush();
    // pausa longa (troca de bloco) também quebra
    if (cur.length && w.startMs - cur[cur.length - 1].endMs > 450) flush();
    cur.push(w);
    if (/[.!?:]$/.test(w.text)) flush();
  }
  flush();
  return pages;
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  if (isBehindAt(ms / 1000)) return null;
  let page: Page | null = null;
  for (let i = 0; i < PAGES.length; i++) {
    const nx = i + 1 < PAGES.length ? PAGES[i + 1].startMs : Infinity;
    if (ms >= PAGES[i].startMs && ms < Math.min(nx, PAGES[i].endMs + 700)) {
      page = PAGES[i];
      break;
    }
  }
  if (!page) return null;
  const enter = spring({ frame: frame - (page.startMs / 1000) * fps, fps, config: { damping: 18, mass: 0.55, stiffness: 170 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 66, pointerEvents: "none" }}>
      <div
        style={{
          transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
          opacity: Math.min(1, enter * 2.2),
          display: "flex",
          gap: "4px 8px",
          justifyContent: "center",
        }}
      >
        {page.words.map((w, i) => {
          const active = ms >= w.startMs && ms < w.endMs + 60;
          const spoken = ms >= w.startMs;
          const pop = spring({ frame: frame - (w.startMs / 1000) * fps, fps, config: { damping: 14, stiffness: 210, mass: 0.42 } });
          return (
            <span
              key={i}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 800,
                fontSize: 46,
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                color: "#FFFFFF",
                opacity: active ? 1 : spoken ? 0.72 : 0.55,
                transform: `scale(${active ? 1 + 0.08 * Math.min(1, pop) : 1})`,
                display: "inline-block",
                padding: "4px 10px",
                whiteSpace: "nowrap",
                textShadow: "0 2px 0 rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.45)",
              }}
            >
              {w.text.replace(/^["“”(]+|["“”.,!?;:)]+$/g, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 6. áudio ───────────── */
const SoundFX: React.FC = () => (
  <>
    {CUES.map((c, i) => (
      <Sequence key={`${c.file}-${i}`} from={Math.max(0, Math.round(c.at * FPS))} durationInFrames={FPS * 2} name={`sfx:${c.file}`} layout="none">
        <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={MASTER * c.volume} />
      </Sequence>
    ))}
  </>
);

export const WonneMaxVSL: React.FC<{ noCaptions?: boolean }> = ({ noCaptions = false }) => {
  const scale = useCamera();
  return (
    <AbsoluteFill style={{ backgroundColor: WM.ink }}>
      <Stage />
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {PLACED.map((p) => (
          <Sequence key={p.id} from={p.f0} durationInFrames={p.f1 - p.f0} name={p.id}>
            <SceneBody p={p} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <FilmLook grain={0.05} vignette={0.42} />
      {noCaptions ? null : <Captions />}
      <Transitions cuts={CUTS} />
      <Audio src={staticFile("wmvsl/narracao.wav")} />
      <SoundFX />
    </AbsoluteFill>
  );
};
