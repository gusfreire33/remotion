// Timing (em segundos) de cada beat de motion design.
// Compartilhado entre os overlays (animacoes + pelicula) e o zoom do video,
// pra que tudo aconteca exatamente nos mesmos momentos da fala.
export type BeatTiming = { key: string; from: number; to: number };

export const BEAT_TIMING: BeatTiming[] = [
  { key: "milagre", from: 6.4, to: 11.4 },
  { key: "potencializador", from: 13.4, to: 17.4 },
  { key: "checklist", from: 27.3, to: 35.4 },
  { key: "promessas", from: 37.0, to: 43.0 },
  { key: "mensagens", from: 52.5, to: 58.6 },
  { key: "arrumarCasa", from: 75.8, to: 81.6 },
  { key: "cta", from: 95.4, to: 101.0 },
  { key: "linkBio", from: 104.6, to: 107.2 },
];

// Pontos de enfase extra (fins de frase) pra dar mais "soco" de zoom
// fora dos beats, deixando o video mais dinamico do comeco ao fim.
export const EXTRA_PUNCHES_S: number[] = [21.6, 45.5, 67.4, 84.5, 100.8];
