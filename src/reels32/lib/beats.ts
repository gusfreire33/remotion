/**
 * "Reels 32" — CLIENTE QUE JÁ COMPROU vs. PESSOA NOVA (39,40s; fala 0,02–39,36s).
 * Framework 2 (`PLAYBOOK-2.md`), SEM blur de fundo (pedido do dono).
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * A maioria das empresas esquece quem já comprou e corre só atrás de gente
 * nova — isso é assinar o próprio atestado de óbito. Vender de novo pra quem
 * já confiou é muito mais fácil do que convencer um desconhecido, que tem
 * travas mentais: não comprou, não confia, nem sabe quem você é.
 * Não há CTA na fala — não inventar um.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook       0,02–5,56s   "a maioria das empresas esquece das pessoas que já compraram"
 *   contexto   5,56–10,00s  "e vão sempre atrás de pessoas que ainda vão comprar"
 *   RESSALVA   10,00–14,12s "e isso é assinar atestado de óbito precoce"
 *   argumento  14,12–28,79s "muito mais fácil continuar vendendo pra quem já
 *                            confiou… do que convencer uma nova pessoa"
 *   porquê     28,79–39,36s "muito mais difícil, travas mentais: não comprou,
 *                            não confia, nem sabe quem você é"
 *
 * ── ETAPA 5.3 · TRATAMENTO, trecho a trecho ───────────────────────────────
 *   0,00–0,62  limpo
 *   0,62–4,45  OVERLAY  esquece (clientes acesos que APAGAM)
 *   4,84–6,15  ATRÁS    JÁ COMPRARAM
 *   6,34–8,60  B-ROLL   desconhecidos cruzando a rua (full)
 *   9,01–10,30 ATRÁS    COMPRAR (só contorno — o "ainda não")
 *  10,40–14,30 OVERLAY  atestado (assinar + CARIMBO óbito precoce) ★ RESSALVA
 *  14,30–16,26 limpo    "Pensa junto comigo, é muito mais" (1,96s)
 *  16,26–17,40 ATRÁS    FÁCIL (verde)
 *  17,45–19,75 OVERLAY  vendendo (vendas EMPILHANDO pra mesma pessoa)
 *  19,96–21,30 ATRÁS    CONFIOU (amarelo — o conceito)
 *  21,81–24,30 B-ROLL   cliente abrindo o pacote (card)
 *  24,45–30,25 OVERLAY  convencer (JÁ CLIENTE vs NOVA PESSOA; veredito DIFÍCIL)
 *  31,61–32,95 ATRÁS    TRAVAS (vermelho, contorno)
 *  33,90–39,30 OVERLAY  travas fechadas: não comprou / não confia / não sabe quem você é
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * 12 eventos (5 overlays + 2 B-roll + 5 palavras-atrás) em 39,36s = 1/3,3s.
 * Nenhum limpo > 3s (maior: 14,30–16,26 = 1,96s). Alternância estrita
 * O·A·R·A·O·A·O·A·R·O·A·O — nenhum tratamento repetido colado. Nenhuma
 * palavra-atrás cai dentro do B-roll full (6,34–8,60).
 *
 * ── ETAPA 9 · FAMÍLIAS (uma por beat, nenhuma repetida) ───────────────────
 *   esquece    · verbo ESQUECER / APAGAR        → fileira de unidades
 *   atestado   · verbo ASSINAR / CARIMBAR       → selo / carimbo   ★ mais forte
 *   vendendo   · verbo CONTINUAR (empilhar)     → medida crescente
 *   convencer  · verbo CONVENCER (empurrar)     → split / versus
 *   travas     · verbo TRAVAR (não abrir)       → lista com estado
 */
export type BeatTiming = { key: string; from: number; to: number };

export const BEAT_TIMING = [
  // "a grande maioria das empresas ESQUECE das pessoas"
  // verbo: ESQUECER → os clientes acesos apagam um a um
  { key: "esquece", from: 0.62, to: 4.45 },

  // "vão sempre atrás de PESSOAS que ainda vão comprar" — B-roll full
  { key: "desconhecidos", from: 6.34, to: 8.6 },

  // "isso é ASSINAR ATESTADO de ÓBITO PRECOCE"
  // verbo: ASSINAR / CARIMBAR → o carimbo bate no papel   ★ RESSALVA
  { key: "atestado", from: 10.4, to: 14.3 },

  // "você CONTINUAR VENDENDO para uma pessoa"
  // verbo: CONTINUAR → as vendas empilham pra mesma pessoa
  { key: "vendendo", from: 17.45, to: 19.75 },

  // "já COMPROU algo seu e GOSTOU" — B-roll card
  { key: "clienteFeliz", from: 21.81, to: 24.3 },

  // "tentar CONVENCER uma nova pessoa a comprar… é muito mais DIFÍCIL"
  // verbo: CONVENCER / EMPURRAR → o ponto bate nas barreiras e não passa
  { key: "convencer", from: 24.45, to: 30.25 },

  // "não comprou, não confia em você, nem sabe quem você é"
  // verbo: TRAVAR → três cadeados fecham, um por item
  { key: "travas", from: 33.9, to: 39.3 },
] as const satisfies readonly BeatTiming[];

export type BeatKey = (typeof BEAT_TIMING)[number]["key"];

/**
 * Frames (relativos ao início do beat) em que cada elemento entra. A MESMA
 * lista guia a animação e os sons por elemento (Etapa 13.2).
 */
export const ELEMENT_FRAMES = {
  // 5 clientes acendem (0,82s→) · 5 apagam a partir de "esquece" 2,33s (f51) · rótulo 3,06s (f73)
  esquece: {
    acende: [6, 12, 18, 24, 30],
    apaga: [51, 56, 61, 66, 71],
    rotulo: 73,
  },
  // papel f0 · assinatura "assinar" 10,81s (f12) · título "atestado" 11,55s (f35, 8 letras ×2f) · carimbo "óbito" 12,64s (f67)
  atestado: { papel: 0, assina: 12, letras: [35, 37, 39, 41, 43, 45, 47, 49], carimbo: 67 },
  // painel f0 · 4 vendas empilham
  vendendo: { painel: 0, barras: [4, 14, 24, 34] },
  // painéis f0/f6 · cliente chega f20 · "nova pessoa" 26,31s (f56) · batidas nas barreiras f55/f80 · trava "comprar" 27,51s (f92) · veredito "difícil" 29,57s (f154)
  convencer: { painelA: 0, painelB: 6, chega: 20, novaPessoa: 56, batidas: [55, 80, 92], veredito: 154 },
  // kicker f0 · linhas "não comprou" 35,02s (f34) · "não confia" 36,38s (f74) · "nem sabe" 37,76s (f116) · cadeado fecha +6f
  travas: { kicker: 0, linhas: [34, 74, 116], fecha: [40, 80, 122] },
} as const;
