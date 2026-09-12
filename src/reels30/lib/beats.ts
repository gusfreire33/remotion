/**
 * Tese: depender do boca a boca deixa o faturamento à mercê da sorte.
 * Destino: trocar essa dependência por um sistema de clientes qualificados.
 * Não há CTA na fonte; não acrescentar um pedido que o apresentador não fez.
 *
 * Espinha / cobertura completa (21,5s):
 * 0–0.68 limpo; 0.68–1.82 atrás (hook NEGÓCIOS); 1.82–3.08 limpo;
 * 3.08–4.43 overlay (contexto, boca a boca PARA); 4.43–4.74 limpo;
 * 4.74–6.50 atrás (consequência FATURAMENTO); 6.50–6.92 limpo;
 * 6.92–8.10 overlay (ressalva NÃO É NEGÓCIO); 8.10–8.82 limpo;
 * 8.82–9.92 atrás (APOSTA); 9.92–11.46 limpo;
 * 11.46–12.50 overlay (veredito NÃO APOSTAM); 12.50–13.36 limpo;
 * 13.36–14.44 atrás (virada SISTEMA); 14.44–16.10 limpo;
 * 16.10–17.90 overlay (metáfora LOTERIA COM CNPJ); 17.90–18.32 limpo;
 * 18.32–21.48 overlay (benefício, MÁQUINA entregando TODA SEMANA);
 * 21.48–21.50 limpo. 9 eventos = 1/2,39s; 4 palavras-atrás = 1/5,38s.
 * Sem B-roll: nenhum objeto é tratado literalmente nesta fala; "loteria" e
 * "máquina" são metáforas de operação, não cenas de cassino/fábrica.
 */
export const BEAT_TIMING = [
  // "quando boca a boca PARA" — verbo: interromper. Família: circuito/fluxo.
  { key: "referral", from: 3.08, to: 4.43 },
  // "E isso NÃO É NEGÓCIO" — verbo: barrar. Família: faixa/alerta (ressalva).
  { key: "warning", from: 6.92, to: 8.1 },
  // "donos de negócios sérios NÃO APOSTAM" — verbo: vetar. Família: carimbo.
  { key: "verdict", from: 11.46, to: 12.5 },
  // "de uma LOTERIA COM CNPJ" — verbo: arriscar. Família: bilhete destacável.
  { key: "lottery", from: 16.1, to: 17.9 },
  // "MÁQUINA de clientes QUALIFICADOS, chegando TODA SEMANA" — verbo:
  // transformar/entregar repetidamente. Família: mecanismo + esteira temporal.
  { key: "machine", from: 18.32, to: 21.48 },
] as const;
export type BeatKey = (typeof BEAT_TIMING)[number]["key"];

// The SAME offsets drive animation entrances and element-level sound cues.
export const ELEMENT_FRAMES = {
  referral: [0, 7, 14],
  warning: [0, 11],
  verdict: [0, 12],
  lottery: [0, 14, 37],
  machine: [0, 8, 16, 35, 65, 71, 77],
} as const;
