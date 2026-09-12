/**
 * CUES DE SFX — "Vídeo 2 YT". Dados puros (sem React) pra serem usados pelo
 * <SoundFX/> E pelo script de mixagem fora do Remotion (export-sfx-cues).
 *
 *   Camada 1 — um som por corte (de cuts.ts):
 *     whip   → swoosh 2f antes + boom no frame
 *     punch  → whoosh 2f antes + impact
 *     glitch → glitch 1f antes + boom
 *
 *   Camada 2 — um som por elemento:
 *     over          → whoosh baixo + impact na palavra mono
 *     chip / step   → tick / click(+ding)
 *     ícone         → pop
 *     stat          → riser antes + ding no fim da contagem
 *     linha `typed` → UMA TECLA POR CARACTERE (key1/key2/key3 alternando)
 *     dinheiro      → riser + ding
 *
 * ⚠️ MASTER NÃO se herda. Medir com `scripts/measure-audio.py` (Etapa 13.3).
 */
import { CALLOUTS } from "./map";
import { CUTS } from "./cuts";
import { FPS } from "./constants";
import { typedCharFrames } from "../components/TypeWriter";
import type { Line } from "./types";

export const MASTER = 0.3;

export type Cue = { file: string; at: number; volume: number };

const cues: Cue[] = [];
const add = (file: string, at: number, volume: number): void => {
  cues.push({ file, at: Math.max(0, at), volume });
};

/** uma tecla por caractere de uma linha digitada */
const addTyped = (line: Line, from: number): void => {
  const delay = Math.max(0, Math.round(((line.at ?? from) - from) * FPS));
  const frames = typedCharFrames(line.text, delay);
  frames.forEach((f, i) => {
    const k = (i * 7 + line.text.length) % 3;
    add(`key${k + 1}`, from + f / FPS, 0.55 + 0.1 * ((i * 3) % 2));
  });
  // "enter" no fim da linha
  add("click", from + (delay + line.text.length * 1.75 + 2) / FPS, 0.5);
};

for (const cut of CUTS) {
  if (cut.kind === "whip") {
    add("swoosh", cut.at - 0.07, 0.6);
    add("boom", cut.at, 0.9);
  } else if (cut.kind === "punch") {
    add("whoosh", cut.at - 0.07, 0.4);
    add("impact", cut.at, 0.5);
  } else if (cut.kind === "glitch") {
    add("glitch", cut.at - 0.03, 0.45);
    add("boom", cut.at, 0.75);
  }
}

for (const c of CALLOUTS) {
  if (c.kind === "over") {
    add("whoosh", c.from - 0.05, 0.22);
    const mono = c.lines.find((l) => l.voice === "mono");
    if (mono && mono.at !== undefined && mono.at - c.from > 0.3 && !mono.typed) {
      add("impact", mono.at, 0.35);
    }
    if (c.icon) add("pop", c.lines[0].at ?? c.from, 0.4);
    for (const l of c.lines) if (l.typed) addTyped(l, c.from);
  } else if (c.kind === "chips") {
    for (const it of c.items) add(it.icon ? "pop" : "tick", it.at, 0.45);
    if (c.tail?.at !== undefined) add("impact", c.tail.at, 0.5);
  } else if (c.kind === "steps") {
    for (const it of c.items) {
      add("click", it.at, 0.5);
      add("ding", it.at + 0.03, 0.35);
    }
  } else if (c.kind === "card") {
    for (const l of c.lines) {
      if (l.typed) addTyped(l, c.from);
      else if (l.at !== undefined && l !== c.lines[0]) add("pop", l.at, 0.4);
    }
    if (c.chips) for (const it of c.chips) add("tick", it.at, 0.42);
    if (c.icons) for (const it of c.icons) add("pop", it.at, 0.45);
    if (c.moneyAt !== undefined) {
      add("riser", c.moneyAt - 0.5, 0.4);
      add("ding", c.moneyAt, 0.45);
    }
  } else if (c.kind === "icons") {
    for (const it of c.items) add("pop", it.at, 0.48);
  } else if (c.kind === "stat") {
    const at = c.at ?? c.from;
    add("riser", at - 0.4, 0.35);
    add("ding", at + 34 / FPS, 0.4);
  } else if (c.kind === "broll") {
    if (c.label) addTyped(c.label, c.from);
  } else if (c.kind === "behind") {
    for (const l of c.lines) if (l.typed) addTyped(l, c.from);
  }
}

export const CUES: Cue[] = cues.sort((a, b) => a.at - b.at);
