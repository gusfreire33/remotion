import type { Cut } from "../../lib/cuts";
import { BEAT_TIMING } from "./beats";
import { BEHIND_WORDS } from "./behind";
import { BROLL } from "./broll";

/**
 * MAPA DE CORTES — derivado, nunca escrito à mão. Alimenta <Transitions /> e
 * <SoundFX />: mexer num beat move transição e som juntos.
 *   whip   · entrada E saída de B-roll full-bleed
 *   punch  · entrada de overlay (e de B-roll em card)
 *   glitch · entrada de palavra-atrás
 */
const cuts: Cut[] = [];
for (const b of BEAT_TIMING) {
  const clip = BROLL.find((c) => c.key === b.key);
  if (clip?.layout === "full") {
    cuts.push({ at: b.from, kind: "whip", from: `broll:${b.key}` });
    cuts.push({ at: b.to, kind: "whip", from: `broll:${b.key}:saida` });
  } else {
    cuts.push({ at: b.from, kind: "punch", from: `beat:${b.key}` });
  }
}
for (const w of BEHIND_WORDS) {
  cuts.push({ at: w.from, kind: "glitch", from: `atras:${w.text}` });
}
export const CUTS: Cut[] = cuts.sort((a, b) => a.at - b.at);
