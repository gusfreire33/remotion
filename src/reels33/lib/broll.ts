import type { BRollClip } from "../../lib/broll";

/**
 * B-ROLL — "Reels 33". Duas coisas filmáveis na fala:
 *   "concessionária de carro que vende um carro" → vendedor com cliente (full)
 *   "mundo dos automóveis"                        → carros na via, de cima (card)
 * O `why` de cada um está em `broll-plan.json`.
 */
export const BROLL: BRollClip[] = [
  // 22,09–24,50s — ⚠️ nenhuma palavra-atrás nesta janela (NEM SABE é em 31,54s)
  { key: "concessionaria", slug: "r33-concessionaria", kind: "video", layout: "full", startAt: 2.0, zoom: [1.05, 1.15] },
  // 34,00–36,20s — card fecha em 600+480 = 1080 < 1130 (legenda)
  { key: "automoveis", slug: "r33-automoveis", kind: "video", layout: "card", startAt: 1.5, zoom: [1.06, 1.16], cardTop: 600, cardHeight: 480 },
];
