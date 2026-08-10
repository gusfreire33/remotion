import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ============================================================================
   IconFX — animação de ENTRADA e SAÍDA para react-icons.

   ⚙️ Todas as mecânicas aqui são NOVAS e distintas das já usadas no framework:
   - NÃO reaproveita `PopIn` (spring scale + rise + opacity),
   - NÃO reaproveita `useEnter`/`springApprox` (spring scale / damped cosine),
   - NÃO reaproveita o flip rotateY do splitnews,
   - NÃO reaproveita o `ExitFade` global (opacity + scale 0.88).

   Entradas: iris | barrel | blurfocus | wipe | drop | swing | zoomthrough |
             unfold | floodup | stamp
   Saídas:   irisOut | spinOut | blurOut | dropOut | shatterUp | wipeOut | drainOut

   ⚙️ Vídeo 10 acrescentou 3 mecânicas TEMÁTICAS (metáfora do vazamento):
   - floodup: sobe "enchendo" como água (clip de baixo p/ cima + wobble lateral);
   - stamp:   carimbo — cai de escala grande com leve giro e "bate" com overshoot;
   - drainOut: escorre/pinga pra baixo esticando e some (dinheiro/lead drenando).
   ==========================================================================*/

export type IconEnter =
  | "iris"
  | "barrel"
  | "blurfocus"
  | "wipe"
  | "drop"
  | "swing"
  | "zoomthrough"
  | "unfold"
  | "floodup"
  | "stamp";

export type IconExit =
  | "irisOut"
  | "spinOut"
  | "blurOut"
  | "dropOut"
  | "shatterUp"
  | "wipeOut"
  | "drainOut";

const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.cubic);
const EASE = Easing.inOut(Easing.ease);

type FX = {
  opacity: number;
  transform: string;
  filter?: string;
  clipPath?: string;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* --------------------------------- ENTRADAS ------------------------------- */

const enterFX = (
  type: IconEnter,
  local: number, // frames desde o delay (>=0)
  dur: number,
  fps: number,
): FX => {
  const p = clamp01(local / dur); // progresso linear 0..1
  const spr = spring({
    frame: local,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 130 },
  });

  switch (type) {
    // Máscara circular abrindo do centro (revelação por clip, sem "pop" de escala).
    case "iris": {
      const r = interpolate(p, [0, 1], [0, 75], { easing: EASE_OUT });
      const s = interpolate(p, [0, 1], [1.12, 1], { easing: EASE_OUT });
      return {
        opacity: 1,
        transform: `scale(${s})`,
        clipPath: `circle(${r}% at 50% 50%)`,
      };
    }

    // Barrel roll: giro completo no eixo Z com overshoot (mola).
    case "barrel": {
      const rot = (1 - spr) * -280;
      const s = 0.55 + 0.45 * spr;
      return {
        opacity: clamp01(local / 4),
        transform: `rotate(${rot}deg) scale(${s})`,
      };
    }

    // Desfoque → foco (câmera focando), sem fade puro de opacidade.
    case "blurfocus": {
      const blur = interpolate(p, [0, 1], [18, 0], { easing: EASE_OUT });
      const s = interpolate(p, [0, 1], [1.18, 1], { easing: EASE_OUT });
      return {
        opacity: clamp01(local / 3),
        transform: `scale(${s})`,
        filter: `blur(${blur}px)`,
      };
    }

    // Wipe vertical (revela de baixo pra cima via clip inset).
    case "wipe": {
      const top = interpolate(p, [0, 1], [100, 0], { easing: EASE_OUT });
      const y = interpolate(p, [0, 1], [24, 0], { easing: EASE_OUT });
      return {
        opacity: 1,
        transform: `translateY(${y}px)`,
        clipPath: `inset(${top}% 0% 0% 0%)`,
      };
    }

    // Queda com gravidade + squash & stretch no impacto (cartoon land).
    case "drop": {
      const y = interpolate(p, [0, 0.62, 1], [-300, 0, 0], {
        easing: EASE_IN,
        extrapolateRight: "clamp",
      });
      const sy = interpolate(
        p,
        [0, 0.6, 0.72, 0.86, 1],
        [1, 1, 0.72, 1.12, 1],
        { extrapolateRight: "clamp" },
      );
      const sx = interpolate(
        p,
        [0, 0.6, 0.72, 0.86, 1],
        [1, 1, 1.24, 0.93, 1],
        { extrapolateRight: "clamp" },
      );
      return {
        opacity: clamp01(local / 3),
        transform: `translateY(${y}px) scale(${sx}, ${sy})`,
      };
    }

    // Pêndulo: balança a partir do topo com oscilação amortecida.
    case "swing": {
      const ang = -72 * Math.exp(-4.2 * p) * Math.cos(7.5 * p);
      return {
        opacity: clamp01(local / 3),
        transform: `rotate(${ang}deg)`,
      };
    }

    // Dolly: vem "de dentro da tela", de escala enorme desfocada até o normal.
    case "zoomthrough": {
      const s = interpolate(p, [0, 1], [2.7, 1], { easing: EASE_OUT });
      const blur = interpolate(p, [0, 0.5, 1], [12, 3, 0], { easing: EASE_OUT });
      return {
        opacity: clamp01(local / 3),
        transform: `scale(${s})`,
        filter: `blur(${blur}px)`,
      };
    }

    // Desdobra na horizontal (scaleX 0→1) com leve overshoot no fim.
    case "unfold": {
      const sx = interpolate(spr, [0, 1], [0.02, 1]);
      const sy = interpolate(p, [0, 0.7, 1], [0.6, 1.08, 1], {
        extrapolateRight: "clamp",
      });
      return {
        opacity: clamp01(local / 4),
        transform: `scale(${sx}, ${sy})`,
      };
    }

    // "Enche" de baixo pra cima (revela por clip como agua subindo) com um
    // leve balanco lateral no fim — metafora do vazamento/nivel enchendo.
    case "floodup": {
      const bottom = interpolate(p, [0, 1], [100, 0], { easing: EASE_OUT });
      const wobble = Math.sin(p * Math.PI * 2.2) * (1 - p) * 10;
      const sy = interpolate(p, [0, 0.75, 1], [1.14, 0.97, 1], {
        extrapolateRight: "clamp",
      });
      return {
        opacity: 1,
        transform: `translateX(${wobble}px) scaleY(${sy})`,
        clipPath: `inset(${bottom}% 0% 0% 0%)`,
      };
    }

    // Carimbo: cai de escala grande com leve giro e "bate" com overshoot (mola).
    case "stamp": {
      const s = interpolate(spr, [0, 1], [2.2, 1]);
      const rot = (1 - spr) * -12;
      const blur = interpolate(p, [0, 0.4, 1], [10, 2, 0], { easing: EASE_OUT });
      return {
        opacity: clamp01(local / 2),
        transform: `rotate(${rot}deg) scale(${s})`,
        filter: `blur(${blur}px)`,
      };
    }

    default:
      return { opacity: 1, transform: "none" };
  }
};

/* ---------------------------------- SAÍDAS -------------------------------- */

const exitFX = (type: IconExit, q: number): FX => {
  // q: progresso 0..1 da saída
  switch (type) {
    // Íris fechando (clip circular encolhe até sumir).
    case "irisOut": {
      const r = interpolate(q, [0, 1], [75, 0], { easing: EASE_IN });
      return {
        opacity: 1,
        transform: `scale(${interpolate(q, [0, 1], [1, 0.9])})`,
        clipPath: `circle(${r}% at 50% 50%)`,
      };
    }

    // Gira e some num ponto (spin + shrink to zero).
    case "spinOut": {
      const rot = interpolate(q, [0, 1], [0, 210], { easing: EASE_IN });
      const s = interpolate(q, [0, 1], [1, 0], { easing: EASE_IN });
      return { opacity: clamp01(1 - q * 0.9), transform: `rotate(${rot}deg) scale(${s})` };
    }

    // Desfoca e cresce enquanto some (out of focus).
    case "blurOut": {
      const blur = interpolate(q, [0, 1], [0, 20], { easing: EASE_IN });
      const s = interpolate(q, [0, 1], [1, 1.45], { easing: EASE_IN });
      return {
        opacity: clamp01(1 - q),
        transform: `scale(${s})`,
        filter: `blur(${blur}px)`,
      };
    }

    // Cai da tela com gravidade + tomba.
    case "dropOut": {
      const y = interpolate(q, [0, 1], [0, 380], { easing: EASE_IN });
      const rot = interpolate(q, [0, 1], [0, 38]);
      return {
        opacity: clamp01(1 - Math.max(0, q - 0.55) / 0.45),
        transform: `translateY(${y}px) rotate(${rot}deg)`,
      };
    }

    // Dispara pra cima e some (launch).
    case "shatterUp": {
      const y = interpolate(q, [0, 1], [0, -320], { easing: EASE_OUT });
      const s = interpolate(q, [0, 1], [1, 1.22]);
      return { opacity: clamp01(1 - q), transform: `translateY(${y}px) scale(${s})` };
    }

    // Wipe fechando de baixo pra cima.
    case "wipeOut": {
      const bottom = interpolate(q, [0, 1], [0, 100], { easing: EASE });
      return {
        opacity: 1,
        transform: "none",
        clipPath: `inset(0% 0% ${bottom}% 0%)`,
      };
    }

    // Escorre pra baixo esticando (drena como uma gota) e some — leak drain.
    case "drainOut": {
      const y = interpolate(q, [0, 1], [0, 200], { easing: EASE_IN });
      const sy = interpolate(q, [0, 1], [1, 1.4], { easing: EASE_IN });
      const sx = interpolate(q, [0, 1], [1, 0.6], { easing: EASE_IN });
      return {
        opacity: clamp01(1 - q),
        transform: `translateY(${y}px) scale(${sx}, ${sy})`,
        filter: `blur(${q * 4}px)`,
      };
    }

    default:
      return { opacity: 1, transform: "none" };
  }
};

/* --------------------------------- COMPONENTE ----------------------------- */

export const IconFX: React.FC<{
  icon: IconType;
  size?: number;
  color?: string;
  enter?: IconEnter;
  exit?: IconExit;
  delay?: number; // frames até começar a entrada
  enterDur?: number; // frames da entrada
  exitDur?: number; // frames da saída
  exitAt?: number; // frame (relativo à Sequence) em que a saída começa; default = fim - exitDur
  glow?: string; // cor do brilho (drop-shadow) opcional
  idle?: boolean; // leve respiração (float) quando parado
  style?: CSSProperties;
}> = ({
  icon: Icon,
  size = 150,
  color,
  enter = "iris",
  exit = "spinOut",
  delay = 0,
  enterDur = 18,
  exitDur = 18,
  exitAt,
  glow,
  idle = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const local = frame - delay;
  const enterState = enterFX(enter, Math.max(0, local), enterDur, fps);

  const outStart = exitAt ?? durationInFrames - exitDur;
  const q = clamp01((frame - outStart) / exitDur);
  const exiting = frame >= outStart;
  const exitState = exiting ? exitFX(exit, q) : null;

  // Respiração suave só na fase "parada" (entrou e ainda não saiu).
  const settled = local >= enterDur && !exiting;
  const floatY = settled && idle ? Math.sin((frame - delay) / 11) * 5 : 0;

  const active = exitState ?? enterState;
  const baseGlow = glow ? `drop-shadow(0 0 22px ${glow})` : "";
  const filter = [active.filter, baseGlow].filter(Boolean).join(" ") || undefined;

  return (
    <div
      style={{
        display: "inline-flex",
        opacity: active.opacity,
        transform: `translateY(${floatY}px) ${active.transform}`,
        clipPath: active.clipPath,
        filter,
        lineHeight: 0,
        ...style,
      }}
    >
      <Icon size={size} color={color} />
    </div>
  );
};
