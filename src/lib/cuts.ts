/**
 * MAPA DE CORTES — a fonte única de verdade das transições E dos efeitos
 * sonoros. Derivado de `callouts.ts`, nunca escrito à mão: mexer num evento
 * move transição e som juntos.
 *
 * Estilo VSL ("Bilhon-OS"): os cortes são mais suaves que no Framework 2
 * vertical — a referência quase não tem transição visível, só o boom grave.
 *
 *   whip   · entrada E saída de cartão full-screen (a imagem troca inteira)
 *   punch  · entrada de texto atrás da pessoa (borrão curto, quase invisível)
 *   glitch · (não usado neste estilo)
 */
import { CALLOUTS } from "./callouts";

export type CutKind = "whip" | "punch" | "glitch";

export type Cut = {
  /** segundo do corte */
  at: number;
  kind: CutKind;
  /** de onde veio (só pra leitura no Studio / debug) */
  from: string;
};

const cuts: Cut[] = [];

for (const c of CALLOUTS) {
  if (c.kind === "card") {
    const label = c.lines[c.lines.length - 1].text;
    cuts.push({ at: c.from, kind: "whip", from: `card:${label}` });
    cuts.push({ at: c.to, kind: "whip", from: `card:${label}:saida` });
  } else if (c.kind === "behind") {
    cuts.push({
      at: c.from,
      kind: "punch",
      from: `atras:${c.lines[c.lines.length - 1].text}`,
    });
  }
}

export const CUTS: Cut[] = cuts.sort((a, b) => a.at - b.at);
