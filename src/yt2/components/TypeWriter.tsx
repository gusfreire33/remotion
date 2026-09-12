import type { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INTER, SPACE_MONO } from "../../lib/fonts";
import { COLORS, GLOW_ORANGE, GLOW_WHITE } from "../../lib/theme";

/* ------------------------------------------------------------------------
   TYPEWRITER "DE VERDADE" — pedido do dono (11/09/2026):

   "quando for colocar animação de texto, algo sendo escrito nas partes de
   background, coloca um efeito no texto como se ele estivesse sendo
   DIGITADO e põe um efeito sonoro de TECLADO".

   Diferente do TypeIn caótico (letras que assentam): aqui cada caractere
   aparece INTEIRO, de uma vez, com um cursor bloco piscando na frente — a
   cadência de alguém digitando. O SoundFX usa `typedCharFrames()` (mesma
   fórmula) pra disparar uma tecla por caractere, então som e letra caem no
   mesmo frame.
   --------------------------------------------------------------------- */

const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** frames por caractere — cadência de digitação (~17 chars/s) */
export const TYPE_STEP = 1.75;

/** frame (relativo) em que cada caractere não-espaço aparece */
export const typedCharFrames = (text: string, delay = 0, step = TYPE_STEP): number[] => {
  const out: number[] = [];
  let i = 0;
  for (const ch of text) {
    if (ch !== " ") out.push(Math.round(delay + i * step));
    i++;
  }
  return out;
};

/** quantos frames o texto leva pra terminar de ser digitado */
export const typedLength = (text: string, delay = 0, step = TYPE_STEP): number =>
  delay + text.length * step;

export const TypeWriter: React.FC<{
  text: string;
  voice?: "sans" | "mono";
  size?: number;
  color?: string;
  accentWords?: number[];
  delay?: number;
  step?: number;
  /** cursor some N frames depois de terminar (default: fica até a saída) */
  cursorHold?: number;
  exit?: [number, number];
  weight?: number;
  align?: "left" | "center" | "right";
  style?: CSSProperties;
}> = ({
  text,
  voice = "mono",
  size = 64,
  color = COLORS.white,
  accentWords = [],
  delay = 0,
  step = TYPE_STEP,
  cursorHold,
  exit,
  weight,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const mono = voice === "mono";
  const local = frame - delay;
  const shown = Math.max(0, Math.min(text.length, Math.floor(local / step) + 1));
  const done = shown >= text.length;
  const doneAt = delay + text.length * step;

  const exitOpacity = exit
    ? interpolate(frame, exit, [1, 0], { ...OUT, easing: Easing.out(Easing.cubic) })
    : 1;

  const cursorVisible =
    local >= 0 &&
    (!done || cursorHold === undefined || frame < doneAt + cursorHold) &&
    (done ? Math.floor(frame / 8) % 2 === 0 : true);

  // divide em palavras preservando os índices dos caracteres pra cor
  const words = text.split(" ");
  let charIdx = 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        alignItems: "baseline",
        columnGap: mono ? size * 0.5 : size * 0.28,
        rowGap: size * 0.1,
        fontFamily: mono ? SPACE_MONO : INTER,
        fontWeight: weight ?? (mono ? 700 : 500),
        fontSize: size,
        lineHeight: 1.15,
        textTransform: mono ? "uppercase" : "none",
        letterSpacing: mono ? size * 0.02 : 0,
        opacity: local < 0 ? 0 : exitOpacity,
        ...style,
      }}
    >
      {words.map((word, wi) => {
        const start = charIdx;
        charIdx += word.length + 1;
        const visible = Math.max(0, Math.min(word.length, shown - start));
        const last = shown - 1;
        const cursorHere =
          cursorVisible &&
          ((shown === 0 && wi === 0) || (last >= start && last <= start + word.length));
        if (visible <= 0 && !cursorHere) return null;
        const isAccent = accentWords.includes(wi);
        const c = isAccent ? COLORS.orange : color;
        const shadow = c === COLORS.orange ? GLOW_ORANGE : GLOW_WHITE;
        return (
          <span
            key={wi}
            style={{ display: "inline-flex", whiteSpace: "pre", color: c, textShadow: shadow }}
          >
            {word.slice(0, visible)}
            {cursorHere ? (
              <span
                style={{
                  display: "inline-block",
                  width: size * 0.55,
                  height: size * 0.95,
                  marginLeft: size * 0.06,
                  background: COLORS.orange,
                  boxShadow: GLOW_ORANGE,
                  transform: "translateY(12%)",
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};
