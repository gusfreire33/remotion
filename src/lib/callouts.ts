/**
 * MAPA DE EVENTOS — "VSLL Wonne V4.mp4" (One Digital / sistema RADAR).
 * Editado no estilo da referência "Bilhon-OS Motor de Receita Permanente"
 * (analisada em 04/09/2026): VSL horizontal, texto grande sobre/atrás da
 * pessoa em typewriter caótico, cartões full-screen com fagulhas, trilha de
 * tensão e booms graves nas entradas.
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * Se o teu faturamento depende de indicação, é uma loteria com CNPJ. A One
 * Digital entrega um SISTEMA (RADAR, 5 etapas) + 7 frentes debaixo do mesmo
 * teto + OneMax, com métrica em cada etapa — e pede auditoria, não confiança.
 * CTA: clicar no botão e agendar um diagnóstico gratuito.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook          0,0–8,4s     "tirasse a indicação… quantos clientes?"
 *   promessa      8,4–22,0s    loteria com CNPJ → máquina de clientes
 *   apresentação  22,0–35,8s   Gustavo Freire / One Digital / demanda previsível
 *   DOR           35,8–72,2s   agência+social+editor+programador; gerente de
 *                              freelancer; lead não chega; boca a boca para
 *   solução       72,2–147s    7 frentes · RADAR (R·A·D·A·R) · o que significa
 *   7 frentes     147–172s     a lista + funil + vazamento fechado
 *   OneMax        172–192s     a plataforma
 *   confiança     192–239s     solução / gente / parceria → auditoria
 *   CTA           239–270s     diagnóstico gratuito · clique agora
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * 69 eventos em 270s = 1 a cada ~3,9s (a referência: ~1 a cada 4–6s, mais
 * 8 cartões). Tratamentos alternados: OVER (texto sobre a pessoa, nos
 * cantos) ↔ BEHIND (texto atrás, cruzando a cabeça) ↔ CARD (a pessoa some)
 * ↔ CHIPS (lista acumulando). Nenhum BEHIND cai dentro de um CARD.
 *
 * Cada evento tem o trecho da fala em comentário. Os `at` das linhas são o
 * timestamp da PALAVRA em `words.ts` — o texto entra junto com a boca.
 */

export type Voice = "sans" | "mono";

export type Line = {
  text: string;
  voice: Voice;
  /** segundo absoluto em que a linha começa a ser escrita (default: `from`) */
  at?: number;
  /** índices (0-based) das palavras em laranja */
  accent?: number[];
  /** linha inteira em laranja */
  orange?: boolean;
  size?: number;
};

export type Slot = "tl" | "tr" | "top" | "chest";

export type Callout =
  | {
      kind: "over";
      from: number;
      to: number;
      slot: Slot;
      lines: Line[];
    }
  | {
      kind: "behind";
      from: number;
      to: number;
      lines: Line[];
      /** topo do bloco (px, tela 1080) — MEDIDO no matte (Etapa 6.4) */
      top?: number;
    }
  | {
      kind: "card";
      from: number;
      to: number;
      lines: Line[];
      frame?: boolean;
      /** chips dentro do cartão (OneMax) */
      chips?: { text: string; at: number; orange?: boolean }[];
      /** notas de dinheiro caindo a partir deste segundo */
      moneyAt?: number;
      width?: number;
    }
  | {
      kind: "chips";
      from: number;
      to: number;
      slot: "bottom" | "top";
      items: { text: string; at: number; orange?: boolean; muted?: boolean }[];
      /** linha de fechamento (mono laranja) abaixo dos chips */
      tail?: Line;
    }
  | {
      kind: "steps";
      from: number;
      to: number;
      items: { mark: string; text: string; at: number }[];
    };

export const CALLOUTS: Callout[] = [
  /* ═══════════════════════ HOOK ═══════════════════════ */

  // 0,84 "fazer uma pergunta direta"
  {
    kind: "over",
    from: 0.6,
    to: 2.1,
    slot: "top",
    lines: [
      { text: "uma pergunta", voice: "sans", at: 0.84 },
      { text: "DIRETA", voice: "mono", at: 1.43, orange: true },
    ],
  },

  // 2,29 "se você tirasse a INDICAÇÃO do seu negócio hoje"  ★ atrás
  {
    kind: "behind",
    from: 2.2,
    to: 4.8,
    lines: [
      { text: "se você tirasse a", voice: "sans", at: 2.29 },
      { text: "INDICAÇÃO", voice: "mono", at: 2.73, orange: true },
    ],
  },

  // 4,92 "quantos clientes entrariam amanhã?"
  {
    kind: "over",
    from: 4.85,
    to: 6.85,
    slot: "chest",
    lines: [
      { text: "quantos clientes", voice: "sans", at: 4.92 },
      { text: "ENTRARIAM AMANHÃ?", voice: "mono", at: 5.78 },
    ],
  },

  // 6,92 "Pensa nisso, sério."  → cartão sem moldura (a pessoa some)
  {
    kind: "card",
    from: 6.9,
    to: 8.4,
    frame: false,
    lines: [
      { text: "pensa nisso,", voice: "sans", at: 6.92 },
      { text: "SÉRIO.", voice: "mono", at: 7.86, orange: true, size: 110 },
    ],
  },

  /* ═══════════════════════ PROMESSA ═══════════════════════ */

  // 8,55 "se a resposta te deixou DESCONFORTÁVEL"
  {
    kind: "over",
    from: 8.5,
    to: 10.6,
    slot: "tr",
    lines: [
      { text: "se a resposta te deixou", voice: "sans", at: 8.55 },
      { text: "DESCONFORTÁVEL", voice: "mono", at: 9.6, orange: true },
    ],
  },

  // 11,04 "fica comigo nos próximos cinco minutos"
  {
    kind: "over",
    from: 11.0,
    to: 13.2,
    slot: "tl",
    lines: [
      { text: "fica comigo", voice: "sans", at: 11.04 },
      { text: "5 MINUTOS", voice: "mono", at: 12.3 },
    ],
  },

  // 14,37 "transformar exatamente o teu FATURAMENTO"  ★ atrás
  {
    kind: "behind",
    from: 14.3,
    to: 16.7,
    lines: [
      { text: "transformar o teu", voice: "sans", at: 14.37 },
      { text: "FATURAMENTO", voice: "mono", at: 15.87 },
    ],
  },

  // 17,22 "de uma loteria com CNPJ para uma máquina de clientes qualificados,
  // chegando toda semana"  → cartão + dinheiro caindo (como a referência)
  {
    kind: "card",
    from: 17.1,
    to: 21.95,
    frame: true,
    moneyAt: 18.84,
    lines: [
      { text: "de uma loteria com CNPJ", voice: "sans", at: 17.22, accent: [2, 4] },
      { text: "PARA UMA MÁQUINA DE CLIENTES", voice: "mono", at: 18.84, accent: [2] },
      { text: "chegando toda semana", voice: "sans", at: 20.66 },
    ],
  },

  /* ═══════════════════════ APRESENTAÇÃO ═══════════════════════ */

  // 22,59 "Meu nome é Gustavo Freire e eu estou aqui da One Digital"
  {
    kind: "over",
    from: 22.5,
    to: 25.0,
    slot: "tl",
    lines: [
      { text: "Gustavo Freire", voice: "sans", at: 22.59 },
      { text: "ONE DIGITAL", voice: "mono", at: 24.22, orange: true },
    ],
  },

  // 25,77 "aqui a gente não vende milagre"
  {
    kind: "over",
    from: 25.3,
    to: 26.85,
    slot: "chest",
    lines: [
      { text: "aqui a gente", voice: "sans", at: 25.36 },
      { text: "NÃO VENDE MILAGRE", voice: "mono", at: 25.77 },
    ],
  },

  // 27,57 "constrói DEMANDA PREVISÍVEL"  ★ atrás
  {
    kind: "behind",
    from: 27.5,
    to: 30.8,
    lines: [
      { text: "aqui a gente constrói", voice: "sans", at: 27.57 },
      { text: "DEMANDA PREVISÍVEL", voice: "mono", at: 28.17, orange: true },
    ],
  },

  // 32,04 "quanto custa cada cliente antes de investir mais um real"
  {
    kind: "over",
    from: 31.9,
    to: 35.7,
    slot: "tr",
    lines: [
      { text: "quanto custa cada cliente", voice: "sans", at: 32.04 },
      { text: "ANTES DE INVESTIR", voice: "mono", at: 33.83 },
    ],
  },

  /* ═══════════════════════ DOR ═══════════════════════ */

  // 35,82 "você já passou por isso, não é?"
  {
    kind: "over",
    from: 35.8,
    to: 37.45,
    slot: "top",
    lines: [
      { text: "você já passou por isso,", voice: "sans", at: 35.82 },
      { text: "NÃO É?", voice: "mono", at: 37.02, orange: true },
    ],
  },

  // 37,81 "contrata agência, social media, editor, programador — e nenhum
  // deles se fala"  → chips acumulando + fechamento
  {
    kind: "chips",
    from: 37.8,
    to: 45.9,
    slot: "bottom",
    items: [
      { text: "agência de tráfego", at: 38.44 },
      { text: "social media", at: 40.39 },
      { text: "editor", at: 41.92 },
      { text: "programador", at: 43.11 },
    ],
    tail: { text: "E NENHUM DELES SE FALA", voice: "mono", at: 43.99, orange: true },
  },

  // 46,68 "virando GERENTE DE FREELANCER"  ★ atrás
  {
    kind: "behind",
    from: 46.6,
    to: 49.9,
    lines: [
      { text: "você acaba virando", voice: "sans", at: 46.32 },
      { text: "GERENTE DE FREELANCER", voice: "mono", at: 47.19 },
    ],
  },

  // 50,14 "ou o lead não chega, ou chega desqualificado, ou ninguém sabe o
  // que fazer com ele"
  {
    kind: "chips",
    from: 50.1,
    to: 56.8,
    slot: "bottom",
    items: [
      { text: "o lead não chega", at: 50.5 },
      { text: "chega desqualificado", at: 51.85 },
      { text: "ninguém sabe o que fazer", at: 53.94 },
    ],
  },

  // 57,06 "quando o boca a boca para, o faturamento para junto"  → cartão
  {
    kind: "card",
    from: 56.95,
    to: 61.55,
    frame: true,
    lines: [
      { text: "quando o boca a boca para,", voice: "sans", at: 57.73 },
      { text: "O FATURAMENTO PARA JUNTO", voice: "mono", at: 59.61, orange: true },
    ],
  },

  // 62,03 "isso não é negócio, isso é APOSTA"
  {
    kind: "over",
    from: 61.9,
    to: 64.5,
    slot: "chest",
    lines: [
      { text: "isso não é negócio,", voice: "sans", at: 62.03 },
      { text: "ISSO É APOSTA", voice: "mono", at: 63.17, orange: true },
    ],
  },

  // 66,13 "donos de negócio sério NÃO APOSTAM"  ★ atrás
  {
    kind: "behind",
    from: 66.05,
    to: 68.85,
    lines: [
      { text: "donos de negócio sério", voice: "sans", at: 66.13 },
      { text: "NÃO APOSTAM", voice: "mono", at: 67.77 },
    ],
  },

  // 68,92 "eles têm um SISTEMA"
  {
    kind: "over",
    from: 68.9,
    to: 70.6,
    slot: "tr",
    lines: [
      { text: "eles têm um", voice: "sans", at: 68.92 },
      { text: "SISTEMA", voice: "mono", at: 69.76, orange: true },
    ],
  },

  // 70,66 "o problema não é você"
  {
    kind: "over",
    from: 70.6,
    to: 72.15,
    slot: "tl",
    lines: [
      { text: "o problema", voice: "sans", at: 70.66 },
      { text: "NÃO É VOCÊ", voice: "mono", at: 71.26 },
    ],
  },

  // 72,87 "ninguém te entregou as 7 frentes de crescimento debaixo do mesmo
  // teto, com um único responsável"  → cartão
  {
    kind: "card",
    from: 72.8,
    to: 80.25,
    frame: true,
    lines: [
      { text: "ninguém te entregou as", voice: "sans", at: 73.31 },
      { text: "7 FRENTES DE CRESCIMENTO", voice: "mono", at: 74.71, orange: true },
      { text: "debaixo do mesmo teto, com um único responsável", voice: "sans", at: 76.62, accent: [7, 8] },
    ],
  },

  /* ═══════════════════════ RADAR ═══════════════════════ */

  // 80,39 "a One Digital criou o SISTEMA RADAR"  ★ atrás
  {
    kind: "behind",
    from: 80.3,
    to: 82.6,
    lines: [
      { text: "a One Digital criou o", voice: "sans", at: 80.39 },
      { text: "SISTEMA RADAR", voice: "mono", at: 81.53, orange: true },
    ],
  },

  // 82,66 "cinco etapas que transformam a forma como você atrai clientes"
  {
    kind: "over",
    from: 82.6,
    to: 86.75,
    slot: "top",
    lines: [
      { text: "cinco etapas que transformam", voice: "sans", at: 82.66 },
      { text: "COMO VOCÊ ATRAI CLIENTES", voice: "mono", at: 84.65 },
    ],
  },

  // 86,85 → 132,4  R · A · D · A · R  — a lista acumula embaixo enquanto ele
  // explica cada letra (lista com estado)
  {
    kind: "steps",
    from: 86.8,
    to: 132.4,
    items: [
      { mark: "R", text: "rastreamento", at: 86.85 },
      { mark: "A", text: "atração", at: 95.6 },
      { mark: "D", text: "depuração", at: 106.7 },
      { mark: "A", text: "aquecimento", at: 117.06 },
      { mark: "R", text: "recorrência", at: 126.82 },
    ],
  },

  // 88,82 "a gente mapeia onde teu cliente ideal está"
  {
    kind: "over",
    from: 88.75,
    to: 93.3,
    slot: "tl",
    lines: [
      { text: "a gente mapeia", voice: "sans", at: 88.82 },
      { text: "ONDE TEU CLIENTE ESTÁ", voice: "mono", at: 89.3 },
    ],
  },

  // 93,52 "nada de impulsionar post no escuro"
  {
    kind: "over",
    from: 93.5,
    to: 95.5,
    slot: "tr",
    lines: [
      { text: "nada de impulsionar", voice: "sans", at: 93.52 },
      { text: "POST NO ESCURO", voice: "mono", at: 94.62, orange: true },
    ],
  },

  // 97,02 "campanhas com ofertas certas para o estágio certo"
  {
    kind: "over",
    from: 97.0,
    to: 100.8,
    slot: "tl",
    lines: [
      { text: "ofertas certas para o", voice: "sans", at: 97.76 },
      { text: "ESTÁGIO CERTO", voice: "mono", at: 99.49 },
    ],
  },

  // 103,96 "seu dinheiro para de pagar curioso"
  {
    kind: "over",
    from: 103.9,
    to: 106.6,
    slot: "tr",
    lines: [
      { text: "seu dinheiro para de", voice: "sans", at: 103.96 },
      { text: "PAGAR CURIOSO", voice: "mono", at: 105.4, orange: true },
    ],
  },

  // 108,5 "filtros de qualificação separam quem quer comprar"
  {
    kind: "over",
    from: 108.45,
    to: 113.5,
    slot: "tl",
    lines: [
      { text: "filtros de qualificação", voice: "sans", at: 108.5 },
      { text: "QUEM QUER COMPRAR", voice: "mono", at: 110.79 },
    ],
  },

  // 113,67 "sua equipe fala apenas com leads prontos"
  {
    kind: "over",
    from: 113.6,
    to: 117.0,
    slot: "tr",
    lines: [
      { text: "sua equipe fala apenas com", voice: "sans", at: 113.67 },
      { text: "LEADS PRONTOS", voice: "mono", at: 115.62, orange: true },
    ],
  },

  // 120,56 "sequência de remarketing que trabalha a decisão por você"
  {
    kind: "over",
    from: 120.4,
    to: 124.2,
    slot: "tl",
    lines: [
      { text: "sequência de remarketing", voice: "sans", at: 120.56 },
      { text: "TRABALHA A DECISÃO", voice: "mono", at: 122.24 },
    ],
  },

  // 124,26 "enquanto você cuida do seu negócio"
  {
    kind: "over",
    from: 124.2,
    to: 126.75,
    slot: "tr",
    lines: [
      { text: "enquanto você", voice: "sans", at: 124.26 },
      { text: "CUIDA DO SEU NEGÓCIO", voice: "mono", at: 125.23 },
    ],
  },

  // 128,5 "o sistema roda todos os dias"
  {
    kind: "over",
    from: 128.45,
    to: 132.4,
    slot: "tl",
    lines: [
      { text: "o sistema roda", voice: "sans", at: 128.58 },
      { text: "TODOS OS DIAS", voice: "mono", at: 129.49, orange: true },
    ],
  },

  // 132,59 "a demanda vira sua principal LINHA DE PRODUÇÃO"  ★ atrás
  {
    kind: "behind",
    from: 132.5,
    to: 137.3,
    lines: [
      { text: "a demanda deixa de ser evento e vira", voice: "sans", at: 132.59 },
      { text: "LINHA DE PRODUÇÃO", voice: "mono", at: 135.95, orange: true },
    ],
  },

  // 137,43 "e sabe o que isso significa?"
  {
    kind: "over",
    from: 137.4,
    to: 139.1,
    slot: "top",
    lines: [
      { text: "e sabe o que isso", voice: "sans", at: 137.43 },
      { text: "SIGNIFICA?", voice: "mono", at: 138.27 },
    ],
  },

  // 139,61 "você sabe quantos leads entram, quanto custa cada um e quanto
  // custa um cliente. Antes até de colocar mais um real."  → cartão
  {
    kind: "card",
    from: 139.5,
    to: 146.9,
    frame: true,
    width: 1240,
    lines: [
      { text: "você sabe", voice: "sans", at: 139.61 },
      { text: "QUANTOS LEADS ENTRAM", voice: "mono", at: 139.81, size: 60 },
      { text: "QUANTO CUSTA CADA UM", voice: "mono", at: 141.26, size: 60 },
      { text: "QUANTO CUSTA UM CLIENTE", voice: "mono", at: 142.55, size: 60, orange: true },
      { text: "antes até de colocar mais um real", voice: "sans", at: 144.42 },
    ],
  },

  // 147,03 "e não para no tráfego"
  {
    kind: "over",
    from: 147.0,
    to: 148.5,
    slot: "chest",
    lines: [
      { text: "e não para", voice: "sans", at: 147.03 },
      { text: "NO TRÁFEGO", voice: "mono", at: 147.61 },
    ],
  },

  /* ═══════════════════════ 7 FRENTES ═══════════════════════ */

  // 149,87 "7 FRENTES debaixo do mesmo teto"  ★ atrás
  {
    kind: "behind",
    from: 149.8,
    to: 152.05,
    lines: [
      { text: "7 FRENTES", voice: "mono", at: 149.87, orange: true },
      { text: "debaixo do mesmo teto", voice: "sans", at: 150.66 },
    ],
  },

  // 152,12 a lista das sete frentes — chips acumulando (2 fileiras)
  {
    kind: "chips",
    from: 152.05,
    to: 162.7,
    slot: "bottom",
    items: [
      { text: "tráfego pago", at: 152.12 },
      { text: "social media", at: 153.28 },
      { text: "captação de conteúdo", at: 154.17 },
      { text: "automação WhatsApp + Instagram", at: 155.52 },
      { text: "criação de páginas", at: 157.63 },
      { text: "software sob demanda", at: 158.92 },
      { text: "o amarrador de tudo", at: 160.86, orange: true },
    ],
  },

  // 162,88 "a estruturação do teu FUNIL DE VENDAS"
  {
    kind: "over",
    from: 162.8,
    to: 165.9,
    slot: "tl",
    lines: [
      { text: "a estruturação do teu", voice: "sans", at: 162.88 },
      { text: "FUNIL DE VENDAS", voice: "mono", at: 164.52, orange: true },
    ],
  },

  // 166,24 "cada frente conversa com a outra"
  {
    kind: "over",
    from: 166.2,
    to: 168.0,
    slot: "tr",
    lines: [
      { text: "cada frente", voice: "sans", at: 166.24 },
      { text: "CONVERSA COM A OUTRA", voice: "mono", at: 166.7 },
    ],
  },

  // 168,49 "cada etapa é medida e cada VAZAMENTO É FECHADO"  ★ atrás
  {
    kind: "behind",
    from: 168.4,
    to: 172.2,
    lines: [
      { text: "cada etapa é medida e", voice: "sans", at: 168.49 },
      { text: "CADA VAZAMENTO É FECHADO", voice: "mono", at: 170.07, orange: true },
    ],
  },

  /* ═══════════════════════ ONEMAX ═══════════════════════ */

  // 173,12 "e ainda tem o OneMax, a plataforma All-in-One, onde você constrói
  // páginas, funil, CRM, automação em quatro canais, área de membros e ainda
  // acompanha tudo em um único dashboard"  → cartão com chips
  {
    kind: "card",
    from: 172.9,
    to: 184.8,
    frame: true,
    width: 1300,
    lines: [
      { text: "e ainda tem o", voice: "sans", at: 172.78 },
      { text: "ONEMAX", voice: "mono", at: 173.12, orange: true, size: 104 },
      { text: "a plataforma All-in-One", voice: "sans", at: 173.95 },
    ],
    chips: [
      { text: "páginas", at: 177.07 },
      { text: "funil", at: 177.88 },
      { text: "CRM", at: 178.33 },
      { text: "automação em 4 canais", at: 178.76 },
      { text: "área de membros", at: 180.69 },
      { text: "um único dashboard", at: 183.52, orange: true },
    ],
  },

  // 184,86 "sem pagar taxa sobre suas vendas"
  {
    kind: "over",
    from: 184.8,
    to: 186.9,
    slot: "chest",
    lines: [
      { text: "sem pagar", voice: "sans", at: 184.86 },
      { text: "TAXA SOBRE SUAS VENDAS", voice: "mono", at: 185.47 },
    ],
  },

  // 187,44 "você não contrata ferramenta. Você CONTRATA RESULTADO"  ★ atrás
  {
    kind: "behind",
    from: 187.35,
    to: 192.5,
    lines: [
      { text: "você não contrata ferramenta,", voice: "sans", at: 187.44 },
      { text: "CONTRATA RESULTADO", voice: "mono", at: 189.28, orange: true },
    ],
  },

  /* ═══════════════════════ CONFIANÇA ═══════════════════════ */

  // 192,95 "agora vamos falar de CONFIANÇA"
  {
    kind: "over",
    from: 192.9,
    to: 194.4,
    slot: "top",
    lines: [
      { text: "agora vamos falar de", voice: "sans", at: 192.95 },
      { text: "CONFIANÇA", voice: "mono", at: 193.79, orange: true },
    ],
  },

  // 194,94 "decisão de negócio é decisão de risco"
  {
    kind: "over",
    from: 194.9,
    to: 197.45,
    slot: "chest",
    lines: [
      { text: "decisão de negócio é", voice: "sans", at: 194.94 },
      { text: "DECISÃO DE RISCO", voice: "mono", at: 196.33 },
    ],
  },

  // 197,56 → 221,9  primeiro / segundo / terceiro — a lista das 3 confianças
  {
    kind: "steps",
    from: 197.5,
    to: 221.9,
    items: [
      { mark: "1", text: "confiança na solução", at: 197.56 },
      { mark: "2", text: "confiança na gente", at: 207.12 },
      { mark: "3", text: "confiança na parceria", at: 217.66 },
    ],
  },

  // 199,72 "o radar já foi aplicado em segmentos completamente diferentes"
  {
    kind: "over",
    from: 199.7,
    to: 204.1,
    slot: "tl",
    lines: [
      { text: "o radar já foi aplicado em", voice: "sans", at: 199.72 },
      { text: "SEGMENTOS DIFERENTES", voice: "mono", at: 201.82 },
    ],
  },

  // 204,28 "o sistema é o mesmo, mas a estratégia é sua"
  {
    kind: "over",
    from: 204.2,
    to: 207.0,
    slot: "tr",
    lines: [
      { text: "o sistema é o mesmo,", voice: "sans", at: 204.28 },
      { text: "A ESTRATÉGIA É SUA", voice: "mono", at: 205.62, orange: true },
    ],
  },

  // 209,28 "por trás disso tem um time de peso"
  {
    kind: "over",
    from: 209.2,
    to: 211.1,
    slot: "tl",
    lines: [
      { text: "por trás disso tem", voice: "sans", at: 209.28 },
      { text: "UM TIME DE PESO", voice: "mono", at: 210.26 },
    ],
  },

  // 211,2 "estrategista, head de tráfego, head de tecnologia" — chips no TOPO
  // (a lista das 3 confianças está embaixo)
  {
    kind: "chips",
    from: 211.15,
    to: 217.5,
    slot: "top",
    items: [
      { text: "estrategista", at: 211.2 },
      { text: "head de tráfego", at: 212.3 },
      { text: "head de tecnologia", at: 213.41 },
    ],
  },

  // 220,32 "a gente não esconde número"
  {
    kind: "over",
    from: 220.25,
    to: 221.9,
    slot: "tr",
    lines: [
      { text: "a gente não", voice: "sans", at: 220.32 },
      { text: "ESCONDE NÚMERO", voice: "mono", at: 220.88, orange: true },
    ],
  },

  // 222,41 "acesso às métricas em tempo real desde o primeiro dia"
  {
    kind: "over",
    from: 222.35,
    to: 225.6,
    slot: "tl",
    lines: [
      { text: "acesso às métricas em", voice: "sans", at: 222.41 },
      { text: "TEMPO REAL", voice: "mono", at: 223.64 },
    ],
  },

  // 225,86 "a nossa parceria se sustenta POR RESULTADO"  ★ atrás
  {
    kind: "behind",
    from: 225.8,
    to: 228.9,
    lines: [
      { text: "a nossa parceria se sustenta", voice: "sans", at: 225.86 },
      { text: "POR RESULTADO", voice: "mono", at: 227.86, orange: true },
    ],
  },

  // 229,0 "não por contrato longo com multa"
  {
    kind: "over",
    from: 228.95,
    to: 231.0,
    slot: "chest",
    lines: [
      { text: "não por", voice: "sans", at: 229.0 },
      { text: "CONTRATO LONGO COM MULTA", voice: "mono", at: 229.43 },
    ],
  },

  // 231,24 "se você já foi queimado por agências antes"
  {
    kind: "over",
    from: 231.2,
    to: 234.7,
    slot: "tl",
    lines: [
      { text: "se você já foi", voice: "sans", at: 231.24 },
      { text: "QUEIMADO POR AGÊNCIAS", voice: "mono", at: 232.0 },
    ],
  },

  // 235,0 "a gente não pede confiança. A gente pede AUDITORIA."  → cartão
  {
    kind: "card",
    from: 234.85,
    to: 238.95,
    frame: true,
    lines: [
      { text: "a gente não pede confiança.", voice: "sans", at: 235.0 },
      { text: "A GENTE PEDE AUDITORIA", voice: "mono", at: 236.96, orange: true },
    ],
  },

  /* ═══════════════════════ CTA ═══════════════════════ */

  // 239,07 "o próximo passo é bem simples"
  {
    kind: "over",
    from: 239.0,
    to: 241.1,
    slot: "top",
    lines: [
      { text: "o próximo passo é", voice: "sans", at: 239.07 },
      { text: "BEM SIMPLES", voice: "mono", at: 240.19 },
    ],
  },

  // 241,42 "não é comprar nada. Não é assinar contrato." — chips apagados
  {
    kind: "chips",
    from: 241.35,
    to: 243.7,
    slot: "bottom",
    items: [
      { text: "não é comprar nada", at: 241.42, muted: true },
      { text: "não é assinar contrato", at: 242.57, muted: true },
    ],
  },

  // 244,13 "clicar no botão aqui embaixo e agendar um DIAGNÓSTICO GRATUITO"  ★ atrás
  {
    kind: "behind",
    from: 244.05,
    to: 248.0,
    lines: [
      { text: "clicar no botão aqui embaixo e agendar um", voice: "sans", at: 244.13 },
      { text: "DIAGNÓSTICO GRATUITO", voice: "mono", at: 246.63, orange: true },
    ],
  },

  // 249,88 "entender onde está o gargalo"
  {
    kind: "over",
    from: 249.8,
    to: 251.9,
    slot: "tl",
    lines: [
      { text: "entender onde está", voice: "sans", at: 249.88 },
      { text: "O GARGALO", voice: "mono", at: 250.96 },
    ],
  },

  // 252,19 "sem compromisso e sem proposta empurrada"
  {
    kind: "over",
    from: 252.1,
    to: 254.5,
    slot: "tr",
    lines: [
      { text: "sem compromisso e", voice: "sans", at: 252.19 },
      { text: "SEM PROPOSTA EMPURRADA", voice: "mono", at: 253.41 },
    ],
  },

  // 256,1 "demanda previsível e qualificada de clientes TODO SANTO DIA"  → cartão
  {
    kind: "card",
    from: 255.95,
    to: 260.15,
    frame: true,
    lines: [
      { text: "demanda previsível e qualificada", voice: "sans", at: 256.1 },
      { text: "TODO SANTO DIA", voice: "mono", at: 258.95, orange: true },
    ],
  },

  // 260,48 "sem depender de indicação, sem aposta e sem virar gerente de freelancer"
  {
    kind: "chips",
    from: 260.4,
    to: 265.3,
    slot: "bottom",
    items: [
      { text: "sem depender de indicação", at: 260.48, muted: true },
      { text: "sem aposta", at: 262.24, muted: true },
      { text: "sem virar gerente de freelancer", at: 263.44, muted: true },
    ],
  },

  // 265,42 "CLIQUE AGORA"  ★ atrás
  {
    kind: "behind",
    from: 265.38,
    to: 266.25,
    lines: [{ text: "CLIQUE AGORA", voice: "mono", at: 265.42, orange: true }],
  },

  // 266,36 "o diagnóstico é gratuito, mas a inércia tem custo"  → cartão final
  {
    kind: "card",
    from: 266.28,
    to: 270.1,
    frame: true,
    lines: [
      { text: "o diagnóstico é gratuito,", voice: "sans", at: 266.36 },
      { text: "MAS A INÉRCIA TEM CUSTO.", voice: "mono", at: 268.0, orange: true },
    ],
  },
];

/** socos de zoom: nas palavras-atrás e na entrada dos cartões */
export const PUNCHES_S: number[] = CALLOUTS.filter(
  (c) => c.kind === "behind" || c.kind === "card",
).map((c) => c.from);

/** true se o segundo cai dentro de um cartão full-screen (a pessoa some) */
export const isCardAt = (s: number): boolean =>
  CALLOUTS.some((c) => c.kind === "card" && s >= c.from && s < c.to);
