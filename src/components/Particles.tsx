import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../lib/theme";

/* ------------------------------------------------------------------------
   FAGULHAS — as partículas que flutuam nos cartões full-screen da referência.

   Cada partícula tem posição, tamanho, velocidade e fase FIXAS (hash do índice
   — nada de Math.random(), senão o render "chuvisca"). Elas sobem devagar,
   oscilam de leve na horizontal e piscam.
   --------------------------------------------------------------------- */

const hash = (i: number, salt: number): number => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Particles: React.FC<{
  count?: number;
  color?: string;
  /** 0..1 — quanto da tela (de baixo pra cima) elas ocupam */
  opacity?: number;
  /** frame de referência pra continuidade (por padrão usa o frame local) */
  speed?: number;
}> = ({ count = 90, color = COLORS.ember, opacity = 1, speed = 1 }) => {
  const frame = useCurrentFrame();
  const W = 1920;
  const H = 1080;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const x0 = hash(i, 1) * W;
        const y0 = hash(i, 2) * (H + 200);
        const sz = 1.5 + hash(i, 3) * 3.5;
        const vy = (0.25 + hash(i, 4) * 0.6) * speed;
        const wob = 12 + hash(i, 5) * 30;
        const ph = hash(i, 6) * Math.PI * 2;
        const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.05 + ph * 3));
        // sobe e volta por cima (loop no espaço)
        const y = ((y0 - frame * vy) % (H + 200) + (H + 200)) % (H + 200) - 100;
        const x = x0 + Math.sin(frame * 0.02 + ph) * wob;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: color,
              opacity: twinkle * (0.5 + hash(i, 7) * 0.5),
              boxShadow: `0 0 ${sz * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
