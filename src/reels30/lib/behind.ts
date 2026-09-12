import type { BehindWord } from "../../lib/behind";

// Measured from THIS clip's alpha matte with scripts/measure-matte.py:
// t=1.25: head y310, cx569; t=5.62: y311, cx537;
// t=9.36: y318, cx524; t=13.90: y317, cx489.
// Screen head = 960+(head-960)*S; S~1.034/1.046/1.056/1.069 =>
// y288/281/282/273. Large glyphs cross the silhouette, while the upper
// portion and lateral letters stay readable (checked in rendered stills).
export const BEHIND_WORDS: BehindWord[] = [
  // "donos de NEGÓCIOS sérios" — núcleo do hook, branco.
  { text: "NEGÓCIOS", from: 0.68, to: 1.82, top: 175, size: 225 },
  // "o FATURAMENTO para junto" — consequência, branco.
  { text: "FATURAMENTO", from: 4.74, to: 6.5, top: 200, size: 170 },
  // "isso é APOSTA" — vilão; contorno vermelho, não título sólido.
  {
    text: "APOSTA",
    from: 8.82,
    to: 9.92,
    top: 135,
    size: 265,
    style: "outline",
    color: "#FF3B30",
    rotate: -2,
  },
  // "eles têm um SISTEMA" — conceito vendido, amarelo. 2 palavras coloridas.
  {
    text: "SISTEMA",
    from: 13.36,
    to: 14.44,
    top: 150,
    size: 250,
    color: "#FFD60A",
  },
];
export const EXTRA_PUNCHES_S = BEHIND_WORDS.map((word) => word.from);
export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((word) => ms >= word.from * 1000 && ms < word.to * 1000);
