// Timing (em segundos) de cada beat. Compartilhado entre overlays, B-roll e o
// zoom do vídeo, pra que tudo aconteça no mesmo momento da fala.
export type BeatTiming = { key: string; from: number; to: number };

/**
 * "Vídeo 29 PRE EDITADO.mp4" — OS TRÊS 10 DA VENDA / CONFIANÇA
 * (33,58s; fala 0,00–33,25s). Editado com o FRAMEWORK 2 (`PLAYBOOK-2.md`,
 * estilo "Captions").
 *
 * ── ETAPA 5.1 · TESE ──────────────────────────────────────────────────────
 * Se o produto não vende, o erro está em um dos três "10" da venda: a
 * confiança no produto, em você, ou na empresa. Esses furos ficam abertos
 * no script. O ajuste é simples — melhorar como se comunica essas ideias.
 * CTA: comentar "vazamento" pra achar esses erros na operação.
 *
 * ── ETAPA 5.2 · ESPINHA ───────────────────────────────────────────────────
 *   hook        0,00–4,42s    "não está conseguindo vender… um dos três 10"
 *   pergunta    4,58–5,83s    "o que são esses três 10?"
 *   argumento   6,00–13,68s   confiança no produto / em você / na empresa
 *   RESSALVA    13,94–21,25s  "deixando em aberto… no script de venda"
 *   solução     21,48–27,72s  "ajustes simples: melhorar a comunicação"
 *   CTA         27,99–33,25s  "encontre erros… comenta vazamento"
 *
 * ── ETAPA 5.4 · DENSIDADE ─────────────────────────────────────────────────
 * 13 eventos (8 beats — 6 overlays + 2 B-roll — e 5 palavras-atrás) em
 * 33,25s de fala = 1 a cada ~2,56s.
 *
 * Vídeo curto e encadeado: o ritmo fica um pouco mais largo que os 2,1s
 * do referência, mas as regras de ritmo NÃO se afrouxaram:
 *   · nenhum trecho limpo passa de 3s (o vão mais longo é 14,15–15,41 =
 *     1,26s);
 *   · nenhum tratamento se repete COLADO — a alternância
 *     OVERLAY ↔ ATRÁS ↔ B-ROLL guia o mapa inteiro;
 *   · nenhuma palavra-atrás cai dentro de B-roll full-bleed. Os fulls são
 *     `scriptVenda` (20,34–22,20s) e `transmiteIdeias` (26,50–28,10s).
 *
 * ── ETAPA 9 · AS FAMÍLIAS ─────────────────────────────────────────────────
 * 6 overlays, 6 famílias, cada uma uma vez:
 *   contadores / barras · naoVende (a barra de VENDAS TRAVA no zero)
 *   fileira de unidades · tres10 (três notas 10 ACENDEM)
 *   lista com estado    · tresConfiancas (produto → você → empresa)
 *   faixa / alerta      · emAberto (o furo no script)  ★ RESSALVA
 *   medida crescente    · comunicacao (a comunicação SOBE)
 *   campo de entrada    · encontrarErros (a busca ACHA os erros)
 *
 * ⚠️ Nada aqui veio de vídeo anterior. O CTA é o MESMO texto falado
 * ("comenta vazamento") dos vídeos 25–27. Lá foram notificação de DM,
 * esteira de avatares e campo de Direct. Aqui a palavra VAZAMENTO vai
 * ATRÁS da pessoa e o overlay anterior é um CAMPO DE BUSCA vasculhando
 * a operação — porque a frase deste vídeo é "encontre erros na tua
 * operação", não "minha equipe vai te chamar no Direct".
 *
 * Cada beat tem o VERBO da frase escrito no comentário (Etapa 9.1).
 */
export const BEAT_TIMING: BeatTiming[] = [
  // "não está conseguindo vender seu produto"
  // verbo: TRAVAR / NÃO SAIR → contadores / barras
  { key: "naoVende", from: 0.55, to: 2.3 },

  // "o que são esses três 10?"
  // verbo: REVELAR TRÊS NOTAS MÁXIMAS → fileira de unidades
  { key: "tres10", from: 5.22, to: 6.85 },

  // "a confiança no produto, em você, na empresa"
  // verbo: MARCAR OS TRÊS PILARES → lista com estado
  { key: "tresConfiancas", from: 8.7, to: 14.15 },

  // "deixando em aberto algum desses três pontos lá no seu script de venda"
  // verbo: VAZAR / DEIXAR ABERTO → faixa / alerta   ★ A RESSALVA
  { key: "emAberto", from: 17.28, to: 20.15 },

  // "lá no seu script de venda"
  // verbo: MOSTRAR o script acontecendo → B-roll (full-bleed)
  { key: "scriptVenda", from: 20.34, to: 22.2 },

  // "Basta você melhorar a sua comunicação"
  // verbo: A COMUNICAÇÃO SUBIR → medida crescente
  { key: "comunicacao", from: 24.2, to: 26.3 },

  // "ou como você transmite essas ideias"
  // verbo: MOSTRAR alguém transmitindo uma ideia → B-roll (full-bleed)
  { key: "transmiteIdeias", from: 26.5, to: 28.1 },

  // "a gente encontre erros tipo esse na tua operação"
  // verbo: VASCULHAR / ACHAR OS ERROS → campo de entrada
  { key: "encontrarErros", from: 29.29, to: 31.5 },
];

/**
 * Socos de zoom — Framework 2: caem EXATAMENTE nas palavras-atrás (são os
 * momentos limpos, sem overlay nem B-roll).
 */
export const EXTRA_PUNCHES_S: number[] = [
  3.62, // 10
  6.99, // CONFIANÇA
  15.41, // VENDER
  22.48, // AJUSTES
  32.04, // VAZAMENTO
];
