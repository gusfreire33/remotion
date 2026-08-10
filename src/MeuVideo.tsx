import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
// <Video> do @remotion/media (mesmo player do B-roll): decodifica direto, sem
// o cache de frames em disco do OffthreadVideo — que, com a fonte 4K, gravava
// ~33 MB por frame em temp e estourava o disco no render.
import { Video } from "@remotion/media";
import { secToFrame, DURATION_IN_FRAMES } from "./lib/constants";
import { BEAT_TIMING, EXTRA_PUNCHES_S } from "./lib/beats";
import { BEHIND_WORDS } from "./lib/behind";
import { Overlays } from "./overlays/Overlays";
import { Captions } from "./components/Captions";
import { BehindText } from "./components/BehindText";
import { Transitions } from "./components/Transitions";
import { SoundFX } from "./audio/SoundFX";

const EASE = Easing.inOut(Easing.ease);

// Fonte do vídeo: no Studio/preview usa o proxy 1080p (leve); no render final
// (REMOTION_USE_4K=1) usa a fonte 4K nativa (2160x3840) pra máxima qualidade,
// combinada com --scale=2 pra saída em 4K.
const VIDEO_SRC =
  typeof process !== "undefined" && process.env.REMOTION_USE_4K === "1"
    ? "video2_src.mp4"
    : "video2_1080.mp4";

// Recorte do apresentador com canal alfa (gerado por scripts/make-matte.py a
// partir do proxy 1080p). É o que permite o texto passar ATRÁS dele.
const MATTE_SRC = "matte-pessoa.webm";

// Janelas dos beats em frames (pro "push in" sustentado durante a animacao).
const BEAT_FRAMES = BEAT_TIMING.map((b) => ({
  a: secToFrame(b.from),
  z: secToFrame(b.to),
}));

// Centros dos "swells" de enfase (frases de impacto fora dos beats).
const SWELL_CENTERS = EXTRA_PUNCHES_S.map(secToFrame);

// Zoom de enfase LONGO e suave.
const SWELL_IN = 14;
const SWELL_HOLD = 9;
const SWELL_OUT = 16;
const SWELL_AMT = 0.05;

// Push-in dos beats: bordas suaves (ease).
const BEAT_EDGE = 9;
const BEAT_AMT = 0.06;

const useVideoScale = (frame: number): number => {
  // Ken Burns lento e continuo
  const base = interpolate(frame, [0, DURATION_IN_FRAMES], [1.03, 1.09], {
    extrapolateRight: "clamp",
  });

  let extra = 0;

  // "push in" sustentado enquanto a animacao esta na tela (zoom in suave -> out)
  for (const { a, z } of BEAT_FRAMES) {
    if (frame >= a - BEAT_EDGE && frame <= z + BEAT_EDGE) {
      const inAmt = interpolate(frame, [a - BEAT_EDGE, a + BEAT_EDGE], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE,
      });
      const outAmt = interpolate(frame, [z - BEAT_EDGE, z + BEAT_EDGE], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE,
      });
      extra += BEAT_AMT * Math.min(inAmt, outAmt);
    }
  }

  // swell de enfase: zoom in/out longo e gradual nas frases de impacto
  for (const c of SWELL_CENTERS) {
    const inStart = c - SWELL_IN;
    const holdEnd = c + SWELL_HOLD;
    const outEnd = holdEnd + SWELL_OUT;
    if (frame >= inStart && frame <= outEnd) {
      let s: number;
      if (frame < c) {
        s = interpolate(frame, [inStart, c], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE,
        });
      } else if (frame <= holdEnd) {
        s = 1;
      } else {
        s = interpolate(frame, [holdEnd, outEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE,
        });
      }
      extra += SWELL_AMT * s;
    }
  }

  return base + extra;
};

// Janelas (em frames) em que o recorte precisa estar visível.
const CUTOUT_WINDOWS = BEHIND_WORDS.map((w) => ({
  a: secToFrame(w.from),
  z: secToFrame(w.to),
}));

/**
 * Recorte do apresentador, por cima do texto.
 *
 * Dois cuidados que custaram caro aqui:
 *
 * 1. NADA de <Sequence>. Dentro de uma Sequence o vídeo recomeça do frame 0 a
 *    cada janela e o recorte sai de sincronia com o vídeo base (a pessoa fica
 *    numa pose diferente da que está embaixo). Ele fica sempre montado, no
 *    tempo absoluto da composição, e o que liga/desliga é a OPACIDADE.
 *
 * 2. <OffthreadVideo transparent>, não o <Video> do @remotion/media: o
 *    WebM/VP9 com canal alfa não decodifica no player do @remotion/media
 *    (sai listrado de verde/magenta). O `transparent` do OffthreadVideo é o
 *    caminho suportado pra alfa.
 *
 * Fora das janelas a opacidade é 0 — o recorte seria só um clone do vídeo
 * base, e mantê-lo aceso só arriscaria mostrar franja na borda.
 *
 * `scale` vem do MESMO cálculo do vídeo base — é isso que faz o recorte
 * encaixar pixel a pixel em cima dele.
 */
const PersonCutout: React.FC<{ scale: number; frame: number }> = ({
  scale,
  frame,
}) => {
  // 2 frames de rampa nas bordas: o recorte é igual ao que está embaixo, mas
  // a rampa evita qualquer estalo na franja.
  let opacity = 0;
  for (const { a, z } of CUTOUT_WINDOWS) {
    if (frame >= a - 2 && frame <= z + 2) {
      opacity = Math.max(
        opacity,
        Math.min(
          interpolate(frame, [a - 2, a], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          interpolate(frame, [z, z + 2], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        ),
      );
    }
  }

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      <OffthreadVideo
        src={staticFile(MATTE_SRC)}
        transparent
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

export const MeuVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = useVideoScale(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* 1. Video base com zoom dinamico */}
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {/* sem `muted`: é daqui que vem a voz do vídeo */}
        <Video src={staticFile(VIDEO_SRC)} objectFit="cover" />
      </AbsoluteFill>

      {/* 2. Palavra marcante — fica ATRÁS da pessoa (camada 3 cobre ela) */}
      <BehindText />

      {/* 3. Recorte do apresentador por cima do texto: o efeito "por trás" */}
      <PersonCutout scale={scale} frame={frame} />

      {/* 4. Gradiente inferior pra dar leitura nas legendas */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 26%, rgba(0,0,0,0) 46%)",
        }}
      />

      {/* 5. Ilustracoes de motion design + B-roll (estilo AE, com motion blur) */}
      <Overlays />

      {/* 6. Legendas — simples, só texto branco (pedido do dono 09/08/2026) */}
      <Captions />

      {/* 7. Transições. Fica por ÚLTIMO de propósito: usa `backdrop-filter`,
             que só borra o que está atrás dela — pra pegar o quadro inteiro
             (vídeo + overlay + legenda) precisa ser a camada de cima. */}
      <Transitions />

      {/* 8. Efeitos sonoros — religados em 09/08/2026 (o dono pediu "pra
             deixar o vídeo vivo"), sempre sob a voz do vídeo original. */}
      <SoundFX />
    </AbsoluteFill>
  );
};
