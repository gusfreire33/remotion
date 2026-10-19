/**
 * MAPA DE CORTES — DERIVADO do mapa de cenas (PLAYBOOK-2 Etapa 12), nunca
 * escrito à mão: a mesma lista alimenta as transições E os SFX da Camada 1.
 *   whip   · troca de "mundo" (tela cheia / cena nova grande)
 *   punch  · entrada de overlay
 *   glitch · entrada de palavra-atrás
 */
import { PLACED } from "./map";
import { FPS } from "./sync";
import type { CutKind } from "./types";

export type Cut = { at: number; kind: CutKind; from: string };

const cuts: Cut[] = [];
for (const p of PLACED) {
  const start = p.f0 / FPS + 0.067; // o evento é 2f depois do início da cena (a cena nasce antes da boca)
  const b = p.behind;
  const bAt = b?.mark ? p.marks[b.mark] : undefined;
  // palavra-atrás que entra no MEIO da cena: o glitch vai no frame da palavra
  if (b && bAt !== undefined && bAt - start > 0.3) {
    if (p.cut && p.cut !== "glitch") cuts.push({ at: start, kind: p.cut, from: p.id });
    else if (p.cut) cuts.push({ at: start, kind: "punch", from: p.id });
    cuts.push({ at: bAt, kind: "glitch", from: `${p.id}:atras` });
  } else if (p.cut) {
    cuts.push({ at: start, kind: p.cut, from: p.id });
  }
}
export const CUTS: Cut[] = cuts.sort((a, b) => a.at - b.at);
