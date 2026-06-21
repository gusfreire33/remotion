import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Transicao "film burn" (vazamento de luz / queimado de pelicula) que dispara
// nos ultimos frames de cada cena de animacao. Procedural: gradientes quentes
// + blend "screen" + blur, pra parecer organico como uma queima de filme.
export const FilmBurn: React.FC<{ duration?: number }> = ({ duration = 18 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const start = durationInFrames - duration;

  if (frame < start) {
    return null;
  }

  const t = Math.min(1, Math.max(0, (frame - start) / duration)); // 0..1
  // envelope sobe rapido e cai (pico ~meio)
  const env = Math.sin(t * Math.PI);
  // segunda mancha entra um pouco depois
  const t2 = Math.min(1, Math.max(0, (t - 0.18) / 0.82));
  const env2 = Math.sin(t2 * Math.PI);
  // estouro branco curtinho no pico
  const flash = Math.max(0, 1 - Math.abs(t - 0.42) / 0.16);

  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {/* mancha quente principal varrendo de baixo pra cima */}
      <AbsoluteFill
        style={{
          filter: "blur(10px)",
          transform: `scale(${1 + t * 0.6})`,
          background: `radial-gradient(58% 68% at ${18 + t * 64}% ${112 - t * 46}%, rgba(255,243,205,${0.95 * env}) 0%, rgba(255,150,25,${0.9 * env}) 20%, rgba(205,35,0,${0.55 * env}) 44%, rgba(0,0,0,0) 70%)`,
        }}
      />
      {/* mancha secundaria no canto oposto, defasada */}
      <AbsoluteFill
        style={{
          filter: "blur(16px)",
          transform: `scale(${1 + t2 * 0.5})`,
          background: `radial-gradient(50% 55% at ${88 - t2 * 40}% ${10 + t2 * 30}%, rgba(255,225,170,${0.8 * env2}) 0%, rgba(255,110,0,${0.7 * env2}) 26%, rgba(150,10,0,${0.4 * env2}) 50%, rgba(0,0,0,0) 72%)`,
        }}
      />
      {/* estouro branco no pico */}
      <AbsoluteFill
        style={{
          background: "rgba(255,248,232,1)",
          opacity: interpolate(flash, [0, 1], [0, 0.55]),
        }}
      />
    </AbsoluteFill>
  );
};
