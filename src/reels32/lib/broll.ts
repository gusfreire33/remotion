import type { BRollClip } from "../../lib/broll";

/**
 * B-ROLL — "Reels 32". Duas frases citam algo filmável:
 *   "pessoas que ainda vão comprar" → desconhecidos cruzando a rua (full)
 *   "já comprou algo seu e gostou"  → cliente abrindo o pacote (card)
 * O `why` de cada um está em `broll-plan.json`.
 */
export const BROLL: BRollClip[] = [
  // 6,34–8,60s — full-bleed: a frase é sobre essas pessoas.
  // ⚠️ Nenhuma palavra-atrás nesta janela (COMPRAR começa em 9,01s).
  {
    key: "desconhecidos",
    slug: "r32-desconhecidos",
    kind: "video",
    layout: "full",
    startAt: 2.0,
    zoom: [1.05, 1.15],
  },
  // 21,81–24,30s — card: o apresentador segue argumentando, o rosto fica.
  // Card fecha em 600+480 = 1080 < 1130 (legenda).
  {
    key: "clienteFeliz",
    slug: "r32-cliente-feliz",
    kind: "video",
    layout: "card",
    startAt: 5.0, // a partir daqui ela sorri com o produto na mão ("gostou")
    zoom: [1.06, 1.16],
    cardTop: 600,
    cardHeight: 480,
  },
];
