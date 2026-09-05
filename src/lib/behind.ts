/**
 * PALAVRAS ATRÁS DA PESSOA (estilo Captions) — "Vídeo 29" (OS TRÊS 10 DA
 * VENDA / CONFIANÇA).
 *
 * Nos momentos mais marcantes da fala, a palavra entra em tipografia gigante
 * ATRÁS do apresentador — ele passa na frente do texto.
 *
 * Pilha em `MeuVideo.tsx`:
 *
 *     [vídeo base borrado]  ->  [ESTE texto]  ->  [recorte da pessoa]
 *
 * Regra de ouro: estas janelas NÃO podem colidir com beats de B-roll
 * full-bleed. Neste vídeo os fulls são `scriptVenda` (20,34–22,20s) e
 * `transmiteIdeias` (26,50–28,10s) — nenhuma palavra cai dentro de nenhum
 * dos dois.
 */
export type BehindWord = {
  text: string;
  from: number;
  to: number;
  top?: number;
  size?: number;
  rotate?: number;
  style?: "solid" | "outline";
  color?: string;
};

/**
 * 5 palavras em 33,25s = 1 a cada ~6,7s.
 *
 * Cor = semântica, no máximo 3 coloridas:
 *   CONFIANÇA  em `accent`  (o conceito que o vídeo está vendendo)
 *   VAZAMENTO  em `accent`  (a palavra do CTA)
 *   (a terceira vaga ficou vazia de propósito — só 2 destaques)
 *
 * ── ETAPA 6.4 · POSIÇÃO MEDIDA ────────────────────────────────────────────
 * Enquadramento deste vídeo: topo da cabeça no MATTE entre 665 e 690
 * (busto mais baixo / mais headroom que o do "Vídeo 27", que era 535–574).
 * Ombros ~1017–1053. Centro x ~549–603.
 *
 * Conversão: y_tela = 960 + (y_matte − 960) × S
 * S = Ken Burns 1,03→1,09 no instante do MEIO da janela (o soco de 16f já
 * acabou no meio). S medido: 1,038 a 1,089.
 * Topo da cabeça NA TELA: 644–668.
 *
 * Uma linha, pedido do dono (vídeo 27): a BASE na linha do cabelo, só o
 * terço de baixo passa atrás. top ≈ topo_tela − 0,82 × (size × 0,92)
 */
export const BEHIND_WORDS: BehindWord[] = [
  // 3,62s "um dos três 10 da venda"
  // medido em 4,33s: topo do matte 679 · S 1,038 · topo na tela 668
  {
    text: "10",
    from: 3.62,
    to: 5.05,
    top: 455,
    size: 280,
    style: "solid",
  },

  // 6,99s "Nada mais é do que a CONFIANÇA"  ★colorida 1/2 (o conceito)
  // medido em 7,72s: topo do matte 666 · S 1,044 · topo na tela 653
  {
    text: "CONFIANÇA",
    from: 6.99,
    to: 8.45,
    top: 540,
    size: 148,
    style: "solid",
    color: "#FFD60A",
  },

  // 15,41s "não está conseguindo VENDER" — secundária, só contorno
  // medido em 16,25s: topo do matte 682 · S 1,059 · topo na tela 666
  {
    text: "VENDER",
    from: 15.41,
    to: 17.1,
    top: 508,
    size: 210,
    style: "outline",
    rotate: -3,
  },

  // 22,48s "fazer esses AJUSTES é muito simples"
  // medido em 23,24s: topo do matte 665 · S 1,072 · topo na tela 644
  {
    text: "AJUSTES",
    from: 22.48,
    to: 24.0,
    top: 500,
    size: 188,
    style: "solid",
  },

  // 32,04s CTA — a palavra que ele pede pra comentar  ★colorida 2/2
  // medido em 32,77s: topo do matte 690 · S 1,089 · topo na tela 666
  {
    text: "VAZAMENTO",
    from: 32.04,
    to: 33.5,
    top: 548,
    size: 156,
    style: "solid",
    color: "#FFD60A",
  },
];

/** true se o frame (em ms) cai dentro de alguma janela de palavra atrás. */
export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((w) => ms >= w.from * 1000 && ms < w.to * 1000);
