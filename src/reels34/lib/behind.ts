import type { BehindWord } from "../../lib/behind";
import { EXTRA_PUNCH_S } from "./beats";

/**
 * PALAVRAS ATRÁS DA PESSOA — "Reels 34".
 * 5 palavras em 53,7s. Cor = semântica, 2 coloridas:
 *   PROBLEMA   danger (o risco)
 *   OTIMIZAÇÃO accent (o valor que o cliente não vê)
 * NÃO É MURO e NÃO VÊ em contorno (negações — vazias por dentro).
 *
 * ── ETAPA 6.4 · POSIÇÃO MEDIDA (measure-matte.py, meio de cada janela) ────
 * Topo da cabeça no matte 200–244. y_tela = 960 + (y_matte − 960) × S,
 * S = 1,03 + 0,06 × t/54,23. top = topo_tela + 120 − 0,9 × size
 * (duas linhas: − (0,92 + 0,9) × size).
 */
export const BEHIND_WORDS: BehindWord[] = [
  // 5,88s "e marketing NÃO É MURO" — medido 6,44s: topo 234 · S 1,037 · tela 207
  { text: "NÃO É\nMURO", from: 5.88, to: 7.0, top: 30, size: 130, style: "outline", rotate: -2 },

  // 13,00s "elas são PROGRAMADAS" — medido 13,65s: topo 235 · S 1,045 · tela 202
  { text: "PROGRAMADAS", from: 13.0, to: 14.3, top: 178, size: 160 },

  // 21,71s "é que mora o PROBLEMA" — medido 22,3s: topo 232 · S 1,055 · tela 192
  { text: "PROBLEMA", from: 21.71, to: 22.9, top: 132, size: 200, color: "#FF3B30" },

  // 33,50s "o cliente NÃO VÊ isso acontecendo" — medido 34,1s: topo 244 · S 1,068 · tela 195
  { text: "NÃO VÊ", from: 33.5, to: 34.7, top: 117, size: 220, style: "outline", rotate: 2 },

  // 41,84s "não vê a OTIMIZAÇÃO sendo feita" — medido 42,47s: topo 200 · S 1,077 · tela 141
  { text: "OTIMIZAÇÃO", from: 41.84, to: 43.1, top: 117, size: 160, color: "#FFD60A" },
];

export const EXTRA_PUNCHES_S = [...BEHIND_WORDS.map((w) => w.from), ...EXTRA_PUNCH_S];

export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((w) => ms >= w.from * 1000 && ms < w.to * 1000);
