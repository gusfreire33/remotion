import type { BehindWord } from "../../lib/behind";

/**
 * PALAVRAS ATRÁS DA PESSOA — "Reels 32".
 * 5 palavras em 39,36s = 1 a cada ~7,9s. Cor = semântica, 3 coloridas:
 *   FÁCIL   success (o benefício)
 *   CONFIOU accent  (o conceito que o vídeo vende)
 *   TRAVAS  danger  (o vilão) — contorno
 * JÁ COMPRARAM sólida branca × COMPRAR só contorno: o par visual do vídeo
 * (quem já comprou é cheio; quem "ainda vai" é oco).
 *
 * ── ETAPA 6.4 · POSIÇÃO MEDIDA (measure-matte.py, meio de cada janela) ────
 * Enquadramento deste vídeo: cabeça ALTA — topo no matte entre 227 e 265
 * (o Reels 30 era ~310; o Vídeo 29, ~670). Centro x 508–602.
 * Conversão: y_tela = 960 + (y_matte − 960) × S, S = Ken Burns 1,03→1,09
 * no meio da janela (o soco de 16f já acabou). Topo na TELA: 169–234.
 * Regra (playbook): a base do texto cai ~20% da altura da cabeça abaixo
 * do topo (cabeça ≈ 470px aqui → ~95px). No still o topo da cabeça saiu
 * ~25px abaixo do calculado (seek por keyframe do webm), então:
 *     top = topo_tela_calculado + 120 − 0,9 × size
 * Conferido em stills (Etapa 14): a palavra é cortada pela cabeça.
 */
export const BEHIND_WORDS: BehindWord[] = [
  // 4,84s "das pessoas que JÁ COMPRARAM"
  // medido em 5,50s: topo matte 247 · S 1,038 · topo na tela 220 → base 280
  { text: "JÁ COMPRARAM", from: 4.84, to: 6.15, top: 205, size: 150 },

  // 9,01s "pessoas que ainda vão COMPRAR" — o "ainda não": só contorno
  // medido em 9,65s: topo matte 265 · S 1,045 · topo na tela 234 → base 294
  { text: "COMPRAR", from: 9.01, to: 10.3, top: 174, size: 200, style: "outline", rotate: -2 },

  // 16,26s "é muito mais FÁCIL"  ★ colorida 1/3 (benefício)
  // medido em 16,83s: topo matte 242 · S 1,056 · topo na tela 202 → base 262
  { text: "FÁCIL", from: 16.26, to: 17.4, top: 124, size: 220, color: "#30D158" },

  // 19,96s "uma pessoa que já CONFIOU em você"  ★ colorida 2/3 (o conceito)
  // medido em 20,63s: topo matte 252 · S 1,061 · topo na tela 209 → base 269
  { text: "CONFIOU", from: 19.96, to: 21.3, top: 158, size: 190, color: "#FFD60A" },

  // 31,61s "muito mais TRAVAS mentais"  ★ colorida 3/3 (o vilão) — contorno
  // medido em 32,28s: topo matte 227 · S 1,079 · topo na tela 169 → base 229
  { text: "TRAVAS", from: 31.61, to: 32.95, top: 118, size: 190, style: "outline", color: "#FF3B30", rotate: 2 },
];

/** Socos de zoom — Framework 2: exatamente nas palavras-atrás. */
export const EXTRA_PUNCHES_S = BEHIND_WORDS.map((w) => w.from);

export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((w) => ms >= w.from * 1000 && ms < w.to * 1000);
