import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";

// Montserrat: Framework 2 usa ExtraBold (800) na legenda simples.
export const { fontFamily: MONTSERRAT } = loadMontserrat("normal", {
  weights: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// Anton: titulos de impacto (display pesado, estilo motion/AE)
export const { fontFamily: ANTON } = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ── Estilo VSL (referência "Bilhon-OS") ──────────────────────────────────
// Inter: a linha de contexto (sans limpa, peso leve/médio).
export const { fontFamily: INTER } = loadInter("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

// Space Mono: a PALAVRA DE IMPACTO (monoespaçada, caixa alta, bold).
export const { fontFamily: SPACE_MONO } = loadSpaceMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
