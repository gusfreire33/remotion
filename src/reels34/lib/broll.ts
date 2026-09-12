import type { BRollClip } from "../../lib/broll";

/**
 * B-ROLL — "Reels 34". Três coisas filmáveis na fala (o `why` está em
 * `broll-plan.json`): a criança "desde pequeno", o pedreiro no muro, o código.
 */
export const BROLL: BRollClip[] = [
  // 9,82–12,20s — card (ele segue explicando)
  { key: "crianca", slug: "r34-crianca", kind: "video", layout: "card", startAt: 1.5, zoom: [1.06, 1.16], cardTop: 600, cardHeight: 480 },
  // 22,91–25,30s — full: a frase é sobre o pedreiro. ⚠️ sem palavra-atrás nesta janela
  { key: "pedreiro", slug: "r34-pedreiro", kind: "video", layout: "full", startAt: 3.0, zoom: [1.05, 1.15] },
  // 45,82–48,00s — card
  { key: "codigo", slug: "r34-codigo", kind: "video", layout: "card", startAt: 1.0, zoom: [1.06, 1.16], cardTop: 600, cardHeight: 480 },
];
