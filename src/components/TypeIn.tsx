import type { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INTER, SPACE_MONO } from "../lib/fonts";
import { COLORS, GLOW_ORANGE, GLOW_WHITE } from "../lib/theme";

/* ------------------------------------------------------------------------
   TYPE-IN "CAÓTICO" — a assinatura tipográfica da referência ("Bilhon-OS").

   As letras entram UMA A UMA. Cada uma nasce um pouco fora do lugar (deslocada
   pra baixo, levemente girada, meio transparente) e ASSENTA no lugar certo em
   poucos frames. Lido de longe é um typewriter; de perto é um "tremor" que
   assenta — o que dá a sensação de texto sendo escrito na hora.

   Duas vozes, como na referência:
     · `sans`  → Inter, peso leve/médio, minúsculas: a linha de CONTEXTO
     · `mono`  → Space Mono bold, CAIXA ALTA: a PALAVRA DE IMPACTO

   Nada de Math.random(): o desvio de cada letra sai de um hash do índice, então
   o render é determinístico (regra 9.3 do PLAYBOOK-2).

   `accentWords`: índices (0-based, contando palavras) que ficam em laranja.
   --------------------------------------------------------------------- */

const OUT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.out(Easing.cubic);

// pseudo-aleatório determinístico em [-1, 1]
const jit = (i: number, salt: number): number => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

export type TypeInProps = {
  text: string;
  voice?: "sans" | "mono";
  size?: number;
  color?: string;
  /** índices das palavras que vão em laranja (ou na cor `accentColor`) */
  accentWords?: number[];
  accentColor?: string;
  /** frame em que a primeira letra entra */
  delay?: number;
  /** frames entre uma letra e a próxima */
  stagger?: number;
  /** frames que cada letra leva pra assentar */
  settle?: number;
  /** quanto a letra nasce fora do lugar (px) */
  drift?: number;
  /** some no fim: [frameInicio, frameFim] da saída (relativos à Sequence) */
  exit?: [number, number];
  glow?: boolean;
  weight?: number;
  letterSpacing?: number;
  style?: CSSProperties;
};

export const TypeIn: React.FC<TypeInProps> = ({
  text,
  voice = "sans",
  size = 54,
  color = COLORS.white,
  accentWords = [],
  accentColor = COLORS.orange,
  delay = 0,
  stagger,
  settle = 9,
  drift = 26,
  exit,
  glow = true,
  weight,
  letterSpacing,
  style,
}) => {
  const frame = useCurrentFrame();
  const mono = voice === "mono";
  // referência: a linha se escreve em ~0,5–0,8s. mono um pouco mais lenta
  // (é a palavra de impacto), sans corre.
  const step = stagger ?? (mono ? 1.15 : 0.85);

  const exitOpacity = exit
    ? interpolate(frame, exit, [1, 0], { ...OUT, easing: EASE })
    : 1;
  const exitBlur = exit ? interpolate(frame, exit, [0, 6], OUT) : 0;

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: mono ? size * 0.55 : size * 0.3,
        rowGap: size * 0.12,
        fontFamily: mono ? SPACE_MONO : INTER,
        fontWeight: weight ?? (mono ? 700 : 400),
        fontSize: size,
        lineHeight: 1.12,
        textTransform: mono ? "uppercase" : "none",
        letterSpacing: letterSpacing ?? (mono ? size * 0.02 : 0),
        opacity: exitOpacity,
        filter: exitBlur > 0.1 ? `blur(${exitBlur}px)` : undefined,
        ...style,
      }}
    >
      {words.map((word, wi) => {
        const isAccent = accentWords.includes(wi);
        const wordColor = isAccent ? accentColor : color;
        const shadow = !glow
          ? "0 2px 8px rgba(0,0,0,0.6)"
          : isAccent || wordColor === COLORS.orange
            ? GLOW_ORANGE
            : GLOW_WHITE;
        return (
          <span
            key={wi}
            style={{ display: "inline-flex", whiteSpace: "pre", color: wordColor }}
          >
            {word.split("").map((ch, ci) => {
              const i = charIndex++;
              const start = delay + i * step;
              const t = interpolate(frame, [start, start + settle], [0, 1], {
                ...OUT,
                easing: EASE,
              });
              const dy = (1 - t) * drift * (0.6 + 0.4 * Math.abs(jit(i, 1)));
              const dx = (1 - t) * drift * 0.35 * jit(i, 2);
              const rot = (1 - t) * 14 * jit(i, 3);
              return (
                <span
                  key={ci}
                  style={{
                    display: "inline-block",
                    transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                    opacity: t,
                    textShadow: shadow,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

/** quantos frames o TypeIn leva pra terminar de escrever `text` */
export const typeInLength = (
  text: string,
  stagger = 1.15,
  settle = 9,
  delay = 0,
): number => delay + text.replace(/ /g, "").length * stagger + settle;
