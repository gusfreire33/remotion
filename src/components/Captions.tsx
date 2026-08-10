import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PAGES } from "../lib/pages";
import { MONTSERRAT } from "../lib/fonts";
import { COLORS } from "../lib/theme";
import { isBehindWindow } from "../lib/behind";

/**
 * LEGENDA SIMPLES (pedido do dono, 09/08/2026).
 *
 * Trocou a legenda do playbook (caixa amarela na palavra ativa) por uma bem
 * mais limpa, estilo Captions:
 *   - SÓ texto branco — nenhuma cor de destaque, nenhuma caixa;
 *   - fonte menor (46 em vez de 60);
 *   - mais alta na tela (paddingBottom 700 em vez de 560) pra não ser comida
 *     pela UI do Instagram Reels.
 *
 * A palavra que está sendo falada ainda "respira" (um leve pop de escala +
 * opacidade), que é o que dá o ritmo — mas sem mudar de cor.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  // Nos momentos de palavra ATRÁS da pessoa, a legenda sai: o texto gigante
  // já É a palavra falada — repetir embaixo polui e fica amador.
  if (isBehindWindow(ms)) {
    return null;
  }

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
    config: { damping: 16, mass: 0.5, stiffness: 190 },
  });
  const y = interpolate(enter, [0, 1], [26, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        // 700: sobe a legenda pra bem acima da UI do Reels (legenda, @, botões)
        paddingBottom: 700,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px)`,
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 14px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 860,
          padding: "0 70px",
          opacity: Math.min(1, enter * 2),
        }}
      >
        {page.words.map((w, i) => {
          const active = ms >= w.startMs && ms < w.endMs;
          const wf = (w.startMs / 1000) * fps;
          const pop = spring({
            frame: frame - wf,
            fps,
            config: { damping: 13, stiffness: 220, mass: 0.4 },
          });
          const aScale = active ? 1 + 0.08 * Math.min(1, pop) : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 800,
                fontSize: 46,
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: -0.5,
                // só branco: a palavra falada muda de PESO visual, não de cor
                color: COLORS.white,
                opacity: active ? 1 : 0.72,
                transform: `scale(${aScale})`,
                display: "inline-block",
                // contorno discreto pra ler sobre qualquer fundo
                textShadow:
                  "0 2px 0 rgba(0,0,0,0.55), 0 0 16px rgba(0,0,0,0.65)",
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
