/**
 * "Reels 33" — RECORRÊNCIA: ATÉ CONCESSIONÁRIA TEM (45,20s; fala 0,02–45,12s).
 * Framework 2 (`PLAYBOOK-2.md`), SEM blur de fundo (pedido do dono).
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * Em 2026 quem vive só de pagamento único está fadado a falir. "Meu modelo
 * não permite recorrência" não cola: até concessionária, que vende um carro
 * a cada 3–4 anos, tem recorrência semestral — a manutenção. Encontre a
 * recorrência escondida no seu negócio. Não há CTA na fala — não inventar.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook       0,02–1,00s   "Recorrência."
 *   contexto   1,00–11,78s  "em 2026… preso em pagamento único → fadado a falir"
 *   OBJEÇÃO    11,78–19,90s "não consigo pôr recorrência, meu modelo não permite"
 *   exemplo    19,90–33,80s "concessionária vende 1 carro a cada 3–4 anos e tem
 *                            uma recorrência que você nem sabe"
 *   revelação  33,80–45,12s "recorrência semestral: a manutenção"
 *
 * ── ETAPA 5.3 · TRATAMENTO, trecho a trecho ───────────────────────────────
 *   0,05–1,45  ATRÁS    RECORRÊNCIA (amarelo — o conceito)
 *   2,30–5,30  OVERLAY  anos2026 (os anos AVANÇAM numa faixa)
 *   5,30–7,72  limpo    "se você ainda tiver preso em produtos de" (2,4s)
 *   7,72–9,30  ATRÁS    PAGAMENTO ÚNICO (vermelho, contorno — o vilão)
 *  10,30–12,10 OVERLAY  falir (as barras de receita DESABAM)
 *  13,52–14,90 ATRÁS    NÃO CONSIGO (contorno)
 *  15,78–18,45 OVERLAY  naoPermite (o interruptor "recorrência" não vira) ★ OBJEÇÃO
 *  18,45–22,09 limpo    "pôr uma recorrência. Lembre-se desse exemplo." → SOCO em 19,90
 *  22,09–24,50 B-ROLL   concessionária (full)
 *  25,86–29,40 OVERLAY  cada34anos (4 anos, 1 carro no primeiro e 1 no último)
 *  31,54–32,90 ATRÁS    NEM SABE
 *  34,00–36,20 B-ROLL   automóveis (card)
 *  37,17–41,10 OVERLAY  semestral (a receita SOBE em degraus a cada 6 meses)
 *  42,15–43,70 ATRÁS    MANUTENÇÃO (amarelo — a resposta)
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * 12 eventos (5 overlays + 2 B-roll + 5 palavras-atrás) em 45,1s = 1/3,8s,
 * mais um soco de zoom em 19,90 ("Lembre-se") pra quebrar o único vão > 3s.
 * Alternância estrita A·O·A·O·A·O·R·O·A·R·O·A. Nenhuma palavra-atrás dentro
 * do B-roll full (22,09–24,50).
 *
 * ── ETAPA 9 · FAMÍLIAS (uma por beat, nenhuma repetida) ───────────────────
 *   anos2026   · verbo AVANÇAR (no tempo)      → ticker / marquee
 *   falir      · verbo DESABAR                 → contadores / barras
 *   naoPermite · verbo NÃO PERMITIR (travar)   → lista com estado (toggle)
 *   cada34anos · verbo ESPERAR (1 a cada 4)    → fileira de unidades
 *   semestral  · verbo REPETIR (a cada 6 meses)→ medida crescente (degraus)
 */
export type BeatTiming = { key: string; from: number; to: number };

export const BEAT_TIMING = [
  // "em 2026 e nos PRÓXIMOS ANOS" — verbo: AVANÇAR → a faixa de anos rola
  { key: "anos2026", from: 2.3, to: 5.3 },
  // "você tá fadado a FALIR" — verbo: DESABAR → as barras caem uma a uma
  { key: "falir", from: 10.3, to: 12.1 },
  // "o meu modelo de negócio NÃO ME PERMITE pôr uma recorrência"
  // verbo: NÃO PERMITIR → o interruptor tenta virar e volta   ★ OBJEÇÃO
  { key: "naoPermite", from: 15.78, to: 18.45 },
  // "uma CONCESSIONÁRIA de carro que vende um carro" — B-roll full
  { key: "concessionaria", from: 22.09, to: 24.5 },
  // "um brasileiro médio, A CADA 3, 4 ANOS" — verbo: ESPERAR → 4 casas, carro só na 1ª e na 4ª
  { key: "cada34anos", from: 25.86, to: 29.4 },
  // "pro MUNDO DOS AUTOMÓVEIS" — B-roll card
  { key: "automoveis", from: 34.0, to: 36.2 },
  // "a recorrência que eles têm é uma recorrência SEMESTRAL"
  // verbo: REPETIR a cada 6 meses → a receita sobe em degraus
  { key: "semestral", from: 37.17, to: 41.1 },
] as const satisfies readonly BeatTiming[];

export type BeatKey = (typeof BEAT_TIMING)[number]["key"];

/** Frames (relativos ao beat) de cada elemento — movem animação E som. */
export const ELEMENT_FRAMES = {
  // faixa f0 · "2026" cai f3 (2,40s) · "próximos anos" 4,25s (f58): 2027/2028/2029 rolam
  anos2026: { faixa: 0, ano: 3, rola: [58, 66, 74] },
  // painel f0 · 5 barras desabam · "falir" 10,92s (f19): a palavra bate
  falir: { painel: 0, cai: [6, 10, 14, 18, 22], palavra: 19 },
  // painel f0 · linha "pagamento único" f6 · linha "recorrência" f14 · "permite" 17,16s (f41): tentativa · trava f47
  naoPermite: { painel: 0, linhas: [6, 14], tentativa: 41, trava: 47 },
  // casas f4/14/24/34 (carro na 1ª) · "3" 27,91s (f61) · "4" 28,36s (f75, o 2º carro) · rótulo f82
  cada34anos: { casas: [4, 14, 24, 34], tres: 61, quatro: 75, rotulo: 82 },
  // painel f0 · linha do tempo f10 · "semestral" 39,97s (f84): 4 degraus · rótulo f106
  semestral: { painel: 0, linha: 10, degraus: [84, 90, 96, 102], rotulo: 106 },
} as const;

/** Soco extra fora das palavras-atrás: "Lembre-se" (quebra o vão limpo de 3,6s). */
export const EXTRA_PUNCH_S = [19.9];
