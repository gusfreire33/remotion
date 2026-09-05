import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { BehindLayer } from "./components/BehindLayer";
import { FilmLook } from "./components/FilmLook";
import { Transitions } from "./components/Transitions";
import { Callouts } from "./overlays/Callouts";
import { SoundFX } from "./audio/SoundFX";
import { CALLOUTS, PUNCHES_S } from "./lib/callouts";
import { FPS } from "./lib/constants";

const VIDEO_SRC = "video30_1080.mp4";
const MATTE_SRC = "matte-pessoa.webm";

/**
 * "VSLL Wonne V4.mp4" — VSL horizontal 1920x1080, estilo da referência
 * "Bilhon-OS Motor de Receita Permanente" (04/09/2026).
 *
 * Pilha:
 *   1. vídeo base (scale S) COM blur leve (bokeh)
 *   2. BehindLayer — texto grande cruzando a cabeça
 *   3. recorte da pessoa (mesmo scale S) — aceso o vídeo inteiro
 *   4. FilmLook — vinheta + grão (por baixo do texto, pra ele ficar nítido)
 *   5. Callouts — texto nos cantos, chips, steps, cartões full-screen
 *   6. Transitions — sempre por último (backdrop-filter)
 *   7. Music + SoundFX
 */
const BG_BLUR_MAX_PX = 20;
const BG_BLUR_PCT = 0.2;
const BG_BLUR_PX = BG_BLUR_MAX_PX * BG_BLUR_PCT;

const EASE = Easing.inOut(Easing.ease);
const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const useVideoScale = (): number => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ken Burns lento no vídeo inteiro (também sobra borda pro blur)
  const kenBurns = interpolate(frame, [0, durationInFrames], [1.03, 1.08], CLAMP);

  // push-in sustentado durante o texto atrás da pessoa
  let push = 0;
  for (const c of CALLOUTS) {
    if (c.kind !== "behind") continue;
    const from = Math.round(c.from * FPS);
    const to = Math.round(c.to * FPS);
    if (frame >= from && frame < to) {
      const local = frame - from;
      const dur = Math.max(1, to - from);
      const edge = Math.min(10, Math.floor(dur / 3));
      push =
        0.05 *
        interpolate(local, [0, edge, Math.max(edge, dur - edge), dur], [0, 1, 1, 0], {
          ...CLAMP,
          easing: EASE,
        });
      break;
    }
  }

  // soco curto nas entradas fortes
  let punch = 0;
  for (const s of PUNCHES_S) {
    const local = frame - Math.round(s * FPS);
    if (local >= 0 && local <= 16) {
      punch = 0.04 * Math.sin((local / 16) * Math.PI);
      break;
    }
  }

  return kenBurns + push + punch;
};

export const MeuVideo: React.FC = () => {
  const scale = useVideoScale();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${BG_BLUR_PX}px)`,
        }}
      >
        <Video src={staticFile(VIDEO_SRC)} objectFit="cover" />
      </AbsoluteFill>

      <BehindLayer />

      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={staticFile(MATTE_SRC)}
          transparent
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <FilmLook grain={0.07} vignette={0.5} />
      <Callouts />
      <Transitions />
      {/* Trilha de fundo REMOVIDA a pedido do dono (05/09/2026): a trilha
          sintetizada soou como ruído. Pra voltar: <Music /> (audio/Music.tsx). */}
      <SoundFX />
    </AbsoluteFill>
  );
};
