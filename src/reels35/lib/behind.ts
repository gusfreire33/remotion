import type { BehindWord } from "../../lib/behind";
import { EXTRA_PUNCH_S } from "./beats";

/**
 * PALAVRAS ATRÁS DA PESSOA — "Reels 35".
 * 4 palavras em 41,9s. Cor = semântica, 3 coloridas:
 *   3 PERGUNTAS accent (o método)
 *   RELATÓRIOS  danger, contorno (o vilão)
 *   MURO        accent (o conceito que liga ao Reels 34)
 * INVISÍVEL em contorno — invisível por dentro.
 *
 * ── ETAPA 6.4 · POSIÇÃO MEDIDA (measure-matte.py, meio de cada janela) ────
 * Topo da cabeça no matte 231–245. y_tela = 960 + (y_matte − 960) × S,
 * S = 1,03 + 0,06 × t/41,93. top = topo_tela + 120 − 0,9 × size.
 */
export const BEHIND_WORDS: BehindWord[] = [
  // 0,46s "Existem TRÊS PERGUNTAS" — medido 1,13s: topo 245 · S 1,032 · tela 222
  { text: "3 PERGUNTAS", from: 0.46, to: 1.8, top: 189, size: 170, color: "#FFD60A" },

  // 11,29s "enviando RELATÓRIOS" — medido 11,9s: topo 233 · S 1,047 · tela 199
  { text: "RELATÓRIOS", from: 11.29, to: 12.5, top: 166, size: 170, style: "outline", color: "#FF3B30", rotate: -2 },

  // 24,53s "criando um MURO para o seu cliente" — medido 25,1s: topo 231 · S 1,066 · tela 183
  { text: "MURO", from: 24.53, to: 25.7, top: 87, size: 240, color: "#FFD60A" },

  // 36,90s "seu muro INVISÍVEL" — medido 37,5s: topo 243 · S 1,084 · tela 183
  { text: "INVISÍVEL", from: 36.9, to: 38.1, top: 141, size: 180, style: "outline", rotate: 2 },
];

export const EXTRA_PUNCHES_S = [...BEHIND_WORDS.map((w) => w.from), ...EXTRA_PUNCH_S];

export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((w) => ms >= w.from * 1000 && ms < w.to * 1000);
