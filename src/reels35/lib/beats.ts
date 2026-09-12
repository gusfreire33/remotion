/**
 * "Reels 35" — AS TRÊS PERGUNTAS (ONTEM / HOJE / AMANHÃ) (41,93s; fala 0,00–41,90s).
 * Framework 2 (`PLAYBOOK-2.md`), SEM blur de fundo (pedido do dono).
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * Três perguntas roubadas da engenharia de software (o que fiz ontem, o que
 * fiz hoje, o que farei amanhã) substituem relatórios e deixam o trabalho
 * visível: constroem o "muro" na cabeça do cliente. É a solução do Reels 34.
 * Não há CTA na fala.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook       0,00–7,71s   "três perguntas roubadas da engenharia de software"
 *   contraste  8,32–13,84s  "em vez de relatórios, faça exatamente isso"
 *   AS 3       14,84–18,44s "o que fiz ontem, hoje, o que farei amanhã"
 *   efeito     19,12–25,61s "você vai estar criando um muro pro cliente"
 *   detalhe    26,42–32,43s "ele vê o que está sendo / será / já foi feito"
 *   conclusão  33,36–41,90s "muro invisível projetado no subconsciente"
 *
 * ── ETAPA 5.3 · TRATAMENTO ────────────────────────────────────────────────
 *   0,46–1,80  ATRÁS    3 PERGUNTAS (amarelo)
 *   2,72–5,60  OVERLAY  roubadas (3 cartas saem da caixa "software" pra "seu negócio")
 *   5,81–7,70  B-ROLL   pessoas trabalhando (full)
 *   9,26–11,20 OVERLAY  relatorios (relógio escorrendo + pilha de relatórios)
 *  11,29–12,50 ATRÁS    RELATÓRIOS (vermelho, contorno)
 *  14,84–19,05 OVERLAY  ontemHojeAmanha (a lista das 3 perguntas)  ★ a solução
 *  20,44      soco     "fazer" (vão de 3,7s)
 *  22,71–24,40 B-ROLL   mãos assentando tijolo (card)
 *  24,53–25,70 ATRÁS    MURO (amarelo)
 *  27,14–33,00 OVERLAY  feito3 (3 colunas: sendo / será / já foi feito)
 *  36,90–38,10 ATRÁS    INVISÍVEL (contorno)
 *  38,50–41,60 OVERLAY  projetar (projetor lança o muro na cabeça do cliente)
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * 11 eventos (5 overlays + 2 B-roll + 4 palavras-atrás) em 41,9s = 1/3,8s,
 * + soco em 20,44. Alternância A·O·R·O·A·O·R·A·O·A·O.
 * Nenhuma palavra-atrás dentro do B-roll full (5,81–7,70).
 *
 * ── ETAPA 9 · FAMÍLIAS (uma por beat) ─────────────────────────────────────
 *   roubadas        · ROUBAR (tirar de um lugar) → fileira de unidades (3 cartas)
 *   relatorios      · PERDER TEMPO              → contadores / barras (relógio escorre)
 *   ontemHojeAmanha · RESPONDER as 3            → lista com estado
 *   feito3          · VER em 3 tempos           → split (3 painéis)
 *   projetar        · PROJETAR (carimbar)       → selo / carimbo
 */
export type BeatTiming = { key: string; from: number; to: number };

export const BEAT_TIMING = [
  // "foram ROUBADAS no mundo da ENGENHARIA DO SOFTWARE e ADAPTADAS" — verbo: ROUBAR
  { key: "roubadas", from: 2.72, to: 5.6 },
  // "realidade da grande maioria das PESSOAS" — B-roll full
  { key: "pessoas", from: 5.81, to: 7.7 },
  // "PERDER SEU TEMPO diagramando e enviando relatórios" — verbo: PERDER TEMPO
  { key: "relatorios", from: 9.26, to: 11.2 },
  // "o que eu fiz ONTEM, o que eu fiz HOJE e o que eu farei AMANHÃ" — verbo: RESPONDER
  { key: "ontemHojeAmanha", from: 14.84, to: 19.05 },
  // "você vai estar CRIANDO um muro" — B-roll card
  { key: "tijolos", from: 22.71, to: 24.4 },
  // "ele vai ver o que está SENDO FEITO, o que SERÁ FEITO e o que JÁ FOI FEITO" — verbo: VER em 3 tempos
  { key: "feito3", from: 27.14, to: 33.0 },
  // "PROJETASSE ele no SUBCONSCIENTE do teu cliente" — verbo: PROJETAR
  { key: "projetar", from: 38.5, to: 41.6 },
] as const satisfies readonly BeatTiming[];

export type BeatKey = (typeof BEAT_TIMING)[number]["key"];

export const ELEMENT_FRAMES = {
  // caixa f0 · cartas f2/6/10 · rótulo "engenharia de software" 3,84s (f34) · cartas saem "adaptadas" 4,83s (f63/68/73) · "seu negócio" f78
  roubadas: { caixa: 0, cartas: [2, 6, 10], rotulo: 34, saem: [63, 68, 73], destino: 78 },
  // relógio f0 · folhas empilham f4/10/16/22 ("diagramando" 10,11s = f26) · "relatórios" 11,29s cai fora do beat
  relatorios: { relogio: 0, folhas: [4, 10, 16, 22, 28], rotulo: 36 },
  // kicker f0 · ontem 15,58s (f22) · hoje 16,89s (f62) · amanhã 18,44s (f108) · estados +6f
  ontemHojeAmanha: { kicker: 0, linhas: [22, 62, 108], estados: [28, 68, 114] },
  // kicker f0 · colunas: "sendo feito" 28,76s (f49) · "será feito" 30,12s (f89) · "já foi feito" 31,77s (f139) · cartões +6f
  feito3: { kicker: 0, colunas: [49, 89, 139], cartoes: [55, 95, 145] },
  // cabeça f0 · projetor f4 · feixe f6→f18 · muro carimba "subconsciente" 39,14s (f19) · rótulo f30
  projetar: { cabeca: 0, projetor: 4, feixe: 6, carimbo: 19, rotulo: 30 },
} as const;

export const EXTRA_PUNCH_S = [20.44];
