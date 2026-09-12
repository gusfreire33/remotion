import type { Callout } from "./types";

/**
 * MAPA DE EVENTOS — "Vídeo 2 YT.mp4" (YouTube horizontal, 476,9s).
 * Framework 2 + gramática da referência "Bilhon-OS", com os ajustes do dono
 * (11/09/2026): sem legenda, sem blur de fundo, mais B-roll horizontal,
 * cartões com fundo animado + texto DIGITADO (teclado), React Icons.
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * 70% dos profissionais de marketing não sabem disto: marketing é um MURO
 * INVISÍVEL — o cliente não vê o trabalho, então (1) troque relatórios por 3
 * perguntas diárias (ontem/hoje/amanhã) e projete o muro no subconsciente do
 * cliente; (2) muitas vezes o obstáculo do projeto é o próprio cliente;
 * (3) 50–70% da venda acontece DEPOIS do marketing, no comercial — metrifique
 * tudo; (4/5) não esqueça quem já comprou: LTV e RECORRÊNCIA (concessionária →
 * manutenção; Apple → iCloud). CTA: comente / curta / inscreva-se / link.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook          0–19,5s     um número explica demissões → 70% → grava isso
 *   muro          19,8–41s    marketing como muro / só o que vê é real
 *   pedreiro      41,4–80,8s  pedreiro vê o muro; no marketing ninguém vê
 *   filosofia     81,3–100s   3 perguntas roubadas da engenharia de software
 *   relatórios    100,9–129s  mensal/semanal/diário = atestado de óbito
 *   3 perguntas   129,5–150s  ontem / hoje / amanhã
 *   muro visível  150,9–183s  cria o muro no subconsciente do cliente
 *   obstáculo     183,3–254s  o obstáculo é o próprio cliente + CTA comentar
 *   comercial     255–312s    50–70% da venda é depois do marketing
 *   recorrência   313–444s    quem já comprou → LTV → recorrência (carro/Apple)
 *   fecho         444,6–475s  70% de novo + CTA final + link
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * ~95 eventos em 477s = 1 a cada ~5s (a referência: 1 a cada 4–6s). 16 B-rolls
 * horizontais do Pexels, 18 palavras-atrás, 9 cartões, o resto over / chips /
 * steps / ícones / stat. Nenhum BEHIND cai dentro de cartão ou B-roll full.
 *
 * Cada evento tem o trecho da fala em comentário; os `at` são o timestamp da
 * PALAVRA em words.json — o texto entra junto com a boca.
 */
export const CALLOUTS: Callout[] = [
  /* ═══════════════════════ HOOK ═══════════════════════ */

  // 0,02 "Existe um NÚMERO que explica…"  → verbo: revelar → texto no topo
  {
    kind: "over", from: 0.0, to: 1.8, slot: "top",
    lines: [
      { text: "existe um", voice: "sans", at: 0.02 },
      { text: "NÚMERO", voice: "mono", at: 0.44, orange: true },
    ],
  },

  // 1,83 "empresas demitem bons profissionais de marketing"  → B-ROLL literal
  {
    kind: "broll", from: 1.8, to: 4.7, slug: "yt2-demitido", layout: "full", startAt: 0.5,
    label: { text: "empresas DEMITEM bons profissionais", voice: "sans", at: 2.0, accent: [1] },
    why: "'empresas demitem bons profissionais de marketing' — homem guardando as coisas do escritório na caixa",
  },

  // 5,34 "e também porque bons profissionais de marketing PERDEM CLIENTES"
  {
    kind: "over", from: 5.3, to: 10.5, slot: "tr",
    lines: [
      { text: "bons profissionais de marketing", voice: "sans", at: 6.25 },
      { text: "PERDEM CLIENTES", voice: "mono", at: 8.21 },
    ],
  },

  // 12,7 "esse número é 70%. 70%."  ★ atrás — O número do vídeo
  {
    kind: "behind", from: 12.5, to: 15.8, top: 80,
    lines: [
      { text: "esse número é", voice: "sans", at: 12.7 },
      { text: "70%", voice: "mono", at: 13.7, orange: true, size: 300 },
    ],
  },

  // 16,0 "GRAVA ISSO porque até o final desse vídeo você vai entender"
  {
    kind: "over", from: 15.9, to: 19.6, slot: "top", icon: "brain",
    lines: [
      { text: "GRAVA ISSO", voice: "mono", at: 16.0, orange: true },
      { text: "até o final você vai entender o porquê", voice: "sans", at: 16.9 },
    ],
  },

  /* ═══════════════════════ MURO ═══════════════════════ */

  // 22,5 "você enxerga marketing COMO SE FOSSE UM MURO"
  {
    kind: "over", from: 20.5, to: 25.4, slot: "tl", icon: "wall",
    lines: [
      { text: "você enxerga marketing", voice: "sans", at: 22.5 },
      { text: "COMO UM MURO", voice: "mono", at: 23.8 },
    ],
  },

  // 25,7 "e marketing NÃO É MURO"  ★ atrás
  {
    kind: "behind", from: 25.6, to: 27.4,
    lines: [
      { text: "e marketing", voice: "sans", at: 25.7 },
      { text: "NÃO É MURO", voice: "mono", at: 26.5, orange: true },
    ],
  },

  // 28,5 "a grande maioria das pessoas, no SUBCONSCIENTE delas"
  {
    kind: "over", from: 28.2, to: 31.3, slot: "tr",
    lines: [
      { text: "a grande maioria das pessoas", voice: "sans", at: 28.5 },
      { text: "NO SUBCONSCIENTE", voice: "mono", at: 30.3 },
    ],
  },

  // 31,5 "desde pequeno, elas são programadas a entenderem"  → B-ROLL pip (criança)
  {
    kind: "broll", from: 31.4, to: 35.3, slug: "yt2-crianca", layout: "pip", pipSide: "right", startAt: 1.0,
    label: { text: "programadas desde pequeno", voice: "sans", at: 31.8 },
    why: "'desde pequeno, elas são programadas' — menino olhando o tablet",
  },

  // 35,8 "só o que ela está vendo é real"  → CARTÃO digitado (a crença)
  {
    kind: "card", from: 35.5, to: 38.9, bg: "dots",
    lines: [{ text: "SÓ O QUE EU VEJO É REAL", voice: "mono", at: 35.8, typed: true, orange: true, size: 92 }],
  },

  // 39,0 "aquilo que ela não vê NÃO É REAL"
  {
    kind: "over", from: 38.9, to: 41.3, slot: "bl", icon: "eyeOff",
    lines: [
      { text: "aquilo que ela não vê", voice: "sans", at: 39.0 },
      { text: "NÃO É REAL", voice: "mono", at: 40.4 },
    ],
  },

  // 41,5 "e aí é que mora o PROBLEMA"  ★ atrás
  {
    kind: "behind", from: 41.4, to: 43.3,
    lines: [
      { text: "e aí é que mora o", voice: "sans", at: 41.5 },
      { text: "PROBLEMA", voice: "mono", at: 42.3, orange: true },
    ],
  },

  /* ═══════════════════════ PEDREIRO ═══════════════════════ */

  // 43,5 "um pedreiro quando vai construir um muro, o cliente consegue VER o muro subindo"  → B-ROLL
  {
    kind: "broll", from: 43.4, to: 49.7, slug: "yt2-pedreiro", layout: "full", startAt: 0.3,
    label: { text: "o cliente VÊ o muro subindo", voice: "sans", at: 45.9, accent: [2] },
    why: "'um pedreiro quando vai construir um muro… vê o muro subindo' — pedreiro assentando cimento na parede",
  },

  // 50,4 "já no seu trabalho, dentro do marketing, O CLIENTE NÃO VÊ"  ★ atrás
  {
    kind: "behind", from: 50.3, to: 55.5,
    lines: [
      { text: "já no marketing,", voice: "sans", at: 50.4 },
      { text: "O CLIENTE NÃO VÊ", voice: "mono", at: 53.5, orange: true },
    ],
  },

  // 56,3 "não vai conseguir ver a campanha sendo otimizada"  → B-ROLL pip (dashboard)
  {
    kind: "broll", from: 56.1, to: 59.5, slug: "yt2-dashboard", layout: "pip", pipSide: "right", startAt: 0.5,
    label: { text: "a campanha sendo otimizada", voice: "sans", at: 57.7 },
    why: "'ver a campanha sendo otimizada' — olhando gráficos no laptop",
  },

  // 59,6 "ele vai sentir os resultados, mas não vê a otimização"
  {
    kind: "over", from: 59.5, to: 64.3, slot: "tl",
    lines: [
      { text: "ele vai sentir os resultados,", voice: "sans", at: 59.6 },
      { text: "MAS NÃO VÊ A OTIMIZAÇÃO", voice: "mono", at: 62.1 },
    ],
  },

  // 65,7 "não vai ver todo o CÓDIGO… na hora de desenvolver a página"  → B-ROLL
  {
    kind: "broll", from: 64.6, to: 70.5, slug: "yt2-codigo", layout: "full", startAt: 1.0,
    label: { text: "todo o CÓDIGO da página", voice: "sans", at: 66.2, accent: [2] },
    why: "'todo o código… na hora de desenvolver a página' — código sendo digitado na tela",
  },

  // 70,9 "ele vai ver a página, mas não vai ver o trabalho"
  {
    kind: "over", from: 70.8, to: 74.6, slot: "top",
    lines: [
      { text: "ele vai ver a página,", voice: "sans", at: 70.9 },
      { text: "NÃO O TRABALHO", voice: "mono", at: 72.3 },
    ],
  },

  // 76,3 "eu poderia citar vários casos"  → ícones dos "vários casos"
  {
    kind: "icons", from: 76.0, to: 80.9, slot: "bottom",
    items: [
      { icon: "megaphone", label: "tráfego", at: 76.7 },
      { icon: "instagram", label: "social media", at: 77.3 },
      { icon: "mail", label: "e-mail", at: 77.9 },
      { icon: "bot", label: "automação", at: 78.5 },
    ],
  },

  /* ═══════════════════════ FILOSOFIA ═══════════════════════ */

  // 81,4 "isso abre margem pra aplicar UMA FILOSOFIA"
  {
    kind: "over", from: 81.3, to: 86.9, slot: "tl", icon: "bulb",
    lines: [
      { text: "isso abre margem pra", voice: "sans", at: 81.4 },
      { text: "UMA FILOSOFIA", voice: "mono", at: 84.4, orange: true },
    ],
  },

  // 89,2 "3 PERGUNTAS que precisam ser respondidas"  ★ atrás
  {
    kind: "behind", from: 89.0, to: 92.0,
    lines: [
      { text: "3 PERGUNTAS", voice: "mono", at: 89.2, orange: true },
      { text: "que precisam ser respondidas", voice: "sans", at: 90.1 },
    ],
  },

  // 92,6 "roubado do mundo da engenharia de software"  → B-ROLL pip
  {
    kind: "broll", from: 92.3, to: 96.5, slug: "yt2-engenharia", layout: "pip", pipSide: "left", startAt: 2.0,
    label: { text: "roubado da engenharia de software", voice: "sans", at: 92.6 },
    why: "'roubado do mundo da engenharia de software' — engenheiro explicando no quadro",
  },

  // 97,1 "pra você começar a aplicar na sua vida A PARTIR DE HOJE"
  {
    kind: "over", from: 96.9, to: 100.5, slot: "tr",
    lines: [
      { text: "pra você aplicar na sua vida", voice: "sans", at: 97.1 },
      { text: "A PARTIR DE HOJE", voice: "mono", at: 99.5 },
    ],
  },

  /* ═══════════════════════ RELATÓRIOS ═══════════════════════ */

  // 102,2 "relatório mensal não funciona, semanal não funciona, diário não funciona"  → chips riscados
  {
    kind: "chips", from: 101.8, to: 109.5, slot: "bottom",
    items: [
      { text: "relatório mensal", at: 102.2, muted: true, icon: "calendar" },
      { text: "relatório semanal", at: 104.8, muted: true, icon: "days" },
      { text: "relatório diário", at: 107.4, muted: true, icon: "clock" },
    ],
    tail: { text: "NÃO FUNCIONA", voice: "mono", at: 108.6, orange: true },
  },

  // 109,9 "eles são como ATESTADO DE ÓBITO ATRASADO"  → CARTÃO digitado
  {
    kind: "card", from: 109.6, to: 112.6, bg: "sparks",
    lines: [
      { text: "eles são como", voice: "sans", at: 109.9, typed: true },
      { text: "ATESTADO DE ÓBITO ATRASADO", voice: "mono", at: 110.5, typed: true, orange: true },
    ],
  },

  // 112,9 "é muito fácil de te explicar O POR QUÊ"
  {
    kind: "over", from: 112.7, to: 115.1, slot: "top",
    lines: [
      { text: "é muito fácil de te explicar", voice: "sans", at: 112.9 },
      { text: "O POR QUÊ", voice: "mono", at: 114.5 },
    ],
  },

  // 116,8 "relatório mensal… 30 DIAS de prazo"  → B-ROLL pip (calendário)
  {
    kind: "broll", from: 116.6, to: 121.4, slug: "yt2-calendario", layout: "pip", pipSide: "left", startAt: 1.0,
    label: { text: "30 DIAS de prazo", voice: "sans", at: 119.4, accent: [0, 1] },
    why: "'30 dias de prazo' — pessoa circulando a data no calendário",
  },

  // 122,8 "analisar as métricas… durante 30 dias… tomaram a decisão"  → fluxo (ícones + setas)
  {
    kind: "icons", from: 122.4, to: 129.2, slot: "bottom", arrows: true,
    items: [
      { icon: "bars", label: "métricas", at: 122.8 },
      { icon: "calendar", label: "30 dias", at: 126.4 },
      { icon: "target", label: "decisão", at: 128.2, orange: true },
    ],
  },

  /* ═══════════════════════ 3 PERGUNTAS ═══════════════════════ */

  // 129,9 "como eu falei a menos de um minuto atrás, existem 3 PERGUNTAS SIMPLES"
  {
    kind: "over", from: 129.7, to: 134.0, slot: "tl",
    lines: [
      { text: "como eu falei há menos de um minuto", voice: "sans", at: 129.9 },
      { text: "3 PERGUNTAS SIMPLES", voice: "mono", at: 132.3 },
    ],
  },

  // 134,4 "roubadas da engenharia do software e ADAPTADAS pra realidade"
  {
    kind: "over", from: 134.2, to: 139.5, slot: "tr",
    lines: [
      { text: "roubadas da engenharia de software", voice: "sans", at: 134.4 },
      { text: "ADAPTADAS PRA VOCÊ", voice: "mono", at: 136.7 },
    ],
  },

  // 142,1 "diagramando e enviando relatórios"  → B-ROLL pip (papelada)
  {
    kind: "broll", from: 140.0, to: 144.1, slug: "yt2-relatorios", layout: "pip", pipSide: "right", startAt: 0.5,
    label: { text: "diagramando e enviando relatórios", voice: "sans", at: 142.1 },
    why: "'diagramando e enviando relatórios' — pilha de papelada na mesa",
  },

  // 146,7 "O que eu fiz ontem, o que eu fiz hoje e o que eu farei amanhã"  → CARTÃO digitado (as 3 perguntas)
  {
    kind: "card", from: 146.3, to: 151.0, bg: "grid", width: 1300,
    lines: [
      { text: "O QUE EU FIZ ONTEM?", voice: "mono", at: 146.7, typed: true, size: 64 },
      { text: "O QUE EU FIZ HOJE?", voice: "mono", at: 148.0, typed: true, size: 64 },
      { text: "O QUE EU FAREI AMANHÃ?", voice: "mono", at: 149.1, typed: true, size: 64, orange: true },
    ],
  },

  // 151,1 "num momento que você passa a fazer isso, você vai começar a reparar"
  {
    kind: "over", from: 151.0, to: 155.1, slot: "chest",
    lines: [
      { text: "no momento que você passa a fazer isso", voice: "sans", at: 151.1 },
      { text: "VOCÊ VAI REPARAR", voice: "mono", at: 153.7 },
    ],
  },

  // 155,3 "você vai estar criando UM MURO para o seu cliente"  ★ atrás
  {
    kind: "behind", from: 155.2, to: 158.0,
    lines: [
      { text: "você vai estar criando", voice: "sans", at: 155.3 },
      { text: "UM MURO", voice: "mono", at: 156.1, orange: true },
    ],
  },

  // 159,3 "ele vai ver o que está sendo feito, o que será feito e o que já foi feito"  → lista com estado
  {
    kind: "steps", from: 158.6, to: 165.0,
    items: [
      { mark: "1", icon: "refresh", text: "o que está sendo feito", at: 159.9 },
      { mark: "2", icon: "arrow", text: "o que será feito", at: 161.8 },
      { mark: "3", icon: "check", text: "o que já foi feito", at: 163.5 },
    ],
  },

  // 165,9 "você deixasse de ter o seu MURO INVISÍVEL"
  {
    kind: "over", from: 165.7, to: 169.5, slot: "tl",
    lines: [
      { text: "você deixa de ter o", voice: "sans", at: 165.9 },
      { text: "MURO INVISÍVEL", voice: "mono", at: 168.4 },
    ],
  },

  // 169,8 "e projetasse ele no SUBCONSCIENTE do teu cliente"  ★ atrás
  {
    kind: "behind", from: 169.7, to: 172.9,
    lines: [
      { text: "e projeta ele no", voice: "sans", at: 169.8 },
      { text: "SUBCONSCIENTE", voice: "mono", at: 171.1, orange: true },
    ],
  },

  // 173,7 "o cliente vai passar a ACREDITAR MUITO MAIS em você"  ★ atrás
  {
    kind: "behind", from: 173.5, to: 177.4,
    lines: [
      { text: "o cliente vai passar a", voice: "sans", at: 173.7 },
      { text: "ACREDITAR MUITO MAIS", voice: "mono", at: 175.2, size: 120 },
    ],
  },

  // 177,9 "vai ver, ou melhor, SENTIR que o trabalho está sendo bem feito"
  {
    kind: "over", from: 177.8, to: 183.0, slot: "bl",
    lines: [
      { text: "vai ver, ou melhor,", voice: "sans", at: 177.9 },
      { text: "SENTIR", voice: "mono", at: 179.2, orange: true },
      { text: "que o trabalho está sendo bem feito", voice: "sans", at: 179.7 },
    ],
  },

  /* ═══════════════════════ OBSTÁCULO ═══════════════════════ */

  // 183,3 "outro ponto… é um ponto MUITO COMUM"
  {
    kind: "over", from: 183.2, to: 186.3, slot: "top",
    lines: [
      { text: "outro ponto,", voice: "sans", at: 183.3 },
      { text: "MUITO COMUM", voice: "mono", at: 185.5 },
    ],
  },

  // 186,9 "quase ninguém tem a coragem de falar isso EM VOZ ALTA"  ★ atrás
  {
    kind: "behind", from: 186.5, to: 190.2,
    lines: [
      { text: "quase ninguém tem coragem de falar", voice: "sans", at: 186.9 },
      { text: "EM VOZ ALTA", voice: "mono", at: 189.5, orange: true },
    ],
  },

  // 190,6 "na grande maioria das vezes, o obstáculo do projeto vai ser o próprio cliente"  → CARTÃO digitado
  {
    kind: "card", from: 190.4, to: 195.8, bg: "aurora", width: 1400,
    lines: [
      { text: "na grande maioria das vezes,", voice: "sans", at: 190.6, typed: true },
      { text: "O OBSTÁCULO É O PRÓPRIO CLIENTE", voice: "mono", at: 192.6, typed: true, orange: true, size: 68 },
    ],
  },

  // 196,4 "eu cito isso por CASO PESSOAL"
  {
    kind: "over", from: 196.3, to: 199.3, slot: "tl", icon: "user",
    lines: [
      { text: "cito por", voice: "sans", at: 196.4 },
      { text: "CASO PESSOAL", voice: "mono", at: 197.3 },
    ],
  },

  // 199,5 "e com casos… de diversos outros AMIGOS E PESSOAS EM COMUM"
  {
    kind: "over", from: 199.4, to: 205.5, slot: "tr", icon: "users",
    lines: [
      { text: "e casos de diversos", voice: "sans", at: 199.5 },
      { text: "AMIGOS E PESSOAS EM COMUM", voice: "mono", at: 203.0 },
    ],
  },

  // 209,4 "não vai ser você, não o tráfego, não o funil, não o comercial — e sim o próprio cliente"
  {
    kind: "chips", from: 206.0, to: 216.0, slot: "bottom",
    items: [
      { text: "você", at: 209.4, muted: true, icon: "user" },
      { text: "o tráfego", at: 210.6, muted: true, icon: "megaphone" },
      { text: "o funil", at: 212.3, muted: true, icon: "filter" },
      { text: "o comercial", at: 213.8, muted: true, icon: "phone" },
    ],
    tail: { text: "E SIM O PRÓPRIO CLIENTE", voice: "mono", at: 214.5, orange: true },
  },

  // 217,2 "precisa estar muito ALINHADO com o cliente"  → B-ROLL pip (aperto de mãos)
  {
    kind: "broll", from: 216.8, to: 221.0, slug: "yt2-cliente", layout: "pip", pipSide: "right", startAt: 1.0,
    label: { text: "muito ALINHADO com o cliente", voice: "sans", at: 218.0, accent: [1] },
    why: "'muito alinhado com o cliente' — aperto de mãos com o cliente",
  },

  // 221,4 "em um certo ponto ele vai começar a ser O PRÓPRIO OBSTÁCULO"  ★ atrás
  {
    kind: "behind", from: 221.2, to: 225.6,
    lines: [
      { text: "em um certo ponto ele vai ser", voice: "sans", at: 221.4 },
      { text: "O PRÓPRIO OBSTÁCULO", voice: "mono", at: 224.4, size: 125 },
    ],
  },

  // 226,8 "mas é claro que o cliente NÃO FAZ ISSO POR QUERER"
  {
    kind: "over", from: 226.6, to: 229.0, slot: "top",
    lines: [
      { text: "mas é claro que o cliente", voice: "sans", at: 226.8 },
      { text: "NÃO FAZ ISSO POR QUERER", voice: "mono", at: 227.8 },
    ],
  },

  // 229,1 "afinal ninguém quer ATRASAR A PRÓPRIA VIDA"
  {
    kind: "over", from: 229.05, to: 231.6, slot: "chest",
    lines: [
      { text: "afinal ninguém quer", voice: "sans", at: 229.1 },
      { text: "ATRASAR A PRÓPRIA VIDA", voice: "mono", at: 230.2 },
    ],
  },

  // 231,7 "inconscientemente o cliente vai acabar se tornando A PEDRA NA PRÓPRIA BOTA"  → CARTÃO digitado
  {
    kind: "card", from: 231.7, to: 237.3, bg: "waves", width: 1300,
    lines: [
      { text: "inconscientemente, o cliente vira", voice: "sans", at: 231.8, typed: true },
      { text: "A PEDRA NA PRÓPRIA BOTA", voice: "mono", at: 235.3, typed: true, orange: true },
    ],
  },

  // 238,6 "eu quero te desafiar… a COMENTAR AQUI ABAIXO"
  {
    kind: "over", from: 237.9, to: 243.1, slot: "bl", icon: "chat",
    lines: [
      { text: "te desafio a", voice: "sans", at: 238.6 },
      { text: "COMENTAR AQUI ABAIXO", voice: "mono", at: 241.2, orange: true },
    ],
  },

  // 243,4 "um momento onde… o obstáculo NÃO ERA MAIS VOCÊ"
  {
    kind: "over", from: 243.2, to: 248.6, slot: "tr",
    lines: [
      { text: "um momento onde o obstáculo", voice: "sans", at: 243.4 },
      { text: "NÃO ERA MAIS VOCÊ", voice: "mono", at: 247.3 },
    ],
  },

  // 249,8 "não era mais algo no seu controle e sim PASSOU A SER O CLIENTE"  ★ atrás
  {
    kind: "behind", from: 248.8, to: 254.4,
    lines: [
      { text: "não era mais algo no seu controle,", voice: "sans", at: 249.8 },
      { text: "PASSOU A SER O CLIENTE", voice: "mono", at: 252.9, orange: true, size: 110 },
    ],
  },

  /* ═══════════════════════ COMERCIAL ═══════════════════════ */

  // 255,1 "outra coisa que muita gente sabe MAS NÃO SABE VERBALIZAR"
  {
    kind: "over", from: 255.0, to: 260.4, slot: "top",
    lines: [
      { text: "outra coisa que muita gente sabe", voice: "sans", at: 255.1 },
      { text: "MAS NÃO SABE VERBALIZAR", voice: "mono", at: 258.4 },
    ],
  },

  // 260,8 "50 a 70% da venda não acontece no marketing"  → número contando
  {
    kind: "stat", from: 260.5, to: 267.7, slot: "tl", at: 260.8,
    value: 70, prefix: "50 a ", suffix: "%", label: "da venda não acontece no marketing", icon: "percent",
  },

  // 265,5 "e sim no que vem DEPOIS DO MARKETING"  ★ atrás
  {
    kind: "behind", from: 265.3, to: 267.9,
    lines: [
      { text: "e sim no que vem", voice: "sans", at: 265.5 },
      { text: "DEPOIS DO MARKETING", voice: "mono", at: 266.6, orange: true, size: 125 },
    ],
  },

  // 268,7 "por que EU FALO ISSO?"
  {
    kind: "over", from: 268.6, to: 272.7, slot: "chest", icon: "question",
    lines: [
      { text: "por que", voice: "sans", at: 268.7 },
      { text: "EU FALO ISSO?", voice: "mono", at: 270.3 },
    ],
  },

  // 273,8 "culpando o gestor de tráfego, o social media, o copywriter, o desenvolvedor… porque não está vendendo"
  {
    kind: "chips", from: 273.3, to: 281.7, slot: "bottom",
    items: [
      { text: "gestor de tráfego", at: 273.8, icon: "megaphone" },
      { text: "social media", at: 274.9, icon: "instagram" },
      { text: "copywriter", at: 276.9, icon: "pen" },
      { text: "desenvolvedor de páginas", at: 277.9, icon: "laptop" },
    ],
    tail: { text: "PORQUE NÃO ESTÁ VENDENDO", voice: "mono", at: 279.8, orange: true },
  },

  // 284,0 "o problema não está em nenhum desses pontos E SIM NO COMERCIAL"  ★ atrás
  {
    kind: "behind", from: 283.8, to: 288.0,
    lines: [
      { text: "o problema não está em nenhum desses pontos", voice: "sans", at: 284.0 },
      { text: "E SIM NO COMERCIAL", voice: "mono", at: 286.7, orange: true, size: 130 },
    ],
  },

  // 288,7 "eu sempre reforço: muito ATENTO NO COMERCIAL"
  {
    kind: "over", from: 288.5, to: 292.0, slot: "tr", icon: "eye",
    lines: [
      { text: "eu sempre reforço:", voice: "sans", at: 288.7 },
      { text: "ATENTO NO COMERCIAL", voice: "mono", at: 290.7 },
    ],
  },

  // 294,0 "sempre METRIFICANDO tudo que acontece no comercial"  → B-ROLL (time de vendas)
  {
    kind: "broll", from: 292.5, to: 297.1, slug: "yt2-comercial", layout: "full", startAt: 1.0,
    label: { text: "METRIFICANDO tudo que acontece no comercial", voice: "sans", at: 293.6, accent: [0] },
    why: "'atento no comercial… metrificando tudo' — time de vendas no telefone",
  },

  // 297,9 "do mesmo jeito que você manda RELATÓRIO MENSAL OU SEMANAL"
  {
    kind: "over", from: 297.3, to: 302.2, slot: "tl",
    lines: [
      { text: "do mesmo jeito que você manda", voice: "sans", at: 297.9 },
      { text: "RELATÓRIO MENSAL OU SEMANAL", voice: "mono", at: 300.5 },
    ],
  },

  // 302,5 "o comercial também deveria mandar, afinal estão todos compondo O MESMO FUNIL"
  {
    kind: "over", from: 302.3, to: 307.9, slot: "tr", icon: "filter",
    lines: [
      { text: "o comercial também deveria mandar,", voice: "sans", at: 302.5 },
      { text: "É O MESMO FUNIL", voice: "mono", at: 305.6, orange: true },
    ],
  },

  // 309,1 "tudo tem que ser metrificado, claro, processado"  → ícones (lista com estado)
  {
    kind: "icons", from: 308.1, to: 313.1, slot: "bottom",
    items: [
      { icon: "bars", label: "metrificado", at: 309.1 },
      { icon: "eye", label: "claro", at: 310.7 },
      { icon: "workflow", label: "processado", at: 312.1, orange: true },
    ],
  },

  /* ═══════════════════════ RECORRÊNCIA ═══════════════════════ */

  // 313,5 "pra fecharmos o vídeo com CHAVE DE OURO"
  {
    kind: "over", from: 313.0, to: 316.3, slot: "top", icon: "key",
    lines: [
      { text: "pra fechar com", voice: "sans", at: 313.5 },
      { text: "CHAVE DE OURO", voice: "mono", at: 315.4, orange: true },
    ],
  },

  // 316,5 "o quinto e último ponto QUE NÃO PODE FALTAR"  ★ atrás
  {
    kind: "behind", from: 316.4, to: 319.4,
    lines: [
      { text: "o quinto e último ponto", voice: "sans", at: 316.5 },
      { text: "QUE NÃO PODE FALTAR", voice: "mono", at: 318.1, size: 125 },
    ],
  },

  // 320,1 "a grande maioria das empresas ESQUECE DE QUEM JÁ COMPROU"
  {
    kind: "over", from: 319.9, to: 325.0, slot: "tl",
    lines: [
      { text: "a grande maioria das empresas", voice: "sans", at: 320.1 },
      { text: "ESQUECE DE QUEM JÁ COMPROU", voice: "mono", at: 322.2 },
    ],
  },

  // 325,5 "e vão sempre atrás de pessoas que AINDA vão comprar"  → B-ROLL (multidão)
  {
    kind: "broll", from: 325.2, to: 330.0, slug: "yt2-multidao", layout: "full", startAt: 2.0,
    label: { text: "atrás de quem AINDA vai comprar", voice: "sans", at: 326.0, accent: [3] },
    why: "'vão sempre atrás de pessoas que ainda vão comprar' — calçada lotada de gente passando",
  },

  // 330,5 "isso é assinar ATESTADO DE ÓBITO PRECOCE"  → CARTÃO digitado
  {
    kind: "card", from: 330.1, to: 334.1, bg: "sparks",
    lines: [
      { text: "isso é assinar", voice: "sans", at: 330.5, typed: true },
      { text: "ATESTADO DE ÓBITO PRECOCE", voice: "mono", at: 331.3, typed: true, orange: true },
    ],
  },

  // 335,7 "pensa junto comigo: é MUITO MAIS FÁCIL"  ★ atrás
  {
    kind: "behind", from: 334.2, to: 338.6,
    lines: [
      { text: "pensa junto comigo:", voice: "sans", at: 334.3 },
      { text: "MUITO MAIS FÁCIL", voice: "mono", at: 335.7, orange: true },
    ],
  },

  // 340,1 "uma pessoa que já confiou em você, já comprou e gostou"  → chips
  {
    kind: "chips", from: 339.2, to: 344.9, slot: "bottom",
    items: [
      { text: "já confiou em você", at: 340.1, icon: "badge" },
      { text: "já comprou", at: 341.8, icon: "cart" },
      { text: "e gostou", at: 343.3, icon: "heart", orange: true },
    ],
  },

  // 345,1 "do que tentar convencer UMA NOVA PESSOA"
  {
    kind: "over", from: 344.95, to: 348.6, slot: "chest",
    lines: [
      { text: "do que convencer", voice: "sans", at: 345.1 },
      { text: "UMA NOVA PESSOA", voice: "mono", at: 346.2 },
    ],
  },

  // 349,1 "é muito mais difícil, existem muito mais TRAVAS MENTAIS"  ★ atrás
  {
    kind: "behind", from: 349.0, to: 353.0,
    lines: [
      { text: "é muito mais difícil, existem", voice: "sans", at: 349.1 },
      { text: "TRAVAS MENTAIS", voice: "mono", at: 351.7, orange: true },
    ],
  },

  // 354,8 "ainda não comprou, ainda não confia, nem sabe quem você é"  → chips riscados
  {
    kind: "chips", from: 353.5, to: 359.6, slot: "bottom",
    items: [
      { text: "ainda não comprou", at: 354.8, muted: true, icon: "cart" },
      { text: "ainda não confia", at: 356.3, muted: true, icon: "shield" },
      { text: "nem sabe quem você é", at: 358.1, muted: true, icon: "question" },
    ],
  },

  // 360,2 "do que uma pessoa que JÁ CONFIA, JÁ COMPROU, GOSTA de você"
  {
    kind: "over", from: 360.0, to: 365.2, slot: "tr",
    lines: [
      { text: "do que uma pessoa que", voice: "sans", at: 360.2 },
      { text: "JÁ CONFIA, JÁ COMPROU, GOSTA", voice: "mono", at: 361.3, orange: true },
    ],
  },

  // 369,3 "vender várias vezes para a mesma pessoa AUMENTANDO O LTV"
  {
    kind: "over", from: 367.2, to: 374.0, slot: "tl", icon: "up",
    lines: [
      { text: "vender várias vezes pra mesma pessoa", voice: "sans", at: 369.3 },
      { text: "AUMENTANDO O LTV", voice: "mono", at: 372.2 },
    ],
  },

  // 374,5 "mas você começar a pensar em RECORRÊNCIA"  ★ atrás — o conceito do bloco
  {
    kind: "behind", from: 374.2, to: 378.3,
    lines: [
      { text: "mas você começar a pensar em", voice: "sans", at: 374.5 },
      { text: "RECORRÊNCIA", voice: "mono", at: 376.8, orange: true },
    ],
  },

  // 379,0 "a real é: em 2026 E NOS PRÓXIMOS ANOS"
  {
    kind: "over", from: 378.5, to: 382.0, slot: "top",
    lines: [
      { text: "a real é:", voice: "sans", at: 379.0 },
      { text: "EM 2026 E NOS PRÓXIMOS ANOS", voice: "mono", at: 379.7 },
    ],
  },

  // 384,1 "preso em produtos de PAGAMENTO ÚNICO"  → B-ROLL pip (maquininha)
  {
    kind: "broll", from: 382.2, to: 386.6, slug: "yt2-pagamento", layout: "pip", pipSide: "left", startAt: 1.0,
    label: { text: "produtos de pagamento único", voice: "sans", at: 384.1 },
    why: "'produtos de pagamento único' — pagando com cartão na maquininha",
  },

  // 386,8 "você está FADADO A FALIR"  → CARTÃO digitado (veredito)
  {
    kind: "card", from: 386.7, to: 389.4, bg: "grid",
    lines: [
      { text: "você está", voice: "sans", at: 386.8, typed: true },
      { text: "FADADO A FALIR", voice: "mono", at: 387.6, typed: true, orange: true, size: 104 },
    ],
  },

  // 389,9 "Gustavo, eu não consigo PÔR UMA RECORRÊNCIA, meu modelo de negócio não permite"
  {
    kind: "over", from: 389.6, to: 396.0, slot: "tr",
    lines: [
      { text: "\"Gustavo, eu não consigo", voice: "sans", at: 389.9 },
      { text: "PÔR UMA RECORRÊNCIA", voice: "mono", at: 391.7 },
      { text: "meu modelo de negócio não permite\"", voice: "sans", at: 393.1 },
    ],
  },

  // 396,7 "LEMBRE-SE DESSE EXEMPLO"
  {
    kind: "over", from: 396.6, to: 398.8, slot: "top",
    lines: [{ text: "LEMBRE-SE DESSE EXEMPLO", voice: "mono", at: 396.7, orange: true }],
  },

  // 399,5 "até uma concessionária de carro que vende um carro"  → B-ROLL
  {
    kind: "broll", from: 399.0, to: 403.4, slug: "yt2-concessionaria", layout: "full", startAt: 1.0,
    label: { text: "até uma concessionária de carro", voice: "sans", at: 399.5 },
    why: "'uma concessionária de carro que vende um carro' — casal comprando carro no showroom",
  },

  // 403,5 "um brasileiro médio A CADA 3, 4 ANOS"
  {
    kind: "over", from: 403.45, to: 407.2, slot: "chest", icon: "car",
    lines: [
      { text: "um brasileiro médio compra carro", voice: "sans", at: 403.5 },
      { text: "A CADA 3, 4 ANOS", voice: "mono", at: 404.9 },
    ],
  },

  // 407,0 "tem uma recorrência sem que VOCÊ NEM SABE que ela tem"  ★ atrás
  {
    kind: "behind", from: 407.2, to: 411.0,
    lines: [
      { text: "tem uma recorrência que", voice: "sans", at: 407.3 },
      { text: "VOCÊ NEM SABE", voice: "mono", at: 409.0, orange: true },
    ],
  },

  // 412,6 "no mundo dos automóveis… a recorrência é uma RECORRÊNCIA SEMESTRAL"
  {
    kind: "over", from: 411.3, to: 419.0, slot: "tl", icon: "repeat",
    lines: [
      { text: "no mundo dos automóveis,", voice: "sans", at: 412.6 },
      { text: "RECORRÊNCIA SEMESTRAL", voice: "mono", at: 416.7 },
    ],
  },

  // 420,2 "que nada mais é que a MANUTENÇÃO do seu automóvel"  → B-ROLL (mecânico)
  {
    kind: "broll", from: 419.3, to: 422.7, slug: "yt2-manutencao", layout: "full", startAt: 1.0,
    label: { text: "a MANUTENÇÃO do automóvel", voice: "sans", at: 420.0, accent: [1] },
    why: "'a manutenção do seu automóvel' — mecânico checando o motor",
  },

  // 422,8 "assim eu espero QUE VOCÊ FAÇA"
  {
    kind: "over", from: 422.75, to: 424.7, slot: "top",
    lines: [
      { text: "assim eu espero", voice: "sans", at: 422.8 },
      { text: "QUE VOCÊ FAÇA", voice: "mono", at: 423.7 },
    ],
  },

  // 426,6 "a Apple que vende os seus iPhones de 10, 12, 13, 15 mil reais"  → B-ROLL (smartphone)
  {
    kind: "broll", from: 426.2, to: 432.7, slug: "yt2-iphone", layout: "full", startAt: 0.5,
    label: { text: "iPhones de 10, 12, 13, 15 MIL REAIS", voice: "sans", at: 427.9, accent: [6, 7] },
    why: "'a Apple que vende os seus iPhones' — pessoa segurando o smartphone",
  },

  // 433,1 "a real grana ESTÁ NA RECORRÊNCIA"
  {
    kind: "over", from: 433.0, to: 435.7, slot: "chest", icon: "banknote",
    lines: [
      { text: "a real grana", voice: "sans", at: 433.1 },
      { text: "ESTÁ NA RECORRÊNCIA", voice: "mono", at: 433.9, orange: true },
    ],
  },

  // 436,0 "onde que a Apple tem A RECORRÊNCIA?"
  {
    kind: "over", from: 435.8, to: 438.6, slot: "tr",
    lines: [
      { text: "onde a Apple tem", voice: "sans", at: 436.0 },
      { text: "A RECORRÊNCIA?", voice: "mono", at: 437.3 },
    ],
  },

  // 438,9 "NO iCLOUD, MEU FILHO."  → CARTÃO digitado (a resposta)
  {
    kind: "card", from: 438.7, to: 440.7, bg: "aurora", frame: false,
    lines: [{ text: "NO iCLOUD, MEU FILHO.", voice: "mono", at: 438.9, typed: true, orange: true, size: 104 }],
  },

  // 441,4 "na iCloud é onde mora o verdadeiro DINHEIRO"  → B-ROLL pip (servidores)
  {
    kind: "broll", from: 440.7, to: 444.5, slug: "yt2-icloud", layout: "pip", pipSide: "right", startAt: 3.0,
    label: { text: "é onde mora o verdadeiro DINHEIRO", voice: "sans", at: 441.4, accent: [5] },
    why: "'na iCloud é onde mora o verdadeiro dinheiro' — servidores de armazenamento",
  },

  /* ═══════════════════════ FECHO ═══════════════════════ */

  // 445,2 "lá no início do vídeo eu falei que O NÚMERO ERA 70%"
  {
    kind: "over", from: 445.0, to: 449.7, slot: "tl",
    lines: [
      { text: "lá no início eu falei que", voice: "sans", at: 445.2 },
      { text: "O NÚMERO ERA 70%", voice: "mono", at: 448.6, orange: true },
    ],
  },

  // 452,1 "70% das pessoas que trabalham com marketing NÃO SABEM do que você acabou de ver"  ★ atrás
  {
    kind: "behind", from: 451.3, to: 458.9, top: 80,
    lines: [
      { text: "70%", voice: "mono", at: 452.1, orange: true, size: 300 },
      { text: "não sabem o que você acabou de ver", voice: "sans", at: 455.9 },
    ],
  },

  // 460,9 "curta, comente, compartilhe… e se inscreva"  → ícones (interface familiar)
  {
    kind: "icons", from: 460.2, to: 466.2, slot: "bottom",
    items: [
      { icon: "thumbs", label: "curta", at: 460.9 },
      { icon: "chat", label: "comente", at: 461.3 },
      { icon: "share", label: "compartilhe", at: 461.7 },
      { icon: "bell", label: "inscreva-se", at: 463.7, orange: true },
    ],
  },

  // 467,5 "todo o seu marketing, ecossistema, agentes de IA… PRIMEIRO LINK NA DESCRIÇÃO"  → CARTÃO final digitado
  {
    kind: "card", from: 467.2, to: 476.8, bg: "grid", width: 1400,
    lines: [
      { text: "todo o seu marketing em um só lugar", voice: "sans", at: 467.5, typed: true },
      { text: "PRIMEIRO LINK NA DESCRIÇÃO", voice: "mono", at: 474.1, typed: true, orange: true, size: 70 },
    ],
    icons: [
      { icon: "megaphone", label: "marketing", at: 468.3 },
      { icon: "network", label: "ecossistema", at: 469.1 },
      { icon: "bot", label: "agentes de IA", at: 470.0 },
      { icon: "puzzle", label: "soluções", at: 470.9, orange: true },
    ],
  },
];

/** socos de zoom: nas palavras-atrás, cartões e stats */
export const PUNCHES_S: number[] = CALLOUTS.filter(
  (c) => c.kind === "behind" || c.kind === "card" || c.kind === "stat",
).map((c) => c.from);

/** true se o segundo cai dentro de um cartão/B-roll full (a pessoa some) */
export const isCoveredAt = (s: number): boolean =>
  CALLOUTS.some(
    (c) => (c.kind === "card" || (c.kind === "broll" && c.layout === "full")) && s >= c.from && s < c.to,
  );
