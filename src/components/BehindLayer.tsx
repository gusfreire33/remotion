import { AbsoluteFill, Sequence } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { CALLOUTS } from "../lib/callouts";
import { secToFrame } from "../lib/constants";
import { Lines } from "../overlays/Callouts";

/* ------------------------------------------------------------------------
   TEXTO ATRÁS DA PESSOA — estilo VSL.

   Fica ENTRE o vídeo base (borrado) e o recorte da pessoa. O bloco é
   centralizado e cruza a cabeça: a base da linha grande cai perto do queixo,
   então parte das letras some atrás do rosto — é isso que vende o "atrás".

   `top` padrão MEDIDO no matte deste vídeo (Etapa 6.4): ver `BEHIND_TOP`.
   --------------------------------------------------------------------- */

// topo do bloco de 2 linhas (sans ~60 + mono ~104 + gap) na tela 1080.
// MEDIDO (measure-matte.py, 13 janelas): topo da cabeça no matte 176–248 (típico
// 200–220), largura ~205 → queixo ≈ y 470, ombros ≈ 610–680. Na tela (S≈1,08)
// o topo cai em ~175–215.
// Bloco de ~210px (sans 62 + mono 116): sans nos olhos, mono na boca/queixo.
export const BEHIND_TOP = 230;

export const BehindLayer: React.FC = () => (
  <Sequence name="ATRAS DA PESSOA" layout="none">
    {CALLOUTS.map((c, i) => {
      if (c.kind !== "behind") return null;
      const from = secToFrame(c.from);
      const dur = Math.max(1, secToFrame(c.to - c.from));
      const single = c.lines.length === 1;
      return (
        <Sequence
          key={i}
          from={from}
          durationInFrames={dur}
          name={`atras: ${c.lines[c.lines.length - 1].text}`}
        >
          <CameraMotionBlur shutterAngle={150} samples={6}>
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: c.top ?? (single ? BEHIND_TOP + 70 : BEHIND_TOP),
              }}
            >
              <div style={{ width: 1700 }}>
                <Lines
                  from={c.from}
                  to={c.to}
                  lines={c.lines}
                  sizes={{ sans: 62, mono: 116 }}
                />
              </div>
            </AbsoluteFill>
          </CameraMotionBlur>
        </Sequence>
      );
    })}
  </Sequence>
);
