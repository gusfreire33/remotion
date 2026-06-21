import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

// Montserrat: legendas e textos de apoio
export const { fontFamily: MONTSERRAT } = loadMontserrat("normal", {
  weights: ["600", "700", "800", "900"],
  subsets: ["latin"],
});

// Anton: titulos de impacto (display pesado, estilo motion/AE)
export const { fontFamily: ANTON } = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
