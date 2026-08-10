/**
 * MAPA DE CORTES — a fonte única de verdade das transições E dos efeitos
 * sonoros (09/08/2026).
 *
 * Deixar os dois saindo da MESMA lista é o que garante que o som cai no frame
 * exato do corte. Se o som e a transição fossem listas separadas, qualquer
 * ajuste de timing num beat dessincronizaria os dois.
 *
 * A lista é derivada dos beats e das palavras-atrás — não é escrita à mão, o
 * que significa que mexer em `beats.ts` ou `behind.ts` reposiciona tudo junto.
 */
import { BEAT_TIMING } from "./beats";
import { BROLL } from "./broll";
import { BEHIND_WORDS } from "./behind";

export type CutKind = "whip" | "punch" | "glitch";

export type Cut = {
  /** segundo do corte */
  at: number;
  kind: CutKind;
  /** de onde veio (só pra leitura no Studio / debug) */
  from: string;
};

const cuts: Cut[] = [];

for (const beat of BEAT_TIMING) {
  const clip = BROLL.find((c) => c.key === beat.key);
  const isFullBleed = clip?.layout === "full";

  // entrada do beat
  cuts.push({
    at: beat.from,
    // B-roll que toma a tela inteira pede o corte mais forte (whip); overlay
    // sobre o rosto é uma troca menor, então leva o punch
    kind: isFullBleed ? "whip" : "punch",
    from: `beat:${beat.key}`,
  });

  // saída do B-roll full-bleed: a tela volta pro apresentador — isso também é
  // uma troca de imagem inteira e merece transição
  if (isFullBleed) {
    cuts.push({ at: beat.to, kind: "whip", from: `beat:${beat.key}:saida` });
  }
}

for (const w of BEHIND_WORDS) {
  cuts.push({
    at: w.from,
    kind: "glitch",
    from: `atras:${w.text.replace("\n", " ")}`,
  });
}

export const CUTS: Cut[] = cuts.sort((a, b) => a.at - b.at);
