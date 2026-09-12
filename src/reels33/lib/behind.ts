import type { BehindWord } from "../../lib/behind";
import { EXTRA_PUNCH_S } from "./beats";

/**
 * PALAVRAS ATRÁS DA PESSOA — "Reels 33".
 * 5 palavras em 45,1s = 1 a cada ~9s. Cor = semântica, 3 coloridas:
 *   RECORRÊNCIA     accent (o conceito — o hook é a palavra sozinha)
 *   PAGAMENTO ÚNICO danger, contorno (o vilão)
 *   MANUTENÇÃO      accent (a resposta do vídeo)
 *
 * ── ETAPA 6.4 · POSIÇÃO MEDIDA (measure-matte.py, meio de cada janela) ────
 * Topo da cabeça no matte 230–244 (em 32,2s ele se inclina: 156). Centro x 503–556.
 * y_tela = 960 + (y_matte − 960) × S, S = 1,03 + 0,06 × t/45,2.
 * top = topo_tela + 120 − 0,9 × size (regra validada no Reels 32).
 */
export const BEHIND_WORDS: BehindWord[] = [
  // 0,05s "RECORRÊNCIA." — medido 0,75s: topo 240 · S 1,031 · tela 218
  { text: "RECORRÊNCIA", from: 0.05, to: 1.45, top: 185, size: 170, color: "#FFD60A" },

  // 7,72s "produtos de PAGAMENTO ÚNICO" — medido 8,5s: topo 234 · S 1,041 · tela 204
  // duas linhas: a 1ª fica inteira acima da cabeça, a 2ª é cortada por ela
  { text: "PAGAMENTO\nÚNICO", from: 7.72, to: 9.3, top: 30, size: 130, style: "outline", color: "#FF3B30", rotate: -2 },

  // 13,52s "eu NÃO CONSIGO pôr uma recorrência" — medido 14,2s: topo 244 · S 1,049 · tela 209
  { text: "NÃO CONSIGO", from: 13.52, to: 14.9, top: 176, size: 170, style: "outline", rotate: 2 },

  // 31,54s "que você NEM SABE que ela tem" — medido 32,2s: topo 156 (ele se
  // inclina pra frente, a cabeça sobe) · S 1,073 · tela 97. Conferido no still.
  { text: "NEM SABE", from: 31.54, to: 32.9, top: 46, size: 190 },

  // 42,15s "a MANUTENÇÃO do seu automóvel" — medido 42,9s: topo 230 · S 1,087 · tela 167
  { text: "MANUTENÇÃO", from: 42.15, to: 43.7, top: 134, size: 170, color: "#FFD60A" },
];

/** Socos de zoom: nas palavras-atrás + o soco extra de "Lembre-se". */
export const EXTRA_PUNCHES_S = [...BEHIND_WORDS.map((w) => w.from), ...EXTRA_PUNCH_S];

export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((w) => ms >= w.from * 1000 && ms < w.to * 1000);
