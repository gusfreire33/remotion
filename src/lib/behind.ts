/**
 * PALAVRAS ATRÁS DA PESSOA (estilo Captions).
 *
 * Nos momentos mais marcantes da fala, a palavra entra em tipografia gigante
 * ATRÁS do apresentador — ele passa na frente do texto.
 *
 * Como funciona a mágica: `scripts/make-matte.py` recorta a pessoa do vídeo
 * base (MediaPipe) e grava `public/matte-pessoa.webm` com canal alfa. No
 * `MeuVideo.tsx` a pilha fica:
 *
 *     [vídeo base]  ->  [ESTE texto]  ->  [recorte da pessoa]
 *
 * Como o recorte sai do mesmo frame do vídeo base, as duas camadas de vídeo
 * recebem exatamente o MESMO zoom — o encaixe é pixel a pixel.
 *
 * Regra de ouro: estas janelas NÃO podem colidir com beats de B-roll
 * full-bleed (lá o vídeo base não está na tela, então não há o que recortar).
 */
export type BehindWord = {
  /** o que aparece atrás (pode quebrar em 2 linhas com \n) */
  text: string;
  from: number;
  to: number;
  /**
   * Topo do bloco no design 1080x1920.
   *
   * No enquadramento deste vídeo a cabeça começa em ~y=550 e o queixo fica em
   * ~y=1000. Os valores abaixo põem a BASE do texto por volta de 620–690, de
   * propósito: assim a palavra CRUZA a cabeça e os ombros — que é o que faz o
   * efeito "atrás da pessoa" ser percebido. Texto todo acima de 540 flutuaria
   * no vazio e o recorte não apareceria.
   */
  top?: number;
  /** tamanho da fonte (default 190) */
  size?: number;
  /** inclinação em graus */
  rotate?: number;
  /** "solid" = preenchida | "outline" = só contorno */
  style?: "solid" | "outline";
  /** cor do texto (default branco) */
  color?: string;
};

export const BEHIND_WORDS: BehindWord[] = [
  // "Chat GPT Ads" — o título do vídeo, abre grande atrás dele
  {
    text: "CHATGPT\nADS",
    from: 0.15,
    to: 1.55,
    // 270 (e não 320): com duas linhas, a de baixo ("ADS") sumia quase inteira
    // atrás da cabeça. Aqui ela fica cortada pela metade — que é o ponto certo.
    top: 270,
    size: 200,
    style: "solid",
  },
  // "o Google foi deixado como uma rede de pesquisa..."
  {
    text: "GOOGLE",
    from: 7.2,
    to: 8.7,
    top: 480,
    size: 200,
    rotate: -4,
    style: "outline",
  },
  // "passou a pesquisar muito mais por soluções"
  {
    text: "PESQUISAR",
    from: 12.55,
    to: 14.35,
    top: 500,
    size: 150,
    style: "solid",
  },
  // "se tornou uma rede de INTENÇÃO"
  {
    text: "INTENÇÃO",
    from: 19.35,
    to: 21.05,
    top: 470,
    size: 175,
    style: "solid",
    color: "#FFD60A",
  },
  // "dar o mesmo tipo de segmentação"
  {
    text: "SEGMENTAÇÃO",
    from: 25.85,
    to: 27.0,
    top: 510,
    size: 118,
    style: "solid",
  },
  // "mas de uma forma muito mais eficiente"
  {
    text: "EFICIENTE",
    from: 35.85,
    to: 36.9,
    top: 490,
    size: 158,
    rotate: 3,
    style: "solid",
    color: "#30D158",
  },
  // "está disponível apenas para algumas contas"
  {
    text: "POUCAS\nCONTAS",
    from: 40.95,
    to: 42.4,
    top: 360,
    size: 165,
    style: "outline",
  },
  // "se a sua conta foi uma das sorteadas"
  {
    text: "SORTEADAS",
    from: 43.7,
    to: 45.2,
    top: 500,
    size: 148,
    style: "solid",
    color: "#FFD60A",
  },
  // "se você está dentro do nicho de saúde"
  {
    text: "SAÚDE",
    from: 50.3,
    to: 51.8,
    top: 460,
    size: 205,
    style: "solid",
    color: "#FF3B30",
  },
  // CTA — a palavra que ele pede pra comentar
  {
    text: "VAZAMENTO",
    from: 59.25,
    to: 61.05,
    top: 490,
    size: 150,
    style: "solid",
    color: "#FFD60A",
  },
];

/** true se o frame (em ms) cai dentro de alguma janela de palavra atrás. */
export const isBehindWindow = (ms: number): boolean =>
  BEHIND_WORDS.some((w) => ms >= w.from * 1000 && ms < w.to * 1000);
