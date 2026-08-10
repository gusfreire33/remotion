// Timing (em segundos) de cada beat. Compartilhado entre overlays, B-roll e o
// zoom do vídeo, pra que tudo aconteça no mesmo momento da fala.
export type BeatTiming = { key: string; from: number; to: number };

/**
 * "Vídeo 18 {RE EDITADO.mp4" — CHAT GPT ADS (63,88s).
 *
 * Tese: o ChatGPT virou a nova rede de INTENÇÃO (as pessoas pesquisam soluções
 * lá, não mais no Google). O ChatGPT Ads chegou ao Brasil em acesso restrito,
 * entrega a mesma segmentação do Google Ads + filtro por tipo de busca, e é
 * mais eficiente. Ressalva: nicho de saúde não pode anunciar.
 * CTA: comentar "VAZAMENTO" pra equipe chamar no direct.
 *
 * ⚠️ EDIÇÃO ESTILO "CAPTIONS" (pedido do dono, 09/08/2026) — difere do padrão
 * do playbook em três pontos, e só nestes:
 *   1. Legenda simples: só texto branco, menor e mais alta (sem caixa amarela).
 *   2. Palavra marcante ATRÁS da pessoa (ver src/lib/behind.ts + o recorte com
 *      canal alfa em public/matte-pessoa.webm).
 *   3. Gramática de animação nova (chips, tickers, versus, radar, alerta...),
 *      nada reaproveitado dos vídeos anteriores.
 * O resto do tratamento (película, zoom dinâmico, ExitFade, sem film burn,
 * sem SFX) segue o playbook.
 */
export const BEAT_TIMING: BeatTiming[] = [
  // "...e por que você deveria começar a usar ele a partir de hoje?"
  { key: "hookTitulo", from: 1.65, to: 4.3 },
  // "Nos últimos anos, desde o início do Chat GPT"
  { key: "aiRede", from: 4.45, to: 6.5 },
  // "...uma rede de pesquisa e de busca de lado"
  { key: "googleLado", from: 8.8, to: 10.9 },
  // "A maioria das pessoas passou a..."
  { key: "maioria", from: 11.05, to: 12.45 },
  // "...dentro do próprio Chat GPT"
  { key: "pesquisaGpt", from: 14.45, to: 16.7 },
  // "Ou seja, lá se tornou uma rede de..."
  { key: "versus", from: 17.15, to: 19.25 },
  // "...muito melhor do que o Google Ads"
  { key: "intencaoAlvo", from: 21.15, to: 22.65 },
  // "Pelo simples motivo de você conseguir dar o mesmo tipo de..."
  { key: "segmentacao", from: 22.95, to: 25.75 },
  // "e além disso conseguir filtrar..."
  { key: "filtros", from: 27.1, to: 29.5 },
  // "...pelo tipo de busca do interesse"
  { key: "filtroBroll", from: 29.6, to: 31.95 },
  // "Muito similar ao Google Ads, mas de uma forma muito mais..."
  { key: "similar", from: 32.8, to: 35.75 },
  // "O Chat GPT Ads chegou recentemente aqui no Brasil"
  { key: "brasil", from: 37.35, to: 38.95 },
  // "e está disponível apenas para..."
  { key: "contas", from: 39.3, to: 40.9 },
  // "eu sugiro muito que você vá atrás e entenda como ele funciona"
  { key: "vaAtras", from: 45.3, to: 47.3 },
  // "O único problema, se você está dentro do nicho de..."
  { key: "problema", from: 47.7, to: 49.9 },
  // "você não vai conseguir anunciar"
  { key: "naoAnuncia", from: 51.9, to: 53.15 },
  // "Mas se você quer começar a anunciar no Chat GPT Ads"
  { key: "querAnunciar", from: 53.5, to: 55.8 },
  // "...mas sente que está muito perdido"
  { key: "perdidoBroll", from: 55.9, to: 58.1 },
  // "fica tranquilo e..."
  { key: "tranquilo", from: 58.2, to: 59.2 },
  // "...aqui abaixo que a minha equipe vai entrar em contato contigo no direct"
  { key: "cta", from: 61.1, to: 63.8 },
];

// DECISÃO DO DONO (27/07/2026, mantida): o vídeo NÃO leva film burn nem
// efeitos sonoros. Toda virada é corte + crossfade (ExitFade), e o único
// áudio é a voz do vídeo original.

// Socos de zoom nas palavras marcantes que aparecem ATRÁS da pessoa — são os
// momentos "limpos" (sem overlay/B-roll), então é ali que o vídeo respira.
export const EXTRA_PUNCHES_S: number[] = [
  0.15, // "CHAT GPT ADS" (hook)
  7.26, // "GOOGLE"
  12.61, // "PESQUISAR"
  19.49, // "INTENÇÃO"
  25.98, // "SEGMENTAÇÃO"
  36.09, // "EFICIENTE"
  40.96, // "POUCAS CONTAS"
  43.77, // "SORTEADAS"
  50.48, // "SAÚDE"
  59.33, // "VAZAMENTO"
];
