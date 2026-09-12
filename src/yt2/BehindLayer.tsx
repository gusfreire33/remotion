import { AbsoluteFill, Sequence } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { CALLOUTS } from "./lib/map";
import { secToFrame } from "./lib/constants";
import { Lines } from "./Callouts";

/* ------------------------------------------------------------------------
   TEXTO ATRÁS DA PESSOA — "Vídeo 2 YT".

   Fica ENTRE o vídeo base e o recorte da pessoa. O bloco é centralizado e
   cruza a cabeça: a base da linha grande cai perto do queixo.

   `BEHIND_TOP` MEDIDO no matte deste vídeo (Etapa 6.4) — ver comentário.
   --------------------------------------------------------------------- */

// MEDIDO (measure-matte.py, 19 janelas): topo da cabeça no matte 107–175 (típico
// ~145), largura ~215 → queixo ≈ 445, ombros ≈ 600. Na tela (S≈1,10): topo ≈ 105,
// queixo ≈ 435. Bloco de 2 linhas (~210px) com top 150 → a linha mono (230–360)
// cruza o rosto na altura dos olhos/nariz — a palavra é cortada pela cabeça.
export const BEHIND_TOP = 150;

/** true se o segundo cai numa janela de texto atrás (liga o recorte) */
export const isBehindAt = (s: number): boolean =>
  CALLOUTS.some((c) => c.kind === "behind" && s >= c.from - 0.1 && s < c.to + 0.1);

export const BehindLayer: React.FC = () => (
  <Sequence name="ATRAS DA PESSOA" layout="none">
    {CALLOUTS.map((c, i) => {
      if (c.kind !== "behind") return null;
      const from = secToFrame(c.from);
      const dur = Math.max(1, secToFrame(c.to - c.from));
      const single = c.lines.length === 1;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`atras: ${c.lines[c.lines.length - 1].text}`}>
          <CameraMotionBlur shutterAngle={150} samples={6}>
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: c.top ?? (single ? BEHIND_TOP + 70 : BEHIND_TOP),
              }}
            >
              {/* a cabeça deste vídeo fica em x≈1080 (não no centro): o bloco é
                  deslocado 100px pra direita pra palavra ser cortada no meio.
                  Mono grande (150) pra sobrar letra dos dois lados da cabeça. */}
              <div style={{ width: 1700, marginLeft: 200 }}>
                <Lines from={c.from} to={c.to} lines={c.lines} sizes={{ sans: 62, mono: 150 }} />
              </div>
            </AbsoluteFill>
          </CameraMotionBlur>
        </Sequence>
      );
    })}
  </Sequence>
);
