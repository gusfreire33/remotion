import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PAGES, type Page } from "../lib/pages";
import { MONTSERRAT } from "../lib/fonts";
import { isBehindWindow } from "../lib/behind";

/**
 * Legenda simples do Framework 2 (PLAYBOOK-2 Etapa 8).
 *
 * Só texto branco. A palavra falada muda de PESO VISUAL (opacidade + scale),
 * nunca de cor. Durante a janela da palavra-atrás a legenda some: a palavra
 * gigante já é a legenda naquele instante.
 */
export const Captions: React.FC<{
  pages?: Page[];
  hideAt?: (ms: number) => boolean;
}> = ({ pages = PAGES, hideAt = isBehindWindow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  if (hideAt(ms)) {
    return null;
  }

  let idx = -1;
  for (let i = 0; i < pages.length; i++) {
    const start = pages[i].startMs;
    const next = i + 1 < pages.length ? pages[i + 1].startMs : Infinity;
    if (ms >= start && ms < next) {
      idx = i;
      break;
    }
  }
  if (idx === -1) {
    return null;
  }

  const page = pages[idx];
  const pageStartFrame = (page.startMs / 1000) * fps;
  const enter = spring({
    frame: frame - pageStartFrame,
    fps,
    config: { damping: 18, mass: 0.55, stiffness: 170 },
  });
  const y = interpolate(enter, [0, 1], [14, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 700,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 6px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 980,
          padding: "0 28px",
          opacity: Math.min(1, enter * 2.2),
        }}
      >
        {page.words.map((w, i) => {
          const active = ms >= w.startMs && ms < w.endMs;
          const spoken = ms >= w.startMs;
          const wf = (w.startMs / 1000) * fps;
          const pop = spring({
            frame: frame - wf,
            fps,
            config: { damping: 14, stiffness: 210, mass: 0.42 },
          });
          const scale = active ? 1 + 0.08 * Math.min(1, pop) : 1;
          return (
            <span
              key={`${page.startMs}-${i}`}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 800,
                fontSize: 46,
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                color: "#FFFFFF",
                opacity: active ? 1 : spoken ? 0.72 : 0.55,
                transform: `scale(${scale})`,
                display: "inline-block",
                transformOrigin: "center center",
                padding: "4px 10px",
                whiteSpace: "nowrap",
                textShadow:
                  "0 2px 0 rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.45)",
              }}
            >
              {w.text.replace(/^["“”]+|[."“”.,!?;:]+$/g, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
