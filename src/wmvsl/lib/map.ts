import { MAP_A } from "./mapA";
import { MAP_B } from "./mapB";
import { MAP_C } from "./mapC";
import { MAP_D } from "./mapD";
import type { SceneDef } from "./types";
import { DURATION_IN_FRAMES, FPS, sec } from "./sync";

/** mapa completo, em ordem; o `to` de cada cena = `from` da seguinte */
export const SCENES: SceneDef[] = [...MAP_A, ...MAP_B, ...MAP_C, ...MAP_D];

export type Placed = SceneDef & { f0: number; f1: number };

export const PLACED: Placed[] = SCENES.map((s, i) => ({
  ...s,
  f0: sec(s.from),
  f1: i + 1 < SCENES.length ? sec(SCENES[i + 1].from) : DURATION_IN_FRAMES,
}));

/** janelas de palavra-atrás, em segundos absolutos */
export const BEHIND_WINDOWS = PLACED.filter((p) => p.behind).map((p) => {
  const b = p.behind!;
  const a = b.mark ? p.marks[b.mark] : p.from;
  const z = Math.min(a + (b.dur ?? 1.5), p.f1 / FPS);
  return { from: a, to: z, scene: p.id };
});

export const isBehindAt = (s: number) => BEHIND_WINDOWS.some((w) => s >= w.from && s < w.to);
