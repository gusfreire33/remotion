import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

/**
 * Design system do Wonne Max (repo gusfreire33/wonne-max,
 * docs/design-system/Wonne Max Dashboard.html) — tokens contados no HTML.
 *   · tinta #15160F (131x) · limão #D4F500 (46x) · fundo #ECECE6
 *   · títulos Sora, texto Plus Jakarta Sans
 */
export const { fontFamily: SORA } = loadSora("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
export const { fontFamily: JAKARTA } = loadJakarta("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const WM = {
  ink: "#15160F",
  ink2: "#3A3A33",
  lime: "#D4F500",
  limeHot: "#B9E80D",
  limeDark: "#4D6B0A",
  limeSoft: "#EAF8C6",
  bg: "#ECECE6",
  bg2: "#EAEAE4",
  card: "#FFFFFF",
  card2: "#F4F4EF",
  line: "#E2E2DB",
  line2: "#CFCFC8",
  muted: "#9A9A92",
  muted2: "#74746C",
  muted3: "#5A5A52",
  danger: "#E5484D",
  warn: "#9A7B16",
  warnSoft: "#FFF7E0",
  violet: "#7C3AED",
  white: "#FFFFFF",
};

export const SHADOW_CARD =
  "0 1px 0 rgba(21,22,15,0.04), 0 18px 40px -18px rgba(21,22,15,0.18)";
export const SHADOW_FLOAT =
  "0 2px 0 rgba(21,22,15,0.05), 0 40px 80px -30px rgba(21,22,15,0.35)";
