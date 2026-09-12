/**
 * MAPA DE CORTES — fonte única das transições E dos efeitos sonoros.
 * Derivado de `map.ts`, nunca escrito à mão.
 *
 *   whip   · entrada E saída de cartão full-screen e de B-roll full-bleed
 *   punch  · entrada de B-roll em janela (pip) e de stat
 *   glitch · entrada de texto atrás da pessoa
 */
import { CALLOUTS } from "./map";

export type CutKind = "whip" | "punch" | "glitch";
export type Cut = { at: number; kind: CutKind; from: string };

const cuts: Cut[] = [];

for (const c of CALLOUTS) {
  if (c.kind === "card") {
    const label = c.lines[c.lines.length - 1].text;
    cuts.push({ at: c.from, kind: "whip", from: `card:${label}` });
    cuts.push({ at: c.to, kind: "whip", from: `card:${label}:saida` });
  } else if (c.kind === "broll") {
    if (c.layout === "full") {
      cuts.push({ at: c.from, kind: "whip", from: `broll:${c.slug}` });
      cuts.push({ at: c.to, kind: "whip", from: `broll:${c.slug}:saida` });
    } else {
      cuts.push({ at: c.from, kind: "punch", from: `pip:${c.slug}` });
    }
  } else if (c.kind === "behind") {
    cuts.push({ at: c.from, kind: "glitch", from: `atras:${c.lines[c.lines.length - 1].text}` });
  } else if (c.kind === "stat") {
    cuts.push({ at: c.at ?? c.from, kind: "punch", from: `stat:${c.label}` });
  }
}

export const CUTS: Cut[] = cuts.sort((a, b) => a.at - b.at);
