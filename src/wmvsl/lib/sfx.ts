/**
 * CUES DE SFX (PLAYBOOK-2 Etapa 13) — dados puros.
 *   Camada 1 · um som por corte (cuts.ts): whip→swoosh 2f antes · punch→whoosh 2f antes
 *             · glitch→glitch 1f antes + boom no frame
 *   Camada 2 · um som por elemento: declarado na própria cena (`sfx`), ancorado
 *             na MESMA marca que dispara a animação — som e imagem no mesmo frame.
 * ⚠️ MASTER medido com scripts/measure-audio.py (13.3), nunca herdado.
 */
import { CUTS } from "./cuts";
import { PLACED } from "./map";
import { FPS } from "./sync";
import type { SfxFile } from "./types";

export const MASTER = 0.3;

export type Cue = { file: SfxFile; at: number; volume: number };
const cues: Cue[] = [];
const add = (file: SfxFile, at: number, volume: number) => cues.push({ file, at: Math.max(0, at), volume });

for (const c of CUTS) {
  if (c.kind === "whip") add("swoosh", c.at - 2 / FPS, 0.55);
  if (c.kind === "punch") add("whoosh", c.at - 2 / FPS, 0.4);
  if (c.kind === "glitch") {
    add("glitch", c.at - 1 / FPS, 0.5);
    add("boom", c.at, 0.7);
  }
}
for (const p of PLACED) {
  for (const [mark, file, vol = 0.5, off = 0] of p.sfx ?? []) {
    const t = p.marks[mark];
    if (t === undefined) throw new Error(`[sfx] marca "${mark}" não existe em ${p.id}`);
    add(file, t + off, vol);
  }
}

export const CUES: Cue[] = cues.sort((a, b) => a.at - b.at);
