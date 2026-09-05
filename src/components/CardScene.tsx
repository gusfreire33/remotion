import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Particles } from "./Particles";
import { COLORS } from "../lib/theme";

/* ------------------------------------------------------------------------
   CARTÃO FULL-SCREEN — a cena de "respiro" da referência.

   A pessoa SOME e entra um fundo marrom-laranja escuro com fagulhas subindo,
   um facho de luz na diagonal e um retângulo translúcido com borda laranja
   fina no centro. O texto entra dentro dele (TypeIn).

   Entrada/saída: fade curto + leve escala. O `Transitions` (whip) cobre o
   corte por cima.
   --------------------------------------------------------------------- */

const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.inOut(Easing.ease);

export const CardScene: React.FC<{
  children?: ReactNode;
  /** sem o retângulo: só o fundo + texto solto (como "é pelo simples fato de que") */
  frame?: boolean;
  width?: number;
  height?: number;
  /** largura do facho de luz (0 desliga) */
  beam?: number;
  fadeIn?: number;
  fadeOut?: number;
  /** camada entre as fagulhas e o retângulo (ex.: dinheiro caindo) */
  backdrop?: ReactNode;
}> = ({
  children,
  frame: withFrame = true,
  width = 1180,
  height = 300,
  beam = 1,
  fadeIn = 8,
  fadeOut = 10,
  backdrop,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inn = interpolate(frame, [0, fadeIn], [0, 1], { ...OUT, easing: EASE });
  const out = interpolate(
    frame,
    [durationInFrames - fadeOut, durationInFrames - 1],
    [1, 0],
    { ...OUT, easing: EASE },
  );
  const o = Math.min(inn, out);
  const cardPop = interpolate(frame, [0, 14], [0.94, 1], { ...OUT, easing: EASE });
  const beamX = interpolate(frame, [0, durationInFrames], [-8, 8], OUT);

  return (
    <AbsoluteFill style={{ opacity: o }}>
      {/* fundo: marrom-laranja escuro, mais quente embaixo à esquerda */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 80% at 20% 95%, ${COLORS.cardBg2} 0%, ${COLORS.cardBg1} 38%, ${COLORS.cardBg0} 100%)`,
        }}
      />
      {/* facho de luz diagonal */}
      {beam > 0 ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(112deg, rgba(255,150,70,0) 30%, rgba(255,170,90,0.16) 46%, rgba(255,150,70,0) 62%)",
            transform: `translateX(${beamX}%)`,
            opacity: beam,
          }}
        />
      ) : null}
      <Particles count={110} />
      {backdrop}
      {/* vinheta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(110% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {withFrame ? (
          <div
            style={{
              width,
              minHeight: height,
              borderRadius: 18,
              border: `2px solid ${COLORS.orange}`,
              background:
                "linear-gradient(180deg, rgba(20,12,8,0.78) 0%, rgba(8,5,3,0.85) 100%)",
              boxShadow: `0 0 40px rgba(255,122,26,0.18), 0 30px 80px rgba(0,0,0,0.6)`,
              transform: `scale(${cardPop})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              padding: "36px 60px",
            }}
          >
            {children}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
              padding: "0 120px",
            }}
          >
            {children}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** linha fina laranja que "risca" da esquerda pra direita — separador do card */
export const Rule: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 520,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 12], [0, 1], { ...OUT, easing: EASE });
  return (
    <div
      style={{
        width,
        height: 3,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.orangeSoft})`,
        transform: `scaleX(${t})`,
        transformOrigin: "left center",
        boxShadow: `0 0 14px ${COLORS.orange}`,
      }}
    />
  );
};
