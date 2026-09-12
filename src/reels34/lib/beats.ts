/**
 * "Reels 34" — MARKETING NÃO É MURO (54,23s; fala 0,02–53,69s).
 * Framework 2 (`PLAYBOOK-2.md`), SEM blur de fundo (pedido do dono).
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * O cliente enxerga marketing como um muro, mas não é: as pessoas são
 * programadas a achar real só o que veem. O pedreiro mostra o muro subindo
 * todo dia; no marketing o cliente não vê a campanha sendo otimizada nem o
 * código da página — só sente o resultado. (O vídeo termina no problema;
 * a solução é o Reels 35.) Não há CTA na fala.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook       0,02–7,04s   "você enxerga marketing como se fosse um muro, e não é"
 *   contexto   7,04–20,86s  "programadas desde pequeno: só o que vê é real"
 *   PROBLEMA   20,86–29,79s "pedreiro: o cliente vê o muro subindo cada dia"
 *   contraste  29,79–35,67s "no marketing o cliente não vê isso acontecendo"
 *   exemplos   35,67–53,69s "campanha otimizada / código da página: não vê o trabalho"
 *
 * ── ETAPA 5.3 · TRATAMENTO ────────────────────────────────────────────────
 *   1,83–4,70  OVERLAY  muro (tijolos cobrem a palavra MARKETING)
 *   5,88–7,00  ATRÁS    NÃO É MURO (contorno)
 *   7,85       soco     "grande maioria" (vão limpo de 2,8s)
 *   9,82–12,20 B-ROLL   criança (card) "desde pequeno"
 *  13,00–14,30 ATRÁS    PROGRAMADAS
 *  15,27–20,40 OVERLAY  veReal (VÊ = real | NÃO VÊ = não real)
 *  21,71–22,90 ATRÁS    PROBLEMA (vermelho)
 *  22,91–25,30 B-ROLL   pedreiro (full)
 *  26,30–29,50 OVERLAY  muroSobe (o muro sobe fileira a fileira, dia a dia)
 *  30,61      soco     "trabalho" (vão de 3,7s)
 *  33,50–34,70 ATRÁS    NÃO VÊ (contorno)
 *  37,42–40,80 OVERLAY  otimizacao (painel de anúncios apagado; RESULTADO nítido)
 *  41,84–43,10 ATRÁS    OTIMIZAÇÃO (amarelo — o valor que o cliente não vê)
 *  44,19      soco     "cliente"
 *  45,82–48,00 B-ROLL   código (card)
 *  48,58–53,60 OVERLAY  pagina (código digitando → a página cobre → o trabalho some)
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * 13 eventos (5 overlays + 3 B-roll + 5 palavras-atrás) em 53,7s = 1/4,1s,
 * + 3 socos nos vãos > 2,5s. Alternância O·A·R·A·O·A·R·O·A·O·A·R·O.
 * Nenhuma palavra-atrás dentro do B-roll full (22,91–25,30).
 *
 * ── ETAPA 9 · FAMÍLIAS (uma por beat) ─────────────────────────────────────
 *   muro       · ENXERGAR COMO (cobrir)    → fileira de unidades (tijolos)
 *   veReal     · VER vs NÃO VER            → split / versus
 *   muroSobe   · SUBIR cada dia            → medida crescente
 *   otimizacao · OTIMIZAR sem ser visto    → interface familiar (painel de anúncios)
 *   pagina     · DESENVOLVER (digitar) e ENTREGAR → campo de entrada
 */
export type BeatTiming = { key: string; from: number; to: number };

export const BEAT_TIMING = [
  // "você enxerga MARKETING como se fosse um MURO" — verbo: COBRIR com tijolos
  { key: "muro", from: 1.83, to: 4.7 },
  // "no subconsciente delas desde pequeno" — B-roll card
  { key: "crianca", from: 9.82, to: 12.2 },
  // "só o que ela está VENDO é REAL, aquilo que ela NÃO VÊ NÃO É REAL" — verbo: VER vs NÃO VER
  { key: "veReal", from: 15.27, to: 20.4 },
  // "um PEDREIRO quando vai construir um muro" — B-roll full
  { key: "pedreiro", from: 22.91, to: 25.3 },
  // "o cliente consegue ver o muro SUBINDO CADA DIA que passa" — verbo: SUBIR
  { key: "muroSobe", from: 26.3, to: 29.5 },
  // "ver a campanha sendo OTIMIZADA, ele vai sentir os RESULTADOS" — verbo: OTIMIZAR (invisível)
  { key: "otimizacao", from: 37.42, to: 40.8 },
  // "não vai ver todo o CÓDIGO" — B-roll card
  { key: "codigo", from: 45.82, to: 48.0 },
  // "desenvolver a PÁGINA, ele vai ver a página, mas não vai ver o TRABALHO" — verbo: DIGITAR e COBRIR
  { key: "pagina", from: 48.58, to: 53.6 },
] as const satisfies readonly BeatTiming[];

export type BeatKey = (typeof BEAT_TIMING)[number]["key"];

export const ELEMENT_FRAMES = {
  // MARKETING 2,48s (f20) · tijolos de "como" 3,39s (f47) a "muro" 4,16s (f70) · rótulo f72
  muro: { palavra: 20, tijolos: [47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69], rotulo: 72 },
  // painel VÊ f0 · olho f8 · "real" 17,36s (f63) · painel NÃO VÊ "aquilo" 17,82s (f77) · olho f85 · "não é real" 19,96s (f141)
  veReal: { painelA: 0, olhoA: 8, realA: 63, painelB: 77, olhoB: 85, realB: 141 },
  // base f0 · olho "cliente vê" f4 · fileiras sobem de "muro" 27,27s (f29) a "passa" 29,15s (f86)
  muroSobe: { base: 0, olho: 4, fileiras: [29, 39, 49, 58, 67, 76] },
  // painel f0 · sliders f6/14/22 · selo "não vê" f30 · RESULTADOS 39,92s (f75)
  otimizacao: { painel: 0, sliders: [6, 14, 22], selo: 30, resultado: 75 },
  // código f0 · linhas digitadas · página cobre "ele vai ver a página" 50,00s (f43) · trabalho some "não vai ver" 51,47s (f87) · selo f92
  pagina: { codigo: 0, linhas: [2, 6, 10, 14, 18, 22, 26, 30], pagina: 43, some: 87, selo: 92 },
} as const;

/** Socos extras fora das palavras-atrás (vãos limpos > 2,5s). */
export const EXTRA_PUNCH_S = [7.85, 30.61, 44.19];
