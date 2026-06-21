import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { secToFrame } from "./lib/constants";
import { BEAT_TIMING, EXTRA_PUNCHES_S } from "./lib/beats";
import { Overlays } from "./overlays/Overlays";
import { Captions } from "./components/Captions";
import { SoundFX } from "./audio/SoundFX";

// Socos rapidos de zoom: inicio de cada beat + fins de frase (enfase).
const PUNCH_FRAMES = [
  ...BEAT_TIMING.map((b) => secToFrame(b.from)),
  ...EXTRA_PUNCHES_S.map(secToFrame),
];

// Janelas dos beats em frames (pro "push in" sustentado durante a animacao).
const BEAT_FRAMES = BEAT_TIMING.map((b) => ({
  a: secToFrame(b.from),
  z: secToFrame(b.to),
}));

const useVideoScale = (frame: number): number => {
  // Ken Burns lento e continuo
  const base = interpolate(frame, [0, 3216], [1.03, 1.09], {
    extrapolateRight: "clamp",
  });

  let extra = 0;

  // "push in" sustentado enquanto a animacao esta na tela (zoom in -> out)
  for (const { a, z } of BEAT_FRAMES) {
    if (frame >= a - 10 && frame <= z + 10) {
      const inAmt = interpolate(frame, [a - 10, a + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const outAmt = interpolate(frame, [z - 10, z + 10], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      extra += 0.055 * Math.min(inAmt, outAmt);
    }
  }

  // soco rapido (zoom in/out) nos momentos de enfase
  for (const pf of PUNCH_FRAMES) {
    const d = frame - pf;
    if (d >= 0 && d <= 16) {
      extra += Math.sin((d / 16) * Math.PI) * 0.05;
    }
  }

  return base + extra;
};

export const MeuVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = useVideoScale(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Video base com zoom dinamico */}
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile("video1.mp4")} />
      </AbsoluteFill>

      {/* Gradiente inferior pra dar leitura nas legendas */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 26%, rgba(0,0,0,0) 46%)",
        }}
      />

      {/* Ilustracoes de motion design (estilo After Effects, com motion blur) */}
      <Overlays />

      {/* Legendas animadas estilo TikTok */}
      <Captions />

      {/* Efeitos sonoros (volume bem abaixo da voz do video) */}
      <SoundFX />
    </AbsoluteFill>
  );
};
