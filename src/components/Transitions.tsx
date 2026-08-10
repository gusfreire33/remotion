import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { secToFrame } from "../lib/constants";
import { CUTS, type CutKind } from "../lib/cuts";

const EASE = Easing.inOut(Easing.ease);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * TRANSIÇÕES (pedido do dono, 09/08/2026 — "deixar o vídeo vivo").
 *
 * Esta camada fica POR CIMA de tudo, e é de propósito: ela usa
 * `backdrop-filter`, que filtra o que está atrás do elemento. É isso que
 * permite borrar o quadro inteiro (vídeo + legenda + overlay) no frame do
 * corte — sem isso a transição seria só um brilho colado na frente.
 *
 * Três gramáticas, uma por tipo de corte:
 *   whip   · entrada/saída de B-roll — borrão forte + risco de luz varrendo
 *   punch  · entrada de overlay — borrão curto + estouro branco
 *   glitch · entrada de palavra atrás da pessoa — split RGB digital
 *
 * ⚠️ Isto NÃO é o film burn (que segue removido). São cortes secos, curtos
 * (5–8 frames), no ritmo do Captions.
 */

/** Borrão + risco de luz varrendo a tela na diagonal. */
const Whip: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // pico logo no começo e resolve rápido: o corte tem que ser sentido, não visto
  const amt = interpolate(frame, [0, 2, dur], [0, 1, 0], {
    ...CLAMP,
    easing: EASE,
  });
  const sweep = interpolate(frame, [0, dur], [-140, 140], CLAMP);

  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${amt * 20}px) saturate(${1 + amt * 0.5})`,
        opacity: amt > 0.01 ? 1 : 0,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(105deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 58%)",
          transform: `translateX(${sweep}%)`,
          opacity: amt * 0.85,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

/** Borrão curto + estouro branco — entrada de overlay. */
const Punch: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const amt = interpolate(frame, [0, 2, dur], [0, 1, 0], {
    ...CLAMP,
    easing: EASE,
  });
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${amt * 9}px)`,
        background: `rgba(255,255,255,${amt * 0.16})`,
        opacity: amt > 0.01 ? 1 : 0,
      }}
    />
  );
};

/** Split RGB em faixas — entrada da palavra atrás da pessoa. */
const Glitch: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const amt = interpolate(frame, [0, 1, dur], [0, 1, 0], CLAMP);
  // Faixas em posições FIXAS — nada de Math.random: o render tem que ser
  // determinístico, senão cada frame sorteia um desenho diferente e a
  // transição vira chuvisco.
  //
  // Finas, escuras e em "screen": assim elas SOMAM uma tinta vermelha/ciano
  // por cima da imagem (que é o que o split RGB faz de verdade). Faixas
  // grossas e saturadas viravam retângulos chapados cobrindo o rosto.
  const bands = [
    { top: 300, h: 22, dx: 30, color: "rgb(120,0,34)" },
    { top: 430, h: 14, dx: -18, color: "rgb(0,86,104)" },
    { top: 610, h: 34, dx: 22, color: "rgb(110,0,30)" },
    { top: 700, h: 16, dx: -30, color: "rgb(0,92,110)" },
    { top: 950, h: 26, dx: 16, color: "rgb(96,0,26)" },
    { top: 1120, h: 18, dx: -24, color: "rgb(0,80,96)" },
    { top: 1380, h: 30, dx: 20, color: "rgb(104,0,28)" },
  ];

  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${amt * 6}px)`,
        opacity: amt > 0.01 ? 1 : 0,
      }}
    >
      {bands.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: b.top,
            height: b.h,
            background: b.color,
            transform: `translateX(${b.dx * amt}px)`,
            opacity: amt * 0.85,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const KINDS: Record<CutKind, React.FC<{ dur: number }>> = {
  whip: Whip,
  punch: Punch,
  glitch: Glitch,
};

const DURATION: Record<CutKind, number> = {
  whip: 8,
  punch: 5,
  glitch: 5,
};

export const Transitions: React.FC = () => (
  <Sequence name="TRANSICOES" layout="none">
    {CUTS.map((c, i) => {
      const Comp = KINDS[c.kind];
      const dur = DURATION[c.kind];
      // começa 2 frames ANTES do corte: o borrão tem que já estar subindo
      // quando a imagem troca, senão a transição chega atrasada
      const from = Math.max(0, secToFrame(c.at) - 2);
      return (
        <Sequence
          key={`${c.kind}-${c.at}-${i}`}
          from={from}
          durationInFrames={dur}
          name={`cut:${c.kind}@${c.at}s`}
        >
          <Comp dur={dur} />
        </Sequence>
      );
    })}
  </Sequence>
);
