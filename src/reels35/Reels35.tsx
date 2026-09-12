import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { BehindText } from "../components/BehindText";
import { Captions } from "../components/Captions";
import { Transitions } from "../components/Transitions";
import { buildPages } from "../lib/pages";
import { WORDS } from "./data/words";
import { BEAT_TIMING } from "./lib/beats";
import { BEHIND_WORDS, EXTRA_PUNCHES_S, isBehindWindow } from "./lib/behind";
import { CUTS } from "./lib/cuts";
import { ASSET, DURATION_IN_FRAMES, FPS, frameAt } from "./lib/constants";
import { Overlays } from "./Overlays";
import { SoundFX } from "./SoundFX";

/**
 * "Reels 35" — Framework 2 (Captions), SEM blur de fundo (pedido do dono).
 *
 * Pilha:
 *   1. vídeo base (scale S)              ← nítido, sem filter
 *   2. BehindText                        ← a palavra
 *   3. recorte da pessoa (MESMO scale S) ← aceso só nas janelas das palavras,
 *                                          em tempo absoluto (nada de Sequence)
 *   4. overlays / B-roll / legenda
 *   5. SoundFX
 *   6. Transitions                       ← sempre por último (backdrop-filter)
 */
const PAGES = buildPages(WORDS);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useVideoScale = (): number => {
  const frame = useCurrentFrame();
  // Ken Burns contínuo no vídeo inteiro
  const ken = interpolate(frame, [0, DURATION_IN_FRAMES - 1], [1.03, 1.09], CLAMP);
  // push-in sustentado durante cada beat
  let push = 0;
  for (const beat of BEAT_TIMING) {
    const a = frameAt(beat.from);
    const b = frameAt(beat.to);
    if (frame >= a && frame < b) {
      const edge = Math.min(9, Math.floor((b - a) / 3));
      push =
        0.06 *
        interpolate(frame, [a, a + edge, b - edge, b - 1], [0, 1, 1, 0], {
          ...CLAMP,
          easing: Easing.inOut(Easing.ease),
        });
    }
  }
  // socos: exatamente nas palavras-atrás
  const punch = EXTRA_PUNCHES_S.reduce((sum, s) => {
    const local = frame - frameAt(s);
    return sum + (local >= 0 && local <= 16 ? 0.05 * Math.sin((local / 16) * Math.PI) : 0);
  }, 0);
  return ken + push + punch;
};

export const Reels35: React.FC<{ master4k?: boolean }> = ({ master4k = false }) => {
  const frame = useCurrentFrame();
  const scale = useVideoScale();
  const behind = isBehindWindow((frame / FPS) * 1000);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video
          src={staticFile(`${ASSET}${master4k ? "source4k.mp4" : "source1080.mp4"}`)}
          objectFit="cover"
        />
      </AbsoluteFill>
      <CameraMotionBlur shutterAngle={150} samples={6}>
        <BehindText words={BEHIND_WORDS} />
      </CameraMotionBlur>
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: behind ? 1 : 0 }}>
        <OffthreadVideo
          src={staticFile(`${ASSET}${master4k ? "matte4k.webm" : "matte.webm"}`)}
          transparent
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <Overlays />
      <Captions pages={PAGES} hideAt={isBehindWindow} />
      <SoundFX />
      <Transitions cuts={CUTS} />
    </AbsoluteFill>
  );
};
