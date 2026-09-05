import { AbsoluteFill, useCurrentFrame } from "remotion";

/* ------------------------------------------------------------------------
   PELÍCULA — grão fino + vinheta, a "cara de cinema" da referência.

   O grão é uma textura SVG (feTurbulence) que troca de semente a cada frame —
   determinística por frame, então o render é reproduzível. Vinheta escurece
   as bordas e puxa o olho pro centro (onde está a pessoa).
   --------------------------------------------------------------------- */

export const FilmLook: React.FC<{ grain?: number; vignette?: number }> = ({
  grain = 0.08,
  vignette = 0.55,
}) => {
  const frame = useCurrentFrame();
  // 4 sementes alternando: o grão "vive" sem custar 4 texturas novas/frame
  const seed = (frame % 4) + 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 95% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: grain, mixBlendMode: "overlay" }}
      >
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
