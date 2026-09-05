import type { Word } from "../data/words";

export type MillionTone = "thin" | "normal" | "bold";

const FILLERS = new Set([
  "o",
  "a",
  "os",
  "as",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "é",
  "em",
  "um",
  "uma",
  "uns",
  "umas",
  "que",
  "pra",
  "para",
  "pro",
  "com",
  "por",
  "no",
  "na",
  "nos",
  "nas",
  "se",
  "me",
  "te",
  "lhe",
  "eu",
  "tu",
  "ele",
  "ela",
  "eles",
  "elas",
  "nós",
  "vocês",
  "já",
  "só",
  "não",
  "nao",
  "tá",
  "ta",
  "tô",
  "to",
  "né",
  "aí",
  "ai",
  "então",
  "entao",
  "assim",
  "porque",
  "quando",
  "onde",
  "como",
  "mas",
  "ou",
  "também",
  "tambem",
  "muito",
  "bem",
  "ainda",
  "isso",
  "esse",
  "essa",
  "este",
  "esta",
  "isto",
  "aqui",
  "ali",
  "lá",
  "la",
  "meu",
  "minha",
  "meu",
  "sua",
  "seu",
  "teu",
  "tua",
]);

const EMPHASIS = new Set([
  "phaco",
  "phaco4all",
  "sarah",
  "insegurança",
  "inseguranca",
  "quesitos",
  "reuniões",
  "reunioes",
  "tema",
  "temas",
  "cruciais",
  "biometria",
  "cálculo",
  "calculo",
  "pré-operatório",
  "pre-operatorio",
  "paciente",
  "pacientes",
  "tecnologias",
  "indicar",
  "indico",
  "indica",
  "importante",
  "centro",
  "cirúrgico",
  "cirurgico",
  "aparelho",
  "aparelhos",
  "experiência",
  "experiencia",
  "experiente",
  "experientes",
  "feedback",
  "preceptores",
  "brasil",
  "volume",
  "lentes",
  "premium",
  "cirurgiões",
  "cirurgioes",
  "casinhos",
  "consultório",
  "consultorio",
  "whatsapp",
  "discussão",
  "discussao",
  "aprendendo",
  "lâmpada",
  "lampada",
  "queimou",
  "fellow",
  "ponta",
  "bacana",
]);

const stem = (text: string): string =>
  text.replace(/[^\wÀ-ÿ]/gu, "").toLowerCase();

export const toneOf = (w: Word): MillionTone => {
  const token = stem(w.text);
  const dur = Math.max(0, w.endMs - w.startMs);

  if (/\d/.test(w.text) || /phaco/i.test(w.text)) {
    return "bold";
  }
  if (EMPHASIS.has(token) || (token.length >= 8 && dur >= 280)) {
    return "bold";
  }
  if (dur >= 420 && token.length >= 5 && !FILLERS.has(token)) {
    return "bold";
  }

  if (dur > 0 && dur < 120) {
    return "thin";
  }
  if (dur < 160 && (FILLERS.has(token) || token.length <= 3)) {
    return "thin";
  }

  return "normal";
};

export const MILLION = {
  thin: { fontWeight: 300, fontSize: 42 },
  normal: { fontWeight: 500, fontSize: 52 },
  bold: { fontWeight: 800, fontSize: 64 },
} as const;
