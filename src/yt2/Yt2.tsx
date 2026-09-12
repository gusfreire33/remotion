import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { FilmLook } from "../components/FilmLook";
import { Transitions } from "../components/Transitions";
import { BehindLayer, isBehindAt } from "./BehindLayer";
import { Callouts } from "./Callouts";
import { SoundFX } from "./SoundFX";
import { CALLOUTS, PUNCHES_S } from "./lib/map";
import { CUTS } from "./lib/cuts";
import { DURATION_IN_FRAMES, FPS, MATTE_SRC, VIDEO_SRC } from "./lib/constants";

/**
 * "Vídeo 2 YT.mp4" — YouTube horizontal 1920x1080 (4K no render).
 * Framework 2 + gramática da referência "Bilhon-OS", com os ajustes pedidos
 * pelo dono em 11/09/2026:
 *   · SEM blur de fundo (a câmera já desfocou) → o recorte da pessoa só
 *     acende nas janelas de texto-atrás (liga/desliga por opacidade, nunca
 *     dentro de <Sequence>)
 *   · SEM legenda
 *   · mais B-roll horizontal do Pexels
 *   · cartões com fundo animado + texto digitado com teclado
 *   · ícones (React Icons)
 *
 * Pilha:
 *   1. vídeo base (scale S)
 *   2. BehindLayer — texto grande cruzando a cabeça
 *   3. recorte da pessoa (MESMO scale S) — aceso só nas janelas atrás
 *   4. FilmLook — vinheta + grão leve
 *   5. Callouts — over / chips / steps / card / broll / icons / stat
 *   6. Transitions — sempre por último (backdrop-filter)
 *   7. SoundFX
 */
const EASE = Easing.inOut(Easing.ease);
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const useVideoScale = (): number => {
  const frame = useCurrentFrame();
  const kenBurns = interpolate(frame, [0, DURATION_IN_FRAMES], [1.03, 1.08], CLAMP);

  let push = 0;
  for (const c of CALLOUTS) {
    if (c.kind !== "behind" && c.kind !== "over") continue;
    const from = Math.round(c.from * FPS);
    const to = Math.round(c.to * FPS);
    if (frame >= from && frame < to) {
      const local = frame - from;
      const dur = Math.max(1, to - from);
      const edge = Math.min(10, Math.floor(dur / 3));
      push =
        (c.kind === "behind" ? 0.05 : 0.03) *
        interpolate(local, [0, edge, Math.max(edge, dur - edge), dur], [0, 1, 1, 0], {
          ...CLAMP,
          easing: EASE,
        });
      break;
    }
  }

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

export const Yt2: React.FC<{ noMatte?: boolean }> = ({ noMatte = false }) => {
  const frame = useCurrentFrame();
  const scale = useVideoScale();
  const behind = isBehindAt(frame / FPS);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video src={staticFile(VIDEO_SRC)} objectFit="cover" />
      </AbsoluteFill>

      <BehindLayer />

      {noMatte ? null : (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: behind ? 1 : 0 }}>
        <OffthreadVideo
          src={staticFile(MATTE_SRC)}
          transparent
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      )}

      <FilmLook grain={0.06} vignette={0.45} />
      <Callouts />
      <Transitions cuts={CUTS} />
      <SoundFX />
    </AbsoluteFill>
  );
};
