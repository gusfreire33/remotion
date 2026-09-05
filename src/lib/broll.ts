/**
 * B-ROLL — mídia gratuita do Pexels, amarrada aos beats de `beats.ts` pela
 * mesma chave. Cada clipe ilustra LITERALMENTE o que está sendo dito naquele
 * trecho da fala. Nada de imagem aleatória.
 *
 * "Vídeo 29" (os três 10 da venda / confiança) tem DUAS inserções. O roteiro
 * é quase todo sobre um conceito abstrato (confiança, os 10, pontos abertos)
 * e só duas frases citam uma coisa concreta e filmável: "o script de venda"
 * e "como você transmite essas ideias".
 */
export type BRollClip = {
  key: string;
  slug: string;
  kind: "video" | "photo";
  layout: "full" | "card";
  startAt?: number;
  zoom?: [number, number];
  pan?: [number, number];
  speed?: number;
  loopFrames?: number;
  cardTop?: number;
  cardHeight?: number;
};

export const BROLL: BRollClip[] = [
  // "lá no seu script de venda" — homem de terno escrevendo no bloco.
  // Full-bleed: a frase é sobre a COISA. startAt corta a gordura inicial.
  //
  // ⚠️ Full-bleed: nenhuma palavra-atrás pode cair aqui. A janela
  // 20,34–22,20s está limpa de `BEHIND_WORDS` (AJUSTES começa em 22,48s).
  {
    key: "scriptVenda",
    slug: "script-venda",
    kind: "video",
    layout: "full",
    startAt: 1.2,
    zoom: [1.05, 1.15],
  },

  // "como você transmite essas ideias" — um homem pitchando uma ideia.
  // Full-bleed: a frase é sobre a coisa (transmitir, apresentar).
  //
  // ⚠️ Janela 26,50–28,10s limpa de `BEHIND_WORDS` (VAZAMENTO começa em 32,04s).
  {
    key: "transmiteIdeias",
    slug: "transmite-ideias",
    kind: "video",
    layout: "full",
    startAt: 1.0,
    zoom: [1.06, 1.16],
  },
];
