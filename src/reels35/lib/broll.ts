import type { BRollClip } from "../../lib/broll";

/** B-ROLL — "Reels 35" (o `why` está em `broll-plan.json`). */
export const BROLL: BRollClip[] = [
  // 5,81–7,70s — full curto. ⚠️ sem palavra-atrás nesta janela
  { key: "pessoas", slug: "r35-pessoas", kind: "video", layout: "full", startAt: 1.0, zoom: [1.05, 1.15] },
  // 22,71–24,40s — card
  { key: "tijolos", slug: "r35-tijolos", kind: "video", layout: "card", startAt: 2.0, zoom: [1.06, 1.16], cardTop: 600, cardHeight: 480 },
];
