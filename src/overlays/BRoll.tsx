import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Loop,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import type { BRollClip } from "../lib/broll";
import { FPS } from "../lib/constants";

const EASE = Easing.inOut(Easing.ease);

/* ------------------------------------------------------------------ *
 * B-ROLL — no lugar das animações de motion design, entram vídeos e
 * fotos GRATUITOS do Pexels, escolhidos pra ilustrar exatamente o que
 * está sendo dito naquele beat.
 *
 * O tratamento (entrada com whip, Ken Burns, película, film burn na
 * saída, ExitFade) é o mesmo do playbook — só muda o conteúdo.
 * ------------------------------------------------------------------ */

/** Ken Burns + entrada rápida (whip) + saída. Envolve qualquer mídia. */
const Move: React.FC<{
  children: React.ReactNode;
  zoom: [number, number];
  pan?: [number, number];
  inFrames?: number;
}> = ({ children, zoom, pan = [0, 0], inFrames = 5 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // zoom lento contínuo (Ken Burns)
  const k = interpolate(frame, [0, durationInFrames], zoom, {
    extrapolateRight: "clamp",
  });
  // entrada: um "whip" curto — escala extra + blur que resolve rápido
  const whip = interpolate(frame, [0, inFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const px = interpolate(frame, [0, durationInFrames], [0, pan[0]], {
    extrapolateRight: "clamp",
  });
  const py = interpolate(frame, [0, durationInFrames], [0, pan[1]], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${k + whip * 0.06}) translate(${px}px, ${py}px)`,
        filter: whip > 0.02 ? `blur(${whip * 4}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Media: React.FC<{ clip: BRollClip }> = ({ clip }) => {
  const style: React.CSSProperties = { width: "100%", height: "100%" };

  if (clip.kind === "photo") {
    return (
      <Img
        src={staticFile(`broll/${clip.slug}.jpg`)}
        style={{ ...style, objectFit: "cover" }}
      />
    );
  }

  // <Video> (@remotion/media) decodifica/busca melhor que o OffthreadVideo no
  // preview — é o que evita o "flash" preto no primeiro frame do corte.
  const video = (
    <Video
      src={staticFile(`broll/${clip.slug}.mp4`)}
      style={style}
      objectFit="cover"
      muted
      trimBefore={Math.round((clip.startAt ?? 0) * FPS)}
      playbackRate={clip.speed ?? 1}
    />
  );

  // Clipe mais curto que o beat: repete em loop (o corte fica escondido
  // pelo movimento + pela película).
  if (clip.loopFrames) {
    return <Loop durationInFrames={clip.loopFrames}>{video}</Loop>;
  }
  return video;
};

/**
 * Cobre a tela inteira — o clipe "toma" o vídeo enquanto a voz continua.
 * SEM fundo preto: se o clipe ainda estiver carregando um frame, o que
 * aparece é o vídeo do médico (faixa de baixo), nunca um flash preto.
 */
const FullBleed: React.FC<{ clip: BRollClip }> = ({ clip }) => (
  <AbsoluteFill>
    <Move zoom={clip.zoom ?? [1.02, 1.12]} pan={clip.pan}>
      <Media clip={clip} />
    </Move>
    {/* vinheta: fecha as bordas e ajuda a legenda a ler por cima */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 24%, rgba(0,0,0,0) 44%)",
      }}
    />
  </AbsoluteFill>
);

/** Card flutuante: o clipe entra como inserção, o rosto continua visível. */
const Card: React.FC<{ clip: BRollClip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 10], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const tilt = interpolate(frame, [0, 10], [-3.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: clip.cardTop ?? 640,
      }}
    >
      <div
        style={{
          // a legenda agora sobe até ~1130 (paddingBottom 700), então o card
          // tem que fechar acima disso — daí `cardHeight` por clipe
          width: 820,
          height: clip.cardHeight ?? 500,
          borderRadius: 38,
          overflow: "hidden",
          position: "relative",
          transform: `scale(${pop}) rotate(${tilt}deg)`,
          boxShadow: "0 34px 90px rgba(0,0,0,0.62)",
          border: "6px solid rgba(255,255,255,0.92)",
        }}
      >
        <Move zoom={clip.zoom ?? [1.04, 1.14]} pan={clip.pan} inFrames={5}>
          <Media clip={clip} />
        </Move>
      </div>
    </AbsoluteFill>
  );
};

export const BRoll: React.FC<{ clip: BRollClip }> = ({ clip }) =>
  clip.layout === "card" ? <Card clip={clip} /> : <FullBleed clip={clip} />;
