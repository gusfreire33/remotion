import type { CSSProperties, ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// Entrada com mola (scale + opacidade + leve subida). Use dentro de uma cena
// envolvida por CameraMotionBlur pra ganhar o motion blur estilo After Effects.
export const PopIn: React.FC<{
  children: ReactNode;
  delay?: number;
  from?: number;
  rise?: number;
  damping?: number;
  stiffness?: number;
  style?: CSSProperties;
}> = ({
  children,
  delay = 0,
  from = 0.4,
  rise = 40,
  damping = 12,
  stiffness = 150,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping, mass: 0.7, stiffness },
  });
  const scale = from + (1 - from) * s;
  const y = rise * (1 - s);
  return (
    <div
      style={{
        transform: `translateY(${y}px) scale(${scale})`,
        opacity: Math.min(1, s * 1.5),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
