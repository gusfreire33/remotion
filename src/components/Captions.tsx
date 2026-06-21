import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PAGES } from "../lib/pages";
import { MONTSERRAT } from "../lib/fonts";
import { COLORS, TEXT_SHADOW } from "../lib/theme";

// Legendas animadas estilo TikTok/Reels: 2-3 palavras por vez, a palavra que
// esta sendo falada ganha destaque amarelo + leve zoom.
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  // pagina ativa: vale ate o inicio da proxima (sem buracos no meio da fala)
  let idx = -1;
  for (let i = 0; i < PAGES.length; i++) {
    const start = PAGES[i].startMs;
    const next = i + 1 < PAGES.length ? PAGES[i + 1].startMs : Infinity;
    if (ms >= start && ms < next) {
      idx = i;
      break;
    }
  }
  if (idx === -1) {
    return null;
  }

  const page = PAGES[idx];
  const pageStartFrame = (page.startMs / 1000) * fps;
  const enter = spring({
    frame: frame - pageStartFrame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 170 },
  });
  const y = interpolate(enter, [0, 1], [50, 0]);
  const scale = interpolate(enter, [0, 1], [0.78, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 360,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px) scale(${scale})`,
          display: "flex",
          flexWrap: "wrap",
          gap: "14px 16px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 920,
          padding: "0 70px",
        }}
      >
        {page.words.map((w, i) => {
          const active = ms >= w.startMs && ms < w.endMs;
          const wf = (w.startMs / 1000) * fps;
          const pop = spring({
            frame: frame - wf,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.5 },
          });
          const aScale = active ? 1 + 0.12 * Math.min(1, pop) : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 800,
                fontSize: 78,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: -1,
                color: active ? COLORS.accentInk : COLORS.white,
                background: active ? COLORS.accent : "transparent",
                padding: active ? "8px 18px" : "8px 4px",
                borderRadius: 16,
                transform: `scale(${aScale})`,
                display: "inline-block",
                boxShadow: active ? "0 10px 24px rgba(0,0,0,0.35)" : "none",
                textShadow: active ? "none" : TEXT_SHADOW,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
